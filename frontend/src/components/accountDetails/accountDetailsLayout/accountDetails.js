import { el, setChildren } from 'redom'
import { getDynamics } from '../getDynamics'
import { getDifferense } from '../getDifferense'
import { getDetailsItem } from '../getDetailsItem'
import { router } from '../../../index.js'
import './accountDetails.scss'
import { Api } from '../../../api/Api'
import { createModal } from '../../errorModal/errorModal'
import { createDetailsPlaceholder } from '../createDetailsPlaceholder'

export function getAccountDetails(id) {
  const container = el('main', { class: 'container acc-details' })

  const header = el('section', {
    class: 'acc-details__header details-header',
  })

  const headerLeft = el('div', { class: 'details-header__left' })
  const title = el(
    'h2',
    { class: 'details-header__title heading' },
    'История баланса'
  )
  const headerRight = el('div', { class: 'details-header__right' })
  const backToAccoutBtn = el(
    'a.details-header__back-btn.account-header__back-btn .btn',
    {
      href: `/account/${id}`,
    }
  )
  backToAccoutBtn.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate(event.currentTarget.getAttribute('href'))
  })

  const backToAccoutBtnText = el('span.btn__text', 'Вернуться назад')

  const main = el('section', { class: 'acc-details__main' })
  const detailsPlaceholder = createDetailsPlaceholder()

  setChildren(main, detailsPlaceholder)
  setChildren(headerRight, backToAccoutBtn)
  setChildren(backToAccoutBtn, backToAccoutBtnText)
  setChildren(headerLeft, title)
  setChildren(header, [headerLeft, headerRight])
  setChildren(container, [header, main])

  getInfo()

  async function getInfo() {
    const info = await Api.getAccount(id, localStorage.getItem('token'))
    if (info.payload) {
      setDetailsFields(info.payload)
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

  function setDetailsFields(data) {
    main.innerHTML = ''
    main.append(getDetailsItem(data))
    getDynamics(data)
    getDifferense(data)
  }

  return container
}
