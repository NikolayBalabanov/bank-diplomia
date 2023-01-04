import { el, setChildren } from 'redom'
import { renderCurrensiesData } from './renderCurrensiesData'
import { setExchangeFormWrap } from './setExchangeFormWrap'
import { setExchangeRates } from './setExchangeRates'
import { setUserCurrencies } from './setUserCurrencies'

export function getCurrenciesItems() {
  const currencies = el('div.currencies')
  const left = el('div.currencies__left')
  const right = el('div.currencies__right')
  const userCurrencies = setUserCurrencies()
  const exchangeForm = setExchangeFormWrap()
  const exchangeRates = setExchangeRates()

  setChildren(currencies, [left, right])
  setChildren(left, [userCurrencies.currenciesWrap, exchangeForm.exchangeForm])
  setChildren(right, exchangeRates.exCurrenciesWrap)

  renderCurrensiesData(
    userCurrencies.currenciesList,
    exchangeForm.formContent,
    exchangeRates.exCurrenciesList
  )
  return currencies
}
