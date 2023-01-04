export function sortAccountsByLastTransaction(someList, render, main) {
  someList = someList.sort((a, b) => {
    let x = a.transactions
    let y = b.transactions
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
