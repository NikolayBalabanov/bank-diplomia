import { el, setChildren } from 'redom'
import './header.scss'

export function getHeader(menu = false, target = '') {
  if (!menu) {
    const header = el('header', { class: 'header' })
    const headerContainer = el('div', { class: 'container header__container' })
    const headerLeft = el('div', { class: 'header__left' })
    const logo = el('a', { class: 'header__logo' }, 'Coin.')
    setChildren(headerLeft, logo)
    setChildren(headerContainer, headerLeft)
    setChildren(header, headerContainer)

    return header
  } else {
    const header = el('header', { class: 'header' })
    const headerContainer = el('div', { class: 'container header__container' })
    const headerLeft = el('div', { class: 'header__left' })
    const logo = el('a', { class: 'header__logo' }, 'Coin.')

    const headerRight = el('div', { class: 'header__right' })
    const burger = el('button.burger', el('span.burger__line'))
    const nav = el('ul', { class: 'header_nav nav list-reset' })
    const banksItem = el('li', { class: 'nav__item' })
    const accountsItem = el('li', { class: 'nav__item' })
    const currenciesItem = el('li', { class: 'nav__item' })
    const exitItem = el('li', { class: 'nav__item' })
    const banksLink = el(
      'a',
      {
        class: `nav__link ${target === 'Банкоматы' ? 'nav__link--active' : ''}`,
        href: '/banks',
        'data-navigo': '',
      },
      'Банкоматы'
    )
    const accountsLink = el(
      'a',
      {
        class: `nav__link ${target === 'Счета' ? 'nav__link--active' : ''}`,
        href: '/accounts',
        'data-navigo': '',
      },
      'Счета'
    )
    const currenciesLink = el(
      'a',
      {
        class: `nav__link ${target === 'Валюта' ? 'nav__link--active' : ''}`,
        href: '/currencies',
        'data-navigo': '',
      },
      'Валюта'
    )
    const exitLink = el(
      'li',
      { class: 'nav__item' },
      el(
        'a',
        { class: 'nav__link exit', href: '/auth', 'data-navigo': '' },
        'Выйти'
      )
    )
    const navWrapp = el('div.nav-wrapp')
    setChildren(headerLeft, logo)
    setChildren(headerRight, [burger, navWrapp])
    setChildren(navWrapp, nav)
    setChildren(nav, [banksItem, accountsItem, currenciesItem, exitItem])
    setChildren(banksItem, banksLink)
    setChildren(accountsItem, accountsLink)
    setChildren(currenciesItem, currenciesLink)
    setChildren(exitItem, exitLink)

    setChildren(headerContainer, [headerLeft, headerRight])
    setChildren(header, headerContainer)

    const navLinks = [banksLink, accountsLink, currenciesLink, exitLink]

    burger.addEventListener('click', () => {
      burger.classList.toggle('burger--active')
      nav.classList.toggle('nav--active')
      navWrapp.classList.toggle('nav-wrapp--active')
    })

    navLinks.forEach((el) => {
      el.addEventListener('click', () => {
        burger.classList.remove('burger--active')
        nav.classList.remove('nav--active')
        navWrapp.classList.remove('nav-wrapp--active')
      })
    })

    window.addEventListener('click', (e) => {
      if (e.target === navWrapp) {
        burger.classList.remove('burger--active')
        nav.classList.remove('nav--active')
        navWrapp.classList.remove('nav-wrapp--active')
      }
    })
    return header
  }
}
