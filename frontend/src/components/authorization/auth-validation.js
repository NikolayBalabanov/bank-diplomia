import { el, setChildren } from 'redom'
import { getAuth } from '../authorization/authorization'

export async function authValidation(field) {
  // console.log('qwe', field)
  const login = field.login
  const pass = field.pass
  if (isValidVal(login.value) && isValidVal(pass.value)) {
    const authInfo = await getAuth(login.value, pass.value)
    console.log('Ответ сервера', authInfo)
    if (authInfo.payload) {
      localStorage.setItem('token', authInfo.payload.token)
      console.log(document.location)
      document.location.pathname = ''
    } else {
      console.log(authInfo.error)
      if (authInfo.error === 'No such user') {
        login.classList.add('auth__input--incorrect')
        field.loginLabel.classList.remove('auth__label--correct')
        validationNotice(field.loginLabel, 'No such user')
      }
      if (authInfo.error === 'Invalid password') {
        pass.classList.add('auth__input--incorrect')
        field.passLabel.classList.remove('auth__label--correct')
        validationNotice(field.passLabel, 'Invalid password')
      }
    }
  } else {
    if (!isValidVal(login.value)) {
      login.classList.add('auth__input--incorrect')
      validationNotice(
        field.loginLabel,
        'Логин должен содержать не менее 6 символов'
      )
    }

    if (!isValidVal(pass.value)) {
      pass.classList.add('auth__input--incorrect')
      validationNotice(
        field.passLabel,
        'Пароль должен содержать не менее 6 символов'
      )
    }
  }
  // return field.value.trim().length >= 6
}

export function isValidVal(val) {
  return val.trim().length >= 6
}

export function validationNotice(target, errText) {
  const prevWrap = target.querySelector('.auth__label .error-notice')
  prevWrap?.remove()
  const noticeWrap = el('div', { class: 'error-notice' })
  const noticeImg = el('span', { class: 'error-notice__img' })
  const noticeText = el('span', { class: 'error-notice__text' }, `${errText}`)
  setChildren(noticeWrap, [noticeImg, noticeText])
  target.append(noticeWrap)
  return noticeWrap
}

export function removeValidationNotice(target) {
  const prevWrap = target.querySelector('.auth__label .error-notice')
  prevWrap?.remove()
}
