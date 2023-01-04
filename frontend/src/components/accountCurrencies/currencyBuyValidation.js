import { el } from 'redom'
import { router } from '../..'
import { Api } from '../../api/Api'
import { inputChecker } from '../../utils/inputChecker'
import { isValidSum } from '../accountWindow/transactionValidation'
import { createModal } from '../errorModal/errorModal'

export async function currencyBuyValidation({
  from,
  to,
  amount,
  btn,
  amountContent,
  amountInputWrap,
}) {
  amount.setAttribute('disabled', 'disabled')
  const loader = el('div.btn--loader')
  btn.append(loader)

  const currencyBuyData = {
    from: from.value, // код валютного счёта, с которого списываются средства
    to: to.value, // код валютного счёта, на который зачисляются средства
    amount: amount.value, // сумма, которая списывается, конвертация вычисляется сервером автоматически, исходя из текущего валютного курса для данной валютной пары
  }
  const transferPayBack = await Api.exchangeCurrency(
    currencyBuyData.from,
    currencyBuyData.to,
    currencyBuyData.amount,
    localStorage.getItem('token')
  )
  if (transferPayBack.payload) {
    loader.remove()
    btn.setAttribute('disabled', 'disabled')

    amount.value = ''
    amount.removeAttribute('disabled', 'disabled')
    amountInputWrap.classList.remove('exchange-form__input-wrapper--correct')

    return transferPayBack
  } else if (transferPayBack.error) {
    loader.remove()
    amount.removeAttribute('disabled', 'disabled')
    if (transferPayBack.error === 'Unauthorized') {
      let data = {
        titleText: 'Упс! Проблема с авторизацией',
        btn: 'Войти снова',
        callback: () => router.navigate('/auth'),
      }
      const modal = createModal(data)
      document.body.append(modal)
      return
    }
    switch (transferPayBack.error) {
      case 'Overdraft prevented':
        inputChecker(
          isValidSum(amount.value),
          amountInputWrap,
          amountContent,
          'Вы попытались перевести больше денег, чем доступно на счёте',
          false,
          'exchange-form'
        )
        btn.setAttribute('disabled', 'disabled')
        break
      case 'Unknown currency code':
        inputChecker(
          isValidSum(amount.value),
          amountInputWrap,
          amountContent,
          'Передан неверный валютный код, код не поддерживается системой (валютный код списания или валютный код зачисления',
          false,
          'exchange-form'
        )
        btn.setAttribute('disabled', 'disabled')
        break
      case 'Not enough currency':
        inputChecker(
          isValidSum(amount.value),
          amountInputWrap,
          amountContent,
          'На валютном счёте списания недостаточно средств',
          false,
          'exchange-form'
        )
        btn.setAttribute('disabled', 'disabled')
        break
      default:
        inputChecker(
          isValidSum(amount.value),
          amountInputWrap,
          amountContent,
          `${transferPayBack.error}`,
          false,
          'exchange-form'
        )
        btn.setAttribute('disabled', 'disabled')
        break
    }
  } else {
    let data = {
      titleText: 'Отсутствует связь с сервером, операция отменена.',
      btn: 'Окей',
      callback: () => console.log('Ошибка связи с сервером'),
    }
    const modal = createModal(data)
    document.body.append(modal)
  }
  return transferPayBack
}
