import { el, setChildren } from 'redom'
import { router } from '../..'

export function getAccountItem(data) {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ]
  let date
  if (data.transactions[0]) {
    date = new Date(data.transactions[0].date).toLocaleDateString().split('/')
  }
  const account = el('div.accounts__item accounts-item')
  const accountWrapUp = el('div.accounts-item__up')
  const accountValue = el('h3.accounts-item__value', `${data.account}`)
  const accountBalance = el('span.accounts-item__balance', `${data.balance} ₽`)

  const accountWrapDown = el('div.accounts-item__down')
  const accountInfo = el('div.accounts-item__info')
  const accountTransaction = el(
    'span.accounts-item__transaction',
    'Последняя транзакция:'
  )
  const accountTransactionDate = el(
    'span.accounts-item__date',
    `${
      data.transactions[0]
        ? date[1] + ' ' + months[date[0] - 1] + ' ' + date[2]
        : '-'
    }`
  )
  const accountOpenBtn = el(
    `a#${data.account}.accounts-item__open-btn.btn`,
    { href: `/account/${data.account}` },
    'Открыть'
  )

  accountOpenBtn.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate(event.target.getAttribute('href'))
  })

  setChildren(accountInfo, [accountTransaction, accountTransactionDate])
  setChildren(accountWrapDown, [accountInfo, accountOpenBtn])
  setChildren(accountWrapUp, [accountValue, accountBalance])
  setChildren(account, [accountWrapUp, accountWrapDown])
  return account
}
