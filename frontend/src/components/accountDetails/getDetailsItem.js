import { el, setChildren } from 'redom'
import { getDetailsDynamics } from './getDetailsDynamics'
import { getAccountTransactionsHistoryTable } from './getDetailsTransactionsHistoryTable'

export function getDetailsItem(data) {
  const details = el('div.details')
  const detailsWrapUp = el('div.details__up')
  const detailsValue = el('h3.details__value', `№ ${data.account}`)

  function createBalanceWrap(data) {
    const detailsBalanceWrap = el('div.details__balance-wrap')
    const detailsBalanceTitle = el(
      'h3.details__strong-text.details__heading',
      'Баланс'
    )
    const detailsBalance = el('span.details__balance', `${data.balance} ₽`)
    setChildren(detailsBalanceWrap, [detailsBalanceTitle, detailsBalance])
    return detailsBalanceWrap
  }

  const detailsWrapMiddle = el('div.details__middle')
  const detailsWrapBottom = el('div.details__bottom')

  // TransactionTable
  const historyTitle = el(
    'h3.account__strong-text.account__title',
    'История переводов'
  )
  const createTransactionTable = getAccountTransactionsHistoryTable(data)

  setChildren(detailsWrapBottom, [
    historyTitle,
    createTransactionTable.tableWrapper,
  ])
  setChildren(detailsWrapUp, [detailsValue, createBalanceWrap(data)])
  setChildren(detailsWrapMiddle, [
    getDetailsDynamics('dynamics'),
    getDetailsDynamics('difference'),
  ])

  setChildren(details, [detailsWrapUp, detailsWrapMiddle, detailsWrapBottom])
  // eslint-disable-next-line no-unused-vars

  return details
}
