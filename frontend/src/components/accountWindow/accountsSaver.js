// eslint-disable-next-line no-undef
const creditCardType = require('credit-card-type')
export function accountsSaver(number) {
  let type =
    creditCardType(number).length > 0 ? creditCardType(number)[0].type : ''
  let numbersArray = JSON.parse(localStorage.getItem('numbersArray'))
  if (Array.isArray(numbersArray)) {
    if (numbersArray.length < 10) {
      if (!numbersArray.map((el) => el.number).includes(number)) {
        numbersArray.push({ number: number, type: type })
      }
    } else {
      if (!numbersArray.includes(number)) {
        numbersArray = numbersArray
          .slice(1)
          .push({ number: number, type: type })
      }
    }
    localStorage.setItem('numbersArray', JSON.stringify(numbersArray))
  } else {
    numbersArray = [{ number: number, type: type }]
    localStorage.setItem('numbersArray', JSON.stringify(numbersArray))
  }
}
