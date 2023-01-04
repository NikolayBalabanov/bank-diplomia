import 'babel-polyfill'
import 'normalize.css'
import './choices.css'
import 'simplebar/dist/simplebar.css'
import './style.scss'
import { setChildren } from 'redom'
import { getHeader } from './components/header/header'
import { getAuthField } from './components/authorization/authfield/authfield'
import { getAccountsLayout } from './components/accounts/accountsLayout/accountsLayout'
import { getAccountWindow } from './components/accountWindow/accountWindowLayout/accountWindow'
import Navigo from 'navigo'
import { getAccountDetails } from './components/accountDetails/accountDetailsLayout/accountDetails'
import { getAccountCurrencies } from './components/accountCurrencies/accountCurrenciesLayout/accountCurrencies'
import { getBankMapPage } from './components/bankMapPage/bankMapPage'
import { socket } from './components/accountCurrencies/renderCurrensiesData'
export const router = new Navigo('/')

export const setSocket = () => {
  new WebSocket('ws://localhost:3000/currency-feed')
}
router.hooks({
  before(done) {
    if (typeof socket === 'object') {
      socket.close()
    }
    done()
  },
})

router.on('/', () => {
  if (localStorage.getItem('token')) {
    router.navigate('/accounts')
  } else {
    router.navigate('/auth')
  }
})

router.on(
  '/auth',
  () => {
    setChildren(window.document.body, [getHeader(), getAuthField().form])
  },
  {
    before(done) {
      localStorage.removeItem('token')
      done()
    },
  }
)

router.on('/accounts', () => {
  setChildren(window.document.body, [
    getHeader(true, 'Счета'),
    getAccountsLayout(),
  ])
})

router.on('/banks', () => {
  setChildren(window.document.body, [
    getHeader(true, 'Банкоматы'),
    getBankMapPage(),
  ])
})

router.on('/currencies', () => {
  setChildren(window.document.body, [
    getHeader(true, 'Валюта'),
    getAccountCurrencies(),
  ])
})

router.on('/account/:id', ({ data: { id } }) => {
  setChildren(window.document.body, [getHeader(true), getAccountWindow(id)])
})

router.on('/details/:id', ({ data: { id } }) => {
  setChildren(window.document.body, [getHeader(true), getAccountDetails(id)])
})

router.resolve()
