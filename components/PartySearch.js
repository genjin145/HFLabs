import { fetchSuggestions } from '../api'
import { debounce } from '../helpers'

const wrapperTemplate = document.createElement('template')
const itemTemplate = document.createElement('template')

wrapperTemplate.innerHTML = `
  <input type="text"/>
  <ul></ul>
`

itemTemplate.innerHTML = `
  <li>
    <button></button>
  </li>
`

export class PartySearch extends HTMLElement {
  constructor() {
    super()
    this.append(wrapperTemplate.content.cloneNode(true))
  }

  toggle(flag) {
    if (flag) {
      this.classList.add('visible')
    } else {
      this.classList.remove('visible')
    }
  }

  connectedCallback() {
    const input = this.querySelector('input')
    const ul = this.querySelector('ul')

    const debounceQuery = debounce((query) => {
      fetchSuggestions({ query, count: 5 }).then((data) => {
        if (!data) return

        const { suggestions } = data

        ul.textContent = ''

        suggestions.forEach(({ value, data }) => {
          const li = itemTemplate.content.cloneNode(true)
          const button = li.querySelector('button')

          button.textContent = `${data.inn} ${value}`
          button.addEventListener('click', () => {
            input.value = value
            this.dispatchEvent(new CustomEvent('chooseParty', { detail: data }))
            this.toggle(false)
          })
          ul.append(li)
        })

        if (ul.firstChild && query.length) {
          this.toggle(true)
        } else {
          this.toggle(false)
        }
      })
    }, 300)

    input.placeholder = this.getAttribute('placeholder') || ''
    input.addEventListener('input', (evt) => {
      const query = evt.target.value
      if (query) debounceQuery(query)
    })

    document.addEventListener('click', (evt) => {
      if (evt.target === input && ul.firstChild) {
        this.toggle(true)
      } else {
        this.toggle(false)
      }
    })
  }
}

customElements.define('party-search', PartySearch)
