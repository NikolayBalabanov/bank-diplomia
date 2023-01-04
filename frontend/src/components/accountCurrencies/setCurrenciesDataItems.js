import { el, setChildren } from 'redom'

export function setCurrenciesDataItems(data) {
  const currenciesDataItems = []
  data
    .map((element) => element[1])
    .forEach((element) => {
      const item = el('li.currencies__item')
      const currency = el('span.currencies__currency', `${element.code}`)
      const line = el('div.currencies__line')
      const amount = el(
        'span.currencies__amount',
        `${Math.floor(element.amount * 100) / 100}`
      )
      setChildren(item, [currency, line, amount])
      currenciesDataItems.push(item)
    })
  return currenciesDataItems
}
