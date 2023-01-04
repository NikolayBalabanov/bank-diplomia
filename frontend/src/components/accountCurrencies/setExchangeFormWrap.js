import { el, setChildren } from 'redom'

export function setExchangeFormWrap() {
  const exchangeForm = el('div.currencies__wrap')
  const exchangeTitle = el('h3.currencies__title', 'Обмен валюты')
  const formContent = el(
    'div.currencies__form-wrap.currencies__form-wrap--placeholder'
  )
  setChildren(exchangeForm, [exchangeTitle, formContent])
  return {
    exchangeForm,
    formContent,
  }
}
