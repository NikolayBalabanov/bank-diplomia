export function checkForm(login, password, btn) {
  if (login && password) {
    btn.removeAttribute('disabled', 'disabled')
  } else {
    btn.setAttribute('disabled', 'disabled')
  }
}
