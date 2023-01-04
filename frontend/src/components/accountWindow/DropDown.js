import { el, setChildren } from 'redom'

export class DropDown {
  constructor(wrap, input, list) {
    this.wrap = wrap
    this.input = input
    this.data = []
    this.listItems = []
    this.focusedItem = -1
    this.list = list
  }

  update() {
    let lsData = JSON.parse(localStorage.getItem('numbersArray'))
    if (Array.isArray(lsData)) {
      this.data = lsData.slice()
      this.setListeners()
    } else {
      this.setActive(false)
    }
  }

  focusItem(index) {
    if (!this.listItems.length) return false
    if (index > this.listItems.length - 1) return this.focusItem(0)
    if (index < 0) return this.focusItem(this.listItems.length - 1)
    this.focusedItem = index
    this.unfocusAllItems()
    this.listItems[this.focusedItem].classList.add('focused')
  }

  unfocusAllItems() {
    this.listItems.forEach((item) => {
      item.classList.remove('focused')
    })
  }

  selectItem(index) {
    if (!this.listItems[index]) return false
    this.input.value = this.listItems[index].textContent
    this.setActive(false)
  }

  setActive(active = true) {
    if (active) this.wrap.classList.add('dropdown--open')
    else this.wrap.classList.remove('dropdown--open')
  }

  createAccountsListItem({ number, type }) {
    let item = el('li.dropdown__item')
    let typeImg = el('span.dropdown__item-type')
    let text = el('span.dropdown__item-text')
    typeImg.innerHTML = `<i class="${type}" aria-hidden="true"></i>`
    text.innerHTML = `${number}`
    item.addEventListener('click', () => {
      this.selectItem(this.listItems.indexOf(item))
    })
    setChildren(item, [typeImg, text])
    return item
  }

  findSuggests(value) {
    this.listItems = []
    this.data.forEach((dataItem) => {
      let itemText = dataItem['number']
      let search = itemText.includes(value)
      if (search && itemText !== value) {
        let pos = itemText.indexOf(value)
        let parts = [
          itemText.substr(0, pos),
          itemText.substr(pos, value.length),
          itemText.substr(
            pos + value.length,
            itemText.length - pos - value.length
          ),
        ]
        let item = this.createAccountsListItem({
          number: `${parts[0]}<strong>${parts[1]}</strong>${parts[2]}`,
          type: dataItem['type'],
        })
        this.listItems.push(item)
      }
    })
    this.fillDropDownList(this.listItems)
    this.setActive(true)
  }

  showLogic() {
    let value = this.input.value.split(' ').join('')
    if (!value) {
      this.fillDropDownList(
        this.data.map((el) => {
          this.createAccountsListItem(el)
        })
      )
      this.setActive(true)
    } else {
      this.findSuggests(value)
    }
    if (this.list.children.length > 0) {
      this.focusItem(0)
      this.setActive(true)
    } else {
      this.setActive(false)
    }
  }

  fillDropDownList(arr) {
    this.list.innerHTML = ''
    this.listItems = []
    arr.forEach((el) => {
      this.list.append(el)
      this.listItems.push(el)
    })
  }

  setListeners() {
    this.input.addEventListener('input', () => {
      this.setActive(true)
      this.showLogic()
    })
    this.input.addEventListener('keydown', (e) => {
      let keyCode = e.keyCode

      if (keyCode === 40) {
        // arrow down
        e.preventDefault()
        this.focusedItem++
        this.focusItem(this.focusedItem)
      } else if (keyCode === 38) {
        //arrow up
        e.preventDefault()
        if (this.focusedItem > 0) this.focusedItem--
        this.focusItem(this.focusedItem)
      } else if (keyCode === 27) {
        // escape
        this.setActive(false)
      } else if (keyCode === 13) {
        // enter
        this.selectItem(this.focusedItem)
      }
    })
    document.body.addEventListener('click', (e) => {
      if (!this.wrap.contains(e.target)) {
        this.setActive(false)
      }
    })
  }
}
