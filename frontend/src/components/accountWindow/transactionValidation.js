import { inputChecker } from '../../utils/inputChecker'
import { el } from 'redom'
import { Api } from '../../api/Api'
import { accountsSaver } from './accountsSaver'
import { createModal } from '../errorModal/errorModal'
import { router } from '../..'

export async function transactionFormValidation({
  number,
  sum,
  btn,
  numberContent,
  numberInputWrap,
  sumContent,
  sumInputWrap,
  account,
}) {
  number.setAttribute('disabled', 'disabled')
  sum.setAttribute('disabled', 'disabled')
  const loader = el('div.btn--loader')
  btn.append(loader)
  const transactionData = {
    from: account,
    to: number.value.split(' ').join(''),
    amount: sum.value.split(',').join(''),
  }
  const transferPayBack = await Api.transferFunds(
    transactionData.from,
    transactionData.to,
    transactionData.amount,
    localStorage.getItem('token')
  )
  if (transferPayBack.payload) {
    loader.remove()
    btn.setAttribute('disabled', 'disabled')
    accountsSaver(number.value.split(' ').join(''))
    number.value = ''
    number.removeAttribute('disabled', 'disabled')
    numberInputWrap.classList.remove('input__input-wrapper--correct')

    sum.value = ''
    sum.removeAttribute('disabled', 'disabled')
    sumInputWrap.classList.remove('input__input-wrapper--correct')
    return transferPayBack
  } else if (transferPayBack.error) {
    loader.remove()
    number.removeAttribute('disabled', 'disabled')
    sum.removeAttribute('disabled', 'disabled')
    if (transferPayBack.error === 'Unauthorized') {
      let data = {
        titleText: 'Упс! Проблама с авторизацией',
        btn: 'Войти снова',
        callback: () => router.navigate('/auth'),
      }
      const modal = createModal(data)
      document.body.append(modal)
      return
    }
    switch (transferPayBack.error) {
      case 'Invalid account to':
        inputChecker(
          isValidNum(number.value),
          numberInputWrap,
          numberContent,
          'Счёт указанный для зачисления не существует',
          false
        )
        btn.setAttribute('disabled', 'disabled')
        break
      case 'Overdraft prevented':
        inputChecker(
          isValidSum(sum.value),
          sumInputWrap,
          sumContent,
          'Вы попытались перевести больше денег, чем доступно на счёте списания',
          false
        )
        btn.setAttribute('disabled', 'disabled')
        break
      default:
        inputChecker(
          isValidNum(number.value),
          numberInputWrap,
          numberContent,
          `${transferPayBack.error}`,
          false
        )
        btn.setAttribute('disabled', 'disabled')
        break
    }
  } else {
    loader.remove()
    return transferPayBack
  }
}

export function isValidNum(val) {
  return val.trim().length >= 12
}

export function isValidSum(val) {
  if (val.trim().length > 0) {
    let isCorrectSum = val.split('')[0]
    return isCorrectSum !== '0'
  }
  return false
}
