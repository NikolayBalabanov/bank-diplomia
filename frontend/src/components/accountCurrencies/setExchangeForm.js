/* eslint-disable no-unused-vars */
import { el, setChildren } from 'redom'
import Choices from 'choices.js'
import { checkForm } from '../../utils/checkForm'
import { inputChecker } from '../../utils/inputChecker'
import { removeValidationNotice } from '../../utils/removeValidationNotice'
import { isValidSum } from '../accountWindow/transactionValidation'
import { currencyBuyValidation } from './currencyBuyValidation'
import { setCurrenciesDataItems } from './setCurrenciesDataItems'

export function setExchangeForm(from, to, containerCurrencies) {
  const exchangeForm = el('form.exchange-form')
  const inputsWrap = el('div.exchange-form__inputs')
  const targetsWrap = el('div.exchange-form__targets')

  const selectFromWrap = el('div.exchange-form__select-wrap')
  const selectFromTitle = el('h3.exchange-form__title', 'Из')
  const selectFrom = el('select.exchange-form__from')
  const optionsForSelectFrom = setOptions(from)

  const selectToWrap = el('div.exchange-form__select-wrap')
  const selectToTitle = el('h3.exchange-form__title', 'в')
  const selectTo = el('select.exchange-form__to')
  const optionsForSelectTo = setOptions(to)

  const amountContentWrap = el('div', { class: 'input__content' })
  const amountLabel = el('label', { class: 'input__label' })
  const amountSubtitle = el(
    'h3',
    { class: 'input__subtitle exchange-form__title--amount' },
    'Сумма'
  )
  const amountInputWrap = el('div', { class: 'input__input-wrapper' })
  const amount = el('input.input__input.amount', {
    type: 'text',
    placeholder: 'Сумма',
    // autocomplete: 'username',
    required: 'required',
  })
  const amountSeccessImg = el('span.input__success-img')

  const sendBtn = el(
    'button.exchange-form__btn.btn',
    { disabled: true },
    'Обменять'
  )

  function setOptions(data) {
    const list = []
    data.forEach((element) => {
      const option = el(
        'option',
        {
          class: 'exchange-form__option',
          value: `${element}`,
        },
        `${element}`
      )
      list.push(option)
    })
    return list
  }

  setChildren(exchangeForm, [inputsWrap, sendBtn])
  setChildren(inputsWrap, [targetsWrap, amountContentWrap])
  setChildren(targetsWrap, [selectFromWrap, selectToWrap])
  setChildren(selectFromWrap, [selectFromTitle, selectFrom])
  setChildren(selectFrom, [...optionsForSelectFrom])
  setChildren(selectToWrap, [selectToTitle, selectTo])
  setChildren(selectTo, [...optionsForSelectTo])
  setChildren(amountContentWrap, amountLabel)
  setChildren(amountLabel, [amountSubtitle, amountInputWrap])
  setChildren(amountInputWrap, [amount, amountSeccessImg])

  amount.addEventListener('focus', () => {
    checkForm(
      isValidSum(amount.value),
      selectFrom.value !== selectTo.value,
      sendBtn
    )
    amountInputWrap.classList.remove('input__input-wrapper--incorrect')
    removeValidationNotice(amountContentWrap)
  })

  amount.addEventListener('blur', () => {
    checkForm(
      isValidSum(amount.value),
      selectFrom.value !== selectTo.value,
      sendBtn
    )

    inputChecker(
      isValidSum(amount.value),
      amountInputWrap,
      amountContentWrap,
      'Сумма не введена или неверный формат',
      true
    )
  })

  exchangeForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    // validation and server response
    const transactionStatus = await currencyBuyValidation({
      form: exchangeForm,
      from: selectFrom,
      to: selectTo,
      amount: amount,
      btn: sendBtn,
      amountContent: amountContentWrap,
      amountInputWrap: amountInputWrap,
    })
    if (transactionStatus.payload) {
      const newData = transactionStatus.payload
      const currenciesDataItems = setCurrenciesDataItems(
        Object.entries(newData)
      )
      setChildren(containerCurrencies, currenciesDataItems)
    }
  })

  exchangeForm.addEventListener('input', async (e) => {
    e.preventDefault()
    checkForm(
      isValidSum(amount.value),
      selectFrom.value !== selectTo.value,
      sendBtn
    )
  })
  exchangeForm.addEventListener('change', async (e) => {
    e.preventDefault()
    checkForm(
      isValidSum(amount.value),
      selectFrom.value !== selectTo.value,
      sendBtn
    )
  })

  const selectFromChoices = new Choices(selectFrom, {
    searchEnabled: false,
    position: 'auto',
    shouldSort: false,
    placeholder: true,
    allowHTML: true,
    itemSelectText: '',
  })

  const selectToChoices = new Choices(selectTo, {
    searchEnabled: false,
    position: 'auto',
    shouldSort: false,
    placeholder: true,
    allowHTML: true,
    itemSelectText: '',
  })

  return exchangeForm
}
