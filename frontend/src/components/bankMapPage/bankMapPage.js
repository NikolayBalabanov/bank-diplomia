import { el, setChildren } from 'redom'
import { createMap } from './createMap.js'
import './bankMapPage.scss'

export function getBankMapPage() {
  const container = el('main', { class: 'container bank-map' })
  const body = el('section', { class: 'bank-map__header' })
  const title = el(
    'h2',
    { class: 'bank-map__title heading' },
    'Карта банкоматов'
  )
  const mapWrap = el('div.#map', {
    class: 'bank-map__map bank-map__map-placeholder',
  })
  createMap(mapWrap)
  setChildren(container, body)
  setChildren(body, [title, mapWrap])

  return container
}
