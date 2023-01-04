import { validationNotice } from './validationNotice'

export function inputChecker(
  isValidInputVal,
  inputWrap,
  contentWrap,
  text,
  backEnd = true
) {
  if (isValidInputVal && backEnd) {
    inputWrap.classList.remove(`input__input-wrapper--incorrect`)
    inputWrap.classList.add(`input__input-wrapper--correct`)
  } else {
    inputWrap.classList.add(`input__input-wrapper--incorrect`)
    inputWrap.classList.remove(`input__input-wrapper--correct`)
    validationNotice(contentWrap, text)
  }
}
