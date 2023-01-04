import { el } from 'redom'

export function createAccountPlaceholder() {
  const skeleton = el('div.accounts-item.accounts-skeleton')
  return skeleton
}
