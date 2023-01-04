export function removeValidationNotice(target) {
  const prevWrap = target.querySelector(`.input__content .error-notice`)
  prevWrap?.remove()
}
