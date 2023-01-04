import { el, setChildren } from 'redom'
export function createPlaceholder(text) {
  const placeholder = el('div.placeholder')
  const placeholderText = el('span.placeholder__text', `${text}`)
  setChildren(placeholder, placeholderText)
  return placeholder
}
