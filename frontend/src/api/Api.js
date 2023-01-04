export class Api {
  constructor() {}
  static async autorization(login, password) {
    return await fetch('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify({
        login,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .catch((err) => err)
  }

  static async getAccounts(token) {
    return await fetch('http://localhost:3000/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => err)
  }

  static async createAccount(token) {
    return await fetch('http://localhost:3000/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => err)
  }

  static async getAccount(id, token) {
    return await fetch(`http://localhost:3000/account/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => err)
  }

  static async transferFunds(from, to, amount, token) {
    return await fetch('http://localhost:3000/transfer-funds', {
      method: 'POST',
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => err)
  }

  static async getCurrencyAccounts(token) {
    return await fetch('http://localhost:3000/currencies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((data) => data.json())
      .catch((err) => err)
  }

  static async getCurrenciesData() {
    return await fetch('http://localhost:3000/all-currencies')
      .then((data) => data.json())
      .catch((err) => err)
  }

  static getChangedCurrency() {
    return new WebSocket('ws://localhost:3000/currency-feed')
  }

  static async exchangeCurrency(from, to, amount, token) {
    return await fetch('http://localhost:3000/currency-buy', {
      method: 'POST',
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => err)
  }

  static async getMapInfo() {
    return await fetch(`http://localhost:3000/banks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => err)
  }
}
