import { el, setChildren } from 'redom'
export function createDetailsPlaceholder() {
  const account = el('div.details')
  const accountWrapUp = el('div.details__up.details__up--skeleton')
  const accountWrapMiddle = el('div.details__middle')
  const accountWrapBottom = el('div.details__bottom.details__bottom--skeleton')
  const transactionWrap = el(
    'div.details__balance-history.balance-history.details__balance-history--skeleton'
  )
  const historyWrap = el(
    'div.details__balance-history.balance-history.details__balance-history--skeleton'
  )

  setChildren(account, [accountWrapUp, accountWrapMiddle, accountWrapBottom])
  setChildren(accountWrapMiddle, [transactionWrap, historyWrap])
  return account
}
