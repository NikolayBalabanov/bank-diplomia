import { el, setChildren } from 'redom'

export function getDetailsDynamics(name) {
  const historyWrap = el('div.details__balance-history.balance-history')
  const historyTitle = el(
    'h3.details__strong-text.details__title',
    name === 'dynamics'
      ? 'Динамика баланса'
      : 'Соотношение входящих исходящих транзакций'
  )
  const historyChart = el(
    `div.balance-history__chart-wrap.${name}-wrap.chart-container`
  )
  const historyBar = el(`canvas#${name}.balance-history__dynamic`)

  setChildren(historyChart, historyBar)
  setChildren(historyWrap, historyTitle, historyChart)

  return historyWrap
}
