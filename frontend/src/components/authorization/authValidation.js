import { el } from 'redom'
import { router } from '../..'
import { Api } from '../../api/Api'
import { inputChecker } from '../../utils/inputChecker'
import { createModal } from '../errorModal/errorModal'

export async function authValidation({
  login,
  pass,
  btn,
  loginContent,
  logInputWrap,
  passContent,
  passInputWrap,
}) {
  const loader = el('div.btn--loader')
  btn.append(loader)
  const authInfo = await Api.autorization(login.value, pass.value)
  if (authInfo.payload) {
    loader.remove()
    localStorage.setItem('token', authInfo.payload.token)
    router.navigate('/accounts')
  } else if (authInfo.error) {
    loader.remove()
    switch (authInfo.error) {
      case 'No such user':
        inputChecker(
          isValidVal(login.value),
          logInputWrap,
          loginContent,
          'Такого пользователя нет в системе',
          false
        )
        btn.setAttribute('disabled', 'disabled')
        break
      case 'Invalid password':
        inputChecker(
          isValidVal(pass.value),
          passInputWrap,
          passContent,
          'Неверный пароль',
          false
        )
        btn.setAttribute('disabled', 'disabled')
        break
      default:
        inputChecker(
          isValidVal(login.value),
          logInputWrap,
          loginContent,
          `${authInfo.error}`,
          false
        )
        btn.setAttribute('disabled', 'disabled')
        break
    }
  } else {
    loader.remove()
    let data = {
      titleText: 'Отсупствует связь с сервером',
      btn: 'Попробовать еще',
      callback: authValidation,
      context: {
        login,
        pass,
        btn,
        loginContent,
        logInputWrap,
        passContent,
        passInputWrap,
      },
    }
    const modal = createModal(data)
    document.body.append(modal)
  }
}

export function isValidVal(val) {
  return val.trim().length >= 6
}
