import { el } from 'redom'

export function createAccountsListItem(number) {
  return el('li.dropdown__item', `${number}`)
}
