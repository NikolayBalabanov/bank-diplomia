import { el, setChildren } from 'redom'
import './errorModal.scss'

export function createModal({ titleText, btn, callback, context }) {
  const modalElement = el('div.modal')
  const contentWrap = el('div.modal__wrap')
  const title = el('h3.modal__title', `${titleText}`)
  const btnWrap = el('div.modal__submit-wrap')
  const submitBtn = el('button.modal__submit.btn', `${btn}`)
  const closeBtn = el('button.modal__close')
  closeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41L12.59 0Z" fill="#182233"/>
  </svg>
  `
  setChildren(modalElement, contentWrap)
  setChildren(contentWrap, [title, btnWrap, closeBtn])
  setChildren(btnWrap, submitBtn)

  submitBtn.addEventListener('click', () => {
    contentWrap.classList.add('modal__wrap--hidden')
    setTimeout(() => {
      modalElement.remove()
    }, 200)
    callback(context)
  })

  closeBtn.addEventListener('click', () => {
    contentWrap.classList.add('modal__wrap--hidden')
    setTimeout(() => {
      modalElement.remove()
    }, 200)
  })

  return modalElement
}
