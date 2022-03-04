import './PartySearch'
import { join, typeDescription } from '../helpers'

const wrapperTemplate = document.createElement('template')
wrapperTemplate.innerHTML = `
<section>
  <h1>Компания или ИП</h1>
  <party-search
    placeholder="Введите название, ИНН, ОГРН или адрес организации"
  ></party-search>

  <p id="type"></p>
  <div class="row">
    <label>Краткое наименование</label>
    <input id="name_short" />
  </div>
  <div class="row">
    <label>Полное наименование</label>
    <input id="name_full" />
  </div>
  <div class="row">
    <label>ИНН / КПП</label>
    <input id="inn_kpp" />
  </div>
  <div class="row">
    <label>Адрес</label>
    <input id="address" />
  </div>
</section>
`

export class CompanyInfo extends HTMLElement {
  constructor() {
    super()
    this.append(wrapperTemplate.content.cloneNode(true))
  }

  connectedCallback() {
    const partySearch = this.querySelector('party-search')
    const typeNode = this.querySelector('#type')
    const nameShortNode = this.querySelector('#name_short')
    const nameFullNode = this.querySelector('#name_full')
    const innkpp = this.querySelector('#inn_kpp')
    const addressNode = this.querySelector('#address')

    const showSuggestion = ({ data }) => {
      if (!data) return

      const { type = '', name = '', address, inn = '', kpp = '' } = data

      typeNode.textContent = type && `${typeDescription(type)} (${type})`

      nameShortNode.value = name.short_with_opf || ''
      nameFullNode.value = name.full_with_opf || ''

      innkpp.value = join([inn, kpp], ' / ')

      let addressValue
      if (address?.data?.qc === '0') {
        addressValue = join([address.data.postal_code, address.value])
      } else {
        addressValue = address?.data?.source || ''
      }
      addressNode.value = addressValue
    }

    partySearch.addEventListener('chooseParty', (evt) => {
      showSuggestion({ data: evt.detail })
    })
  }
}

customElements.define('company-info', CompanyInfo)
