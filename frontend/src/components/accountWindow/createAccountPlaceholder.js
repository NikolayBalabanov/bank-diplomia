import { el, setChildren } from 'redom'
export function createAccountPlaceholder() {
  const account = el('div.account')
  const accountWrapUp = el('div.account__up.account__up--skeleton')
  const accountWrapMiddle = el('div.account__middle')
  const accountWrapBottom = el('div.account__bottom.account__bottom--skeleton')
  const transactionForm = el('form.account__form.account__form--skeleton')
  const historyWrap = el(
    'div.account__balance-history.balance-history.account__balance-history--skeleton'
  )

  setChildren(account, [accountWrapUp, accountWrapMiddle, accountWrapBottom])
  setChildren(accountWrapMiddle, [transactionForm, historyWrap])
  return account
}
