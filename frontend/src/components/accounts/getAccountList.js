import { getAccountItem } from './getAccountItem'
export function getAccountList(data, main) {
  main.innerHTML = ''
  data.forEach((el) => {
    main.append(getAccountItem(el))
  })
}
