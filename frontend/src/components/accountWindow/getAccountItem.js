/* eslint-disable no-undef */
import { el, setChildren } from 'redom'
const creditCardType = require('credit-card-type')
import { createModal } from '../errorModal/errorModal'
import { checkForm } from '../../utils/checkForm'
import { inputChecker } from '../../utils/inputChecker'
import { removeValidationNotice } from '../../utils/removeValidationNotice'
import { getBalanceDynamics } from './getBalanceDynamics'
import { getAccountBalanseHistory } from './getAccountBalanseHistory'
import { getAccountTransactionsHistoryTable } from './getAccountTransactionsHistoryTable'
import {
  isValidNum,
  isValidSum,
  transactionFormValidation,
} from './transactionValidation'
import { DropDown } from './DropDown'

export function getAccountItem(data) {
  const account = el('div.account')
  const accountWrapUp = el('div.account__up')
  const accountValue = el('h3.account__value', `№ ${data.account}`)

  function createBalanceWrap(data) {
    const accountBalanceWrap = el('div.account__balance-wrap')
    const accountBalanceTitle = el(
      'h3.account__strong-text.account__heading',
      'Баланс'
    )
    const accountBalance = el('span.account__balance', `${data.balance} ₽`)
    setChildren(accountBalanceWrap, [accountBalanceTitle, accountBalance])
    return accountBalanceWrap
  }

  const accountWrapMiddle = el('div.account__middle')
  const accountWrapBottom = el('div.account__bottom')

  // Transaction FORM
  const transactionForm = el('form.account__form')
  const transactionFormTitle = el(
    'h3.account__strong-text.account__title',
    'Новый перевод'
  )
  const numberContentWrap = el('div', { class: 'input__content' })
  const numberSpanGroup = el('span.input-group-addon')
  const numberType = el('span.type.Span')
  const numberLabel = el('label', { class: 'input__label' })
  const numberSubtitle = el(
    'h3',
    { class: 'input__subtitle' },
    'Номер счёта получателя'
  )
  const numberInputWrap = el('div', { class: 'input__input-wrapper dropdown' })
  const number = el('input.card-number.input__input.type', {
    type: 'text',
    placeholder: 'Номер счёта',
    // autocomplete: 'username',
    required: 'required',
  })
  const numberSeccessImg = el('span.input__success-img')
  const accountsList = el('ul.list-reset.dropdown__list')

  const sumContentWrap = el('div', { class: 'input__content' })
  const sumLabel = el('label', { class: 'input__label' })
  const sumSubtitle = el('h3', { class: 'input__subtitle' }, 'Сумма перевода')
  const sumInputWrap = el('div', { class: 'input__input-wrapper' })
  const sum = el('input.input__input.amount', {
    type: 'text',
    placeholder: 'Сумма перевода',
    // autocomplete: 'username',
    required: 'required',
  })
  const sumSeccessImg = el('span.input__success-img')

  const transactionSubmitBtn = el(
    'button.account__btn.btn',
    { type: 'submit', disabled: true },
    'Отправить'
  )
  const historyTitle = el(
    'h3.account__strong-text.account__title',
    'История переводов'
  )

  const createTransactionTable = getAccountTransactionsHistoryTable(data)

  setChildren(accountWrapBottom, [
    historyTitle,
    createTransactionTable.tableLink,
  ])
  setChildren(accountWrapUp, [accountValue, createBalanceWrap(data)])
  setChildren(accountWrapMiddle, [
    transactionForm,
    getAccountBalanseHistory(data.account),
  ])

  setChildren(transactionForm, [
    transactionFormTitle,
    numberContentWrap,
    sumContentWrap,
    transactionSubmitBtn,
  ])
  setChildren(numberContentWrap, numberLabel)
  setChildren(numberLabel, [numberSubtitle, numberInputWrap])
  setChildren(numberInputWrap, [
    numberSpanGroup,
    number,
    numberSeccessImg,
    accountsList,
  ])
  setChildren(numberSpanGroup, numberType)

  setChildren(sumContentWrap, sumLabel)
  setChildren(sumLabel, [sumSubtitle, sumInputWrap])
  setChildren(sumInputWrap, [sum, sumSeccessImg])

  setChildren(account, [accountWrapUp, accountWrapMiddle, accountWrapBottom])
  // eslint-disable-next-line no-unused-vars

  const dropdown = new DropDown(numberInputWrap, number, accountsList)
  dropdown.update()

  sum.addEventListener('focus', () => {
    checkForm(
      isValidNum(number.value),
      isValidSum(sum.value),
      transactionSubmitBtn
    )
    sumInputWrap.classList.remove('input__input-wrapper--incorrect')
    removeValidationNotice(sumContentWrap)
  })

  sum.addEventListener('blur', () => {
    checkForm(
      isValidNum(number.value),
      isValidSum(sum.value),
      transactionSubmitBtn
    )

    inputChecker(
      isValidSum(sum.value),
      sumInputWrap,
      sumContentWrap,
      'Сумма не введена или неверный формат',
      true
    )
  })

  number.addEventListener('input', () => {
    let type =
      creditCardType(number.value.split(' ').join('')).length > 0
        ? creditCardType(number.value.split(' ').join(''))[0].type
        : ''
    numberType.innerHTML = `<i class="${type}" aria-hidden="true"></i>`
  })

  number.addEventListener('focus', () => {
    checkForm(
      isValidNum(number.value),
      isValidSum(sum.value),
      transactionSubmitBtn
    )
    numberInputWrap.classList.remove('input__input-wrapper--incorrect')
    removeValidationNotice(numberContentWrap)
  })

  number.addEventListener('blur', () => {
    checkForm(
      isValidNum(number.value),
      isValidSum(sum.value),
      transactionSubmitBtn
    )

    inputChecker(
      isValidSum(number.value),
      numberInputWrap,
      numberContentWrap,
      'Номер счёта не введён или неверный формат',
      true
    )
  })

  transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    // validation and server response
    const transactionStatus = await transactionFormValidation({
      form: transactionForm,
      number: number,
      sum: sum,
      btn: transactionSubmitBtn,
      numberContent: numberContentWrap,
      numberInputWrap: numberInputWrap,
      sumContent: sumContentWrap,
      sumInputWrap: sumInputWrap,
      account: data.account,
    })
    if (transactionStatus.payload) {
      const newData = transactionStatus.payload
      const createTransactionTable = getAccountTransactionsHistoryTable(newData)
      setChildren(accountWrapBottom, [
        historyTitle,
        createTransactionTable.tableLink,
      ])
      setChildren(accountWrapUp, [accountValue, createBalanceWrap(newData)])
      setChildren(accountWrapMiddle, [
        transactionForm,
        getAccountBalanseHistory(newData.account),
      ])
      getBalanceDynamics(newData)
    } else {
      let data = {
        titleText: 'Отсутствует связь с сервером, операция отменена.',
        btn: 'Окей',
        callback: () => console.log('Ошибка связи с сервером'),
      }
      const modal = createModal(data)
      document.body.append(modal)
    }
  })

  transactionForm.addEventListener('input', async (e) => {
    e.preventDefault()
    checkForm(
      isValidNum(number.value),
      isValidSum(sum.value),
      transactionSubmitBtn
    )
  })

  return account
}
