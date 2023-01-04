import { el, setChildren } from 'redom'
import { getCurrenciesItems } from '../getCurrenciesItems'
import './accountCurrencies.scss'

export function getAccountCurrencies() {
  const container = el('main', { class: 'container currencies-container' })

  const header = el('section', {
    class: 'currencies-header',
  })
  const heading = el(
    'h2',
    { class: 'currencies-header__heading heading' },
    'Валютный обмен'
  )
  const main = getCurrenciesItems()
  setChildren(header, heading)
  setChildren(container, [header, main])
  return container
}
