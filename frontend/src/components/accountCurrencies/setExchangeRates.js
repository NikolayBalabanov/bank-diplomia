import { el, setChildren } from 'redom'
import 'simplebar'
import 'simplebar/dist/simplebar.css'

export function setExchangeRates() {
  const exCurrenciesWrap = el('div.currencies__wrap.currencies__wrap--darken')
  const exCurrenciesTitle = el('h3.currencies__title', 'Ваши валюты')
  const exCurrenciesList = el('ul.list-reset.currencies__list')
  const listWrapper = el('div.currencies__rates.currencies__rates--placeholder')
  setChildren(exCurrenciesWrap, [exCurrenciesTitle, listWrapper])
  setChildren(listWrapper, exCurrenciesList)
  return {
    exCurrenciesWrap,
    exCurrenciesList,
  }
}
