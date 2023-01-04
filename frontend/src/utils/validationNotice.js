import { el, setChildren } from 'redom'

export function validationNotice(target, errText) {
  const prevWrap = target.querySelector(`.input__content .error-notice`)
  prevWrap?.remove()
  const noticeWrap = el('div', { class: 'error-notice' })
  const noticeImg = el('span', { class: 'error-notice__img' })
  const noticeText = el('span', { class: 'error-notice__text' }, `${errText}`)
  setChildren(noticeWrap, [noticeImg, noticeText])
  target.append(noticeWrap)
  return noticeWrap
}
