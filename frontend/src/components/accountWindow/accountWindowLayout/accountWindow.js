import Cleave from 'cleave.js'
import { el, setChildren } from 'redom'
import { getBalanceDynamics } from '../getBalanceDynamics'
import { getAccountItem } from '../getAccountItem'
import { router } from '../../../index.js'
import './accountWindow.scss'
import { Api } from '../../../api/Api'
import { createModal } from '../../errorModal/errorModal'
import { createAccountPlaceholder } from '../createAccountPlaceholder'

export function getAccountWindow(id) {
  const container = el('main', { class: 'container accounts' })

  const header = el('section', { class: 'accounts__header accounts-header' })

  const headerLeft = el('div', { class: 'accounts-header__left' })
  const title = el(
    'h2',
    { class: 'accounts-header__title heading' },
    'Просмотр счёта'
  )
  const headerRight = el('div', { class: 'accounts-header__right' })
  const backToAccoutsBtn = el('a.accounts-header__back-btn.btn', {
    href: '/accounts',
  })

  backToAccoutsBtn.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate(event.currentTarget.getAttribute('href'))
  })

  const backToAccoutsBtnText = el('span.btn__text', 'Вернуться назад')

  const main = el('section', { class: 'account-window' })
  const accountPlaceholder = createAccountPlaceholder()

  setChildren(main, accountPlaceholder)
  setChildren(headerRight, backToAccoutsBtn)
  setChildren(backToAccoutsBtn, backToAccoutsBtnText)
  setChildren(headerLeft, title)
  setChildren(header, [headerLeft, headerRight])
  setChildren(container, [header, main])

  getInfo()

  async function getInfo() {
    const info = await Api.getAccount(id, localStorage.getItem('token'))
    if (info.payload) {
      setAccountFields(info.payload)
    } else {
      if (info.error === 'Unauthorized') {
        let data = {
          titleText: 'Упс! Проблама с авторизацией',
          btn: 'Войти снова',
          callback: () => router.navigate('/auth'),
        }
        const modal = createModal(data)
        document.body.append(modal)
      } else {
        let data = {
          titleText: 'Отсутствует связь с сервером',
          btn: 'Попробовать еще',
          callback: getInfo,
        }
        const modal = createModal(data)
        document.body.append(modal)
      }
    }
  }

  function setAccountFields(data) {
    main.innerHTML = ''
    main.append(getAccountItem(data))
    // eslint-disable-next-line no-unused-vars
    const numberMask = new Cleave('.card-number', {
      numeral: true,
      numeralPositiveOnly: true,
      numericOnly: true,
      numeralDecimalScale: 0,
      delimiter: ' ',
    })
    // eslint-disable-next-line no-unused-vars
    const sumMask = new Cleave('.amount', {
      numeral: true,
      numeralPositiveOnly: true,
      numericOnly: true,
      numeralDecimalScale: 0,
    })
    getBalanceDynamics(data)
  }

  return container
}
