import { el, setChildren } from 'redom'
import Choices from 'choices.js'
import './accountsLayout.scss'
import { router } from '../../../index.js'
import { Api } from '../../../api/Api'
import { createModal } from '../../errorModal/errorModal'
import { getAccountList } from '../getAccountList'
import { sortAccountsByNumber } from '../sortAccountsByNumber'
import { sortAccountsByLastTransaction } from '../sortAccountsByLastTransaction'
import { createAccountPlaceholder } from '../createAccountPlaceholder'
import { sortAccountsByBalance } from '../sortAccountsByBalance'

export function getAccountsLayout() {
  let accountsList

  const container = el('main', { class: 'container accounts' })

  const header = el('section', { class: 'accounts__header accounts-header' })

  const headerLeft = el('div', { class: 'accounts-header__left' })
  const title = el(
    'h2',
    { class: 'accounts-header__title heading' },
    'Ваши счета'
  )

  const select = el('select', {
    class: 'accounts-header__select',
    name: 'sort-type',
  })

  const sortPreview = el(
    'option',
    { class: 'accounts-header__option', value: '' },
    'Сортировка'
  )
  const sortByNum = el(
    'option',
    {
      class: 'accounts-header__option',
      value: 'number',
    },
    'По номеру'
  )
  const sortByBalance = el(
    'option',
    {
      class: 'accounts-header__option',
      value: 'balance',
    },
    'По балансу'
  )
  const sortByLastTransaction = el(
    'option',
    {
      class: 'accounts-header__option',
      value: 'last',
    },
    'По последней транзакции'
  )
  const headerRight = el('div', { class: 'accounts-header__right' })
  const addNewAccoutBtn = el('button.accounts-header__new-acc-btn.btn')
  const addNewAccoutBtnText = el('span.btn__text', 'Создать новый счёт')

  const main = el('section', { class: 'accounts__main' })

  for (let i = 0; i < 5; i++) {
    main.append(createAccountPlaceholder())
  }

  setChildren(headerRight, addNewAccoutBtn)
  setChildren(addNewAccoutBtn, addNewAccoutBtnText)

  setChildren(headerLeft, [title, select])

  setChildren(select, [
    sortPreview,
    sortByNum,
    sortByBalance,
    sortByLastTransaction,
  ])

  setChildren(header, [headerLeft, headerRight])

  setChildren(container, [header, main])

  // eslint-disable-next-line no-unused-vars
  const selectChoices = new Choices(select, {
    searchEnabled: false,
    position: 'auto',
    shouldSort: false,
    placeholder: true,
    allowHTML: true,
    itemSelectText: '',
  })

  getInfo()

  async function getInfo() {
    const info = await Api.getAccounts(localStorage.getItem('token'))
    if (info.payload) {
      accountsList = info.payload.slice()
      getAccountList(accountsList, main)
    } else {
      if (info.error === 'Unauthorized') {
        // loader.remove()
        let data = {
          titleText: 'Упс! Проблама с авторизацией',
          btn: 'Войти снова',
          callback: () => router.navigate('/auth'),
        }
        const modal = createModal(data)
        document.body.append(modal)
      } else {
        // loader.remove()
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

  select.addEventListener('change', () => {
    let sortedAccountsList = accountsList.slice()
    switch (select.value) {
      case 'number':
        sortAccountsByNumber(sortedAccountsList, getAccountList, main)
        break
      case 'balance':
        sortAccountsByBalance(sortedAccountsList, getAccountList, main)
        break
      case 'last':
        sortAccountsByLastTransaction(sortedAccountsList, getAccountList, main)
        break
      default:
        getAccountList(accountsList, main)
        break
    }
  })

  addNewAccoutBtn.addEventListener('click', async () => {
    addNewAccoutBtnText.classList.add('loading')
    addNewAccoutBtn.setAttribute('disabled', 'disabled')
    const isSucces = await Api.createAccount(localStorage.getItem('token'))
    if (isSucces.payload) {
      addNewAccoutBtnText.classList.remove('loading')
      addNewAccoutBtn.removeAttribute('disabled', 'disabled')
      accountsList.push(isSucces.payload)
      getAccountList(accountsList, main)
    } else {
      addNewAccoutBtnText.classList.remove('loading')
      addNewAccoutBtn.removeAttribute('disabled', 'disabled')
      if (isSucces.error === 'Unauthorized') {
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
  })

  return container
}
