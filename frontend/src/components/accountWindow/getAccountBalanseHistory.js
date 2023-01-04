import { el, setChildren } from 'redom'
import { router } from '../../index'

export function getAccountBalanseHistory(id) {
  const historyWrap = el('div.account__balance-history.balance-history')
  const historyTitle = el(
    'h3.account__strong-text.account__title',
    'Динамика баланса'
  )
  const historyChart = el('div.balance-history__chart-wrap.dynamics-wrap')
  const historyLink = el('a.balance-history__link chart-container', {
    href: `/details/${id}`,
    ariaLabel: 'Смотреть делатьную информацию',
    title: 'Смотреть делатьную информацию',
    'data-navigo': '',
  })
  historyLink.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate(event.currentTarget.getAttribute('href'))
  })
  const historyBar = el('canvas#dynamics.balance-history__dynamic')

  setChildren(historyChart, historyLink)
  setChildren(historyLink, historyBar)
  setChildren(historyWrap, historyTitle, historyChart)

  return historyWrap
}
