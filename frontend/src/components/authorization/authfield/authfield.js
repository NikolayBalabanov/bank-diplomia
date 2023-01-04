import { el, setChildren } from 'redom'
import { inputChecker } from '../../../utils/inputChecker'
import { checkForm } from '../../../utils/checkForm'
import { removeValidationNotice } from '../../../utils/removeValidationNotice'
import { isValidVal, authValidation } from '../authValidation'
import './authfield.scss'

export function getAuthField() {
  const authWrap = el('div', { class: 'auth' })
  const authContainer = el('div', { class: 'container auth__container' })
  const authFormWrap = el('form', { class: 'auth__form' })
  const authHeader = el('h2', { class: 'auth__header' }, 'Вход в аккаунт')
  const logContentWrap = el('div.input__content')
  const logLabel = el('label', { class: 'input__label' })
  const logSubtitle = el('h3', { class: 'input__subtitle' }, 'Логин')
  const logInputWrap = el('div', { class: 'input__input-wrapper' })
  const log = el('input.input__input.login', {
    type: 'text',
    placeholder: 'Login',
    autocomplete: 'username',
    required: 'required',
  })
  const logSeccessImg = el('span.input__success-img')

  const passContentWrap = el('div.input__content')
  const passLabel = el('label', { class: 'input__label' })
  const passSubtitle = el('h3', { class: 'input__subtitle' }, 'Пароль')
  const passInputWrap = el('div', { class: 'input__input-wrapper' })
  const pass = el('input.input__input.password', {
    type: 'password',
    placeholder: 'Password',
    autocomplete: 'current-password',
    required: 'required',
  })
  const passSeccessImg = el('span.input__success-img')

  const authSubmitBtn = el(
    'button.auth__btn.btn',
    { type: 'submit', disabled: true },
    'Войти'
  )

  setChildren(logContentWrap, logLabel)
  setChildren(logLabel, [logSubtitle, logInputWrap])
  setChildren(logInputWrap, [log, logSeccessImg])

  setChildren(passContentWrap, passLabel)
  setChildren(passLabel, [passSubtitle, passInputWrap])
  setChildren(passInputWrap, [pass, passSeccessImg])
  setChildren(authFormWrap, [
    authHeader,
    logContentWrap,
    passContentWrap,
    authSubmitBtn,
  ])
  setChildren(authContainer, authFormWrap)
  setChildren(authWrap, authContainer)

  log.addEventListener('blur', () => {
    checkForm(isValidVal(log.value), isValidVal(pass.value), authSubmitBtn)
    inputChecker(
      isValidVal(log.value),
      logInputWrap,
      logContentWrap,
      'Логин должен содержать не менее 6 символов',
      true
    )
  })

  log.addEventListener('focus', () => {
    checkForm(isValidVal(log.value), isValidVal(pass.value), authSubmitBtn)
    logInputWrap.classList.remove('input__input-wrapper--incorrect')
    removeValidationNotice(logContentWrap)
  })

  pass.addEventListener('blur', () => {
    checkForm(isValidVal(log.value), isValidVal(pass.value), authSubmitBtn)
    inputChecker(
      isValidVal(pass.value),
      passInputWrap,
      passContentWrap,
      'Пароль должен содержать не менее 6 символов',
      true
    )
  })

  pass.addEventListener('focus', () => {
    checkForm(isValidVal(log.value), isValidVal(pass.value), authSubmitBtn)
    pass.classList.remove('input__input-wrapper--incorrect')
    removeValidationNotice(passContentWrap)
  })

  authFormWrap.addEventListener('input', () => {
    checkForm(isValidVal(log.value), isValidVal(pass.value), authSubmitBtn)
  })

  authSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    authValidation({
      form: authWrap,
      login: log,
      pass: pass,
      btn: authSubmitBtn,
      loginContent: logContentWrap,
      logInputWrap: logInputWrap,
      passContent: passContentWrap,
      passInputWrap: passInputWrap,
    })
  })

  return {
    form: authWrap,
    login: log,
    pass: pass,
    btn: authSubmitBtn,
    loginContent: logContentWrap,
    logInputWrap: logInputWrap,
    passContent: passContentWrap,
    passInputWrap: passInputWrap,
  }
}
