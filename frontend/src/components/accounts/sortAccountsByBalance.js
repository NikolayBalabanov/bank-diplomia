export function sortAccountsByBalance(someList, render, main) {
  someList = someList.sort((a, b) => {
    let x = a.balance
    let y = b.balance
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
