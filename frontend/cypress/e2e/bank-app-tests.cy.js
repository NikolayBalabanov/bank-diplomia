/// <reference types="cypress" />
function loadingElem(elem, print = true) {
  cy.get('body').then(($body) => {
    const el = $body.find(elem).length
    if (el === 0) {
      cy.wait(1)
      loadingElem(elem)
    } else {
      if (print) cy.log(`Открылась страница ${$body.find(elem).text()}`)
    }
  })
}

function checkSkeleton(elem, print = false) {
  cy.get('body').then(($body) => {
    const el = $body.find(elem).length
    if (el != 0) {
      cy.wait(1)
      checkSkeleton(elem)
    } else {
      if (print) cy.log('Контент загружен')
    }
  })
}

function makeTransaction(to, valueBefore, value) {
  cy.get('.card-number').type(to)
  cy.get('.amount').type(value)
  cy.get('.account__btn').click()
  checkSkeleton('.btn--loader')
  cy.get('.account__balance').then(($balance) => {
    const bal = $balance.text().replace(/[^\d]+/g, '')
    expect(Number(bal)).to.equal(Number(valueBefore) - value)
    cy.log('Значение баланса уменьшилось на сумму перевода')
  })
}

describe('Тесты базового функционала приложение COIN', () => {
  beforeEach(() => {
    cy.viewport(1600, 800)
  })
  it('Авторизация. Форма авторизации', () => {
    cy.visit('http://localhost:8080/')
    cy.log(
      'Если нет токена в Local Storage, должен произойти редирект на страницу авторизации'
    )
    cy.log(`Локал Сторидж = ${localStorage.getItem('token')}`)
    cy.log('Проверяем редирект на http://localhost:8080/auth')
    cy.url().should('eq', 'http://localhost:8080/auth')
    cy.log('Проверяем содержание страницы авторизации:')
    cy.get('.auth').should(($auth) => {
      expect($auth).to.have.length(1)
      expect($auth.find('.auth__header')).to.contain('Вход в аккаунт')
    })
    cy.get('.auth__btn').should('have.attr', 'disabled')
    cy.log('Пробуем ввести неверный логин')
    cy.get('.login').type('notdeveloper')
    cy.get('.password').type('12345678')
    cy.get('.auth__btn').should('not.have.attr', 'disabled')
    cy.get('.auth__btn').click()
    cy.url().should('eq', 'http://localhost:8080/auth')
    cy.get('.login')
      .parent()
      .should('have.class', 'input__input-wrapper--incorrect')
    cy.get('.password')
      .parent()
      .should('not.have.class', 'input__input-wrapper--incorrect')
    cy.get('.auth__form')
      .find('.error-notice')
      .find('.error-notice__text')
      .should(($error) => {
        expect($error).to.contain('Такого пользователя нет в системе')
      })
    cy.get('.auth__btn').should('have.attr', 'disabled')

    cy.log('Пробуем ввести неверный пароль')
    cy.get('.login').clear()
    cy.get('.password').clear()
    cy.get('.login').type('developer')
    cy.get('.password').type('12345678')
    cy.get('.auth__btn').should('not.have.attr', 'disabled')
    cy.get('.auth__btn').click()
    cy.url().should('eq', 'http://localhost:8080/auth')
    cy.get('.password')
      .parent()
      .should('have.class', 'input__input-wrapper--incorrect')
    cy.get('.login')
      .parent()
      .should('not.have.class', 'input__input-wrapper--incorrect')
    cy.get('.auth__form')
      .find('.error-notice')
      .find('.error-notice__text')
      .should(($error) => {
        expect($error).to.contain('Неверный пароль')
      })
    cy.get('.auth__btn').should('have.attr', 'disabled')

    cy.log('Проверка входа в систему, вводим правильный логин и пароль:')
    cy.get('.login').clear()
    cy.get('.password').clear()
    cy.get('.login').type('developer')
    cy.get('.password').type('skillbox')
    cy.get('.auth__btn').should('not.have.attr', 'disabled')
    cy.get('.auth__btn').click()
    loadingElem('.accounts')
    cy.url().should('eq', 'http://localhost:8080/accounts')
    cy.log('После успешного входа сохранен токен')
    cy.log(`Локал Сторидж = ${localStorage.getItem('token')}`)
    cy.get('.accounts-header__title').should(($header) => {
      expect($header).to.contain('Ваши счета')
    })
    cy.log(
      'Проверяем переход на все страницы приложения: "Банкоматы", "Валюты", "Счета".'
    )
    cy.visit('http://localhost:8080/banks')
    loadingElem('.bank-map')
    cy.url().should('eq', 'http://localhost:8080/banks')

    cy.visit('http://localhost:8080/currencies')
    loadingElem('.currencies-container')
    cy.url().should('eq', 'http://localhost:8080/currencies')

    cy.visit('http://localhost:8080/accounts')
    loadingElem('.accounts')
    cy.url().should('eq', 'http://localhost:8080/accounts')

    cy.log(
      'Проверяем выход из аккаунта. Ожидается переход на http://localhost:8080/auth'
    )
    cy.get('.exit').click()
    cy.url().should('eq', 'http://localhost:8080/auth')
  })
  it('Проверка взаимодействия со счетами', () => {
    cy.visit('http://localhost:8080/')
    cy.get('.login').type('developer')
    cy.get('.password').type('skillbox')
    cy.get('.auth__btn').click()
    loadingElem('.accounts')
    cy.url().should('eq', 'http://localhost:8080/accounts')

    cy.log('Создаем новый аккаунт.')
    cy.get('.accounts__main')
    checkSkeleton('.accounts-skeleton')
    let prevArrLen
    cy.get('.accounts-item').then(($prewList) => {
      prevArrLen = $prewList.length
      cy.get('.accounts-header__new-acc-btn').click()
      checkSkeleton('.loading')
      cy.get('.accounts-item').then(($list) => {
        expect($list).to.have.length(prevArrLen + 1)
        cy.log('Добавлен новый счёт')
        cy.log('Переведем деньги на новый счёт')
        let newAccNumber
        let fromAccNumber = '50057451468817473722828750'
        let fromAccBalance
        cy.get(`.accounts-item:nth-child(${prevArrLen + 1})`).then(
          ($newAccItem) => {
            newAccNumber = $newAccItem.find('.accounts-item__value').text()
          }
        )
        cy.get('.choices').click()
        cy.get('[data-value="balance"]').click()
        cy.get(`#${fromAccNumber}`).click()
        cy.url().should('eq', `http://localhost:8080/account/${fromAccNumber}`)
        checkSkeleton('.account__up--skeleton')
        cy.get('.account__balance').then(($balance) => {
          fromAccBalance = $balance.text().replace(/[^\d]+/g, '')
          makeTransaction(newAccNumber, fromAccBalance, 100500)
          cy.log('Проверяем баланс нового счета')
          cy.get('.accounts-header__back-btn').click()
          checkSkeleton('.accounts-skeleton')
          cy.get(`#${newAccNumber}`).click()
          checkSkeleton('.account__up--skeleton')
          cy.get('.account__balance').then(($newBalance) => {
            const newBalance = $newBalance.text().replace(/[^\d]+/g, '')
            expect(Number(newBalance)).to.equal(100500)
            cy.log('Баланс нового счета увеличен на сумму перевода')
            cy.log('Пробуем перевести деньги с нового счета')
            makeTransaction(fromAccNumber, newBalance, 100499)
          })
        })
      })
    })
  })
})
