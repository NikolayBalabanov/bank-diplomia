import { el, setChildren } from 'redom'

export function setUserCurrencies() {
  const currenciesWrap = el('div.currencies__wrap')
  const currenciesTitle = el('h3.currencies__title', 'Ваши валюты')
  const currenciesList = el(
    'ul.list-reset.currencies__list.currencies__list--placeholder'
  )
  setChildren(currenciesWrap, [currenciesTitle, currenciesList])
  return {
    currenciesWrap,
    currenciesList,
  }
}
