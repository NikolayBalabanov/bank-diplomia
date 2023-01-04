export function sortAccountsByNumber(someList, render, main) {
  someList = someList.sort((a, b) => {
    let x = a.account
    let y = b.account
    if (x > y) {
      return 1
    }
    if (x < y) {
      return -1
    }
    return 0
  })
  render(someList, main)
}
