import { el, setChildren } from 'redom'

export function setExchangeRatesList(data) {
  data = data[0]
  const item = el('li.currencies__item')
  const currency = el('span.currencies__currency', `${data[0]}`)
  const line = el(
    `div.currencies__line.${
      data[1].change === -1 ? 'currencies__line--down' : 'currencies__line--up'
    }`
  )
  const amount = el('span.currencies__amount', `${data[1].rate}`)
  const rateFlow = el(`span.currencies__flow`)
  if (data[1].change === 1) {
    rateFlow.innerHTML = `<svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10L10 0L0 10L20 10Z" fill="#76CA66"/>
    </svg>`
  } else if (data[1].change === -1) {
    rateFlow.innerHTML = `<svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0L10 10L20 0H0Z" fill="#FD4E5D"/>
      </svg>
      `
  }
  setChildren(item, [currency, line, amount, rateFlow])
  return item
}
