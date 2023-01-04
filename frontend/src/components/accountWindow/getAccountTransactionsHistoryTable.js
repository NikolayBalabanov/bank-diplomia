import { el, setChildren } from 'redom'
import { createPlaceholder } from '../placeholder'
import { router } from '../../index.js'

export function getAccountTransactionsHistoryTable(data) {
  const tableLink = el('a.balance-history__link.table-container', {
    href: `/details/${data.account}`,
    ariaLabel: 'Смотреть делатьную информацию',
    title: 'Смотреть делатьную информацию',
    'data-navigo': '',
  })
  tableLink.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate(event.currentTarget.getAttribute('href'))
  })
  const table = el('table.account__table.table')
  const tHead = el('thead.table__thead')
  const headRow = el('tr.table__tr')

  const fromCell = el('th.table__head-cell')
  const toCell = el('th.table__head-cell')
  const amountCell = el('th.table__head-cell')
  const dateCell = el('th.table__head-cell')

  const from = el('span.table__head-text', 'Счёт отправителя')
  const to = el('span.table__head-text', 'Счёт получателя')
  const amount = el('span.table__head-text', 'Сумма')
  const date = el('span.table__head-text', 'Дата')
  const tBody = el('tbody.table__body')
  const bodyRows = []
  const tableData = data.transactions
  const currentAccount = data.account
  function getBodyRows(arr) {
    arr.forEach((item) => {
      const bodyRow = el('tr.table__tr')
      const fromCell = el('td.table__body-cell', `${item.from}`)
      const toCell = el('td.table__body-cell', `${item.to}`)
      const rawDate = new Date(item.date).toLocaleDateString().split('/')
      const date = [rawDate[1], rawDate[0], rawDate[2]].join('.')
      const amountCell = el(
        `td.table__body-cell${
          currentAccount === item.from
            ? '.table__body-cell--red'
            : '.table__body-cell--green'
        }`,
        `${
          currentAccount === item.from
            ? '- ' + item.amount + ' ₽'
            : '+ ' + item.amount + ' ₽'
        }`
      )
      const dateCell = el('td.table__body-cell', `${date}`)
      setChildren(bodyRow, [fromCell, toCell, amountCell, dateCell])
      bodyRows.push(bodyRow)
    })
  }
  if (tableData.length > 0 && tableData.length <= 10) {
    getBodyRows(tableData)
  } else if (tableData.length > 10) {
    const modifyTransData = tableData.filter((item, index) => {
      if (index > tableData.length - 11) return item
    })
    getBodyRows(modifyTransData)
  }

  setChildren(tableLink, table)
  if (tableData.length === 0) {
    const placeholder = createPlaceholder(
      'Здесь будет отображена история переводов...'
    )
    setChildren(tableLink, [table, placeholder])
  }
  setChildren(table, [tHead, tBody])
  setChildren(tHead, headRow)
  setChildren(headRow, [fromCell, toCell, amountCell, dateCell])
  setChildren(fromCell, from)
  setChildren(toCell, to)
  setChildren(amountCell, amount)
  setChildren(dateCell, date)
  setChildren(tBody, bodyRows)

  return {
    tableLink,
    tHead,
    tBody,
  }
}
