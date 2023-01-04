import Cleave from 'cleave.js'
import { setChildren } from 'redom'
import { router } from '../..'
import { Api } from '../../api/Api'
import { getWindowWidth } from '../../utils/getWindowWidth'
import { createModal } from '../errorModal/errorModal'
import { setCurrenciesDataItems } from './setCurrenciesDataItems'
import { setExchangeForm } from './setExchangeForm'
import { setExchangeRatesList } from './setExchangeRatesList'

export let socket = ''

export async function renderCurrensiesData(
  containerCurrencies,
  containerExchangeForm,
  containerExchangeRates
) {
  const userCurrencies = await Api.getCurrencyAccounts(
    localStorage.getItem('token')
  )
  const currenciesData = await Api.getCurrenciesData()
  if (userCurrencies.payload && currenciesData.payload) {
    socket = Api.getChangedCurrency()
    const currenciesDataItems = setCurrenciesDataItems(
      Object.entries(userCurrencies.payload)
    )
    const exchangeForm = setExchangeForm(
      Object.keys(userCurrencies.payload),
      currenciesData.payload,
      containerCurrencies
    )
    containerCurrencies.classList.remove('currencies__list--placeholder')
    containerExchangeForm.classList.remove('currencies__form-wrap--placeholder')
    containerExchangeRates.parentNode.classList.remove(
      'currencies__rates--placeholder'
    )
    setChildren(containerCurrencies, currenciesDataItems)
    setChildren(containerExchangeForm, exchangeForm)

    let exchangeRatesList = []
    socket.addEventListener('open', () => {
      console.log('[open] Соединение установлено')
      console.log('Ожидаю данные по конверсии валют от сервера...')
    })
    socket.addEventListener('close', (e) => {
      console.log('CLOSE', e)
    })
    socket.addEventListener('message', (e) => {
      let data = JSON.parse(e.data)
      let item = {}
      item[`${data.from}/${data.to}`] = { ...data }
      const exchangeRatesItem = setExchangeRatesList(Object.entries(item))
      let maxItems = getWindowWidth() > 900 ? 22 : 10

      window.addEventListener('resize', () => {
        maxItems = getWindowWidth() > 900 ? 22 : 10
        if (getWindowWidth() <= 900) {
          exchangeRatesList = exchangeRatesList.slice(10)
        }
      })

      if (exchangeRatesList.length < maxItems) {
        exchangeRatesList.push(exchangeRatesItem)
      } else {
        exchangeRatesList = exchangeRatesList.slice(1)
        exchangeRatesList.push(exchangeRatesItem)
      }
      setChildren(containerExchangeRates, exchangeRatesList)
    })
    // eslint-disable-next-line no-unused-vars
    const sumMask = new Cleave('.amount', {
      numeral: true,
      numeralPositiveOnly: true,
      numericOnly: true,
      numeralDecimalScale: 0,
    })
  } else {
    if (userCurrencies.error || currenciesData.error) {
      let data = {
        titleText: 'Упс! Проблема с авторизацией',
        btn: 'Войти снова',
        callback: () => router.navigate('/auth'),
      }
      const modal = createModal(data)
      document.body.append(modal)
    } else {
      let data = {
        titleText: 'Отсутствует связь с сервером',
        btn: 'Попробовать еще',
        callback: () => {
          renderCurrensiesData(
            containerCurrencies,
            containerExchangeForm,
            containerExchangeRates
          )
        },
      }
      const modal = createModal(data)
      document.body.append(modal)
    }
  }
}
