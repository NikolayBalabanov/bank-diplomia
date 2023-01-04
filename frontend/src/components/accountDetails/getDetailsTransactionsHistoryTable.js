import { el, setChildren } from 'redom'
import { createPlaceholder } from '../placeholder'

export function getAccountTransactionsHistoryTable(data) {
  const tableContainer = el('div.table-container')
  const tableWrapper = el('div.account__table-wrap')
  const paginationWrap = el('div.account__pagination-wrap')
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

  let bodyRows = []
  const tableData = data.transactions.reverse()
  const currentAccount = data.account
  const maxRows = 25
  let pages = Math.floor(tableData.length / maxRows)
  let curSlice = pages >= 6 ? 6 : pages
  let pageHelper = pages >= 6 ? 6 : pages
  let curPage = 1
  const pagination = getPagination()

  function paginationLogic(curPage) {
    if (curPage < 1) {
      curPage = 1
    }
    if (curPage === 1) {
      curSlice = pages >= 6 ? 6 : pages
    }
    if (curPage > curSlice) {
      if (curSlice < pages) {
        curSlice += 1
      } else if (curSlice === pages) {
        curPage = curSlice
      }
    }
    getBodyRows(tableData.slice((curPage - 1) * 25, 25 * curPage))
    pagination.paginationList.innerHTML = ''
    for (let page = 1 + curSlice - pageHelper; page < curSlice + 1; page++) {
      const paginationItem = getPaginationItem(page)
      paginationItem.btn.classList.remove('pagination__btn--active')
      if (page === curPage) {
        paginationItem.btn.classList.add('pagination__btn--active')
      }
      pagination.paginationList.append(paginationItem.item)
    }
    curPage === 1
      ? pagination.prevBtn.classList.add('pagination__prev--hidden')
      : pagination.prevBtn.classList.remove('pagination__prev--hidden')
    curPage === pages
      ? pagination.nextBtn.classList.add('pagination__next--hidden')
      : pagination.nextBtn.classList.remove('pagination__next--hidden')
    curSlice === pages
      ? pagination.paginationList.classList.remove('pagination__list--hide')
      : pagination.paginationList.classList.add('pagination__list--hide')
  }

  function getPagination() {
    const pagination = el('div.pagination')
    const prevBtn = el('button.pagination__prev')
    const nextBtn = el('button.pagination__next')
    const arrowImg = `<svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 0.75L1 5L5.5 9.25" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
    prevBtn.innerHTML = arrowImg
    nextBtn.innerHTML = arrowImg
    const paginationList = el('ul.pagination__list.list-reset')
    setChildren(pagination, [prevBtn, paginationList, nextBtn])

    prevBtn.addEventListener('click', () => {
      if (curPage === 1) return
      if (1 + curSlice - pageHelper === curPage && curPage !== 1) {
        curSlice -= 1
      }
      curPage -= 1
      paginationLogic(parseInt(curPage))
    })
    nextBtn.addEventListener('click', () => {
      if (curPage === pages) return
      curPage += 1
      paginationLogic(parseInt(curPage))
    })

    return {
      pagination,
      paginationList,
      prevBtn,
      nextBtn,
    }
  }

  function getPaginationItem(page) {
    const item = el('li.pagination__item')
    const btn = el('button.pagination__btn')
    btn.textContent = page
    setChildren(item, btn)
    btn.addEventListener('click', () => {
      curPage = parseInt(btn.textContent)
      paginationLogic(curPage)
    })
    return {
      item,
      btn,
    }
  }

  function getBodyRows(arr) {
    bodyRows = []
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
      setChildren(tBody, bodyRows)
    })
  }

  if (tableData.length > 0 && tableData.length <= maxRows) {
    getBodyRows(tableData)
  } else if (tableData.length > maxRows) {
    setChildren(paginationWrap, pagination.pagination)
    paginationLogic(curPage)
  } else {
    const placeholder = createPlaceholder(
      'Здесь будет отображена история переводов...'
    )
    setChildren(paginationWrap, placeholder)
  }
  setChildren(tableWrapper, [tableContainer, paginationWrap])
  setChildren(tableContainer, table)
  setChildren(table, [tHead, tBody])
  setChildren(tHead, headRow)
  setChildren(headRow, [fromCell, toCell, amountCell, dateCell])
  setChildren(fromCell, from)
  setChildren(toCell, to)
  setChildren(amountCell, amount)
  setChildren(dateCell, date)

  return {
    tableWrapper,
    tHead,
    tBody,
  }
}
