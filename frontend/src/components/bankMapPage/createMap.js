import { Api } from '../../api/Api'
import { createModal } from '../errorModal/errorModal'
import { router } from '../..'
import { renderMap } from './renderMap'

export async function createMap(mapWrap) {
  let mapData
  if (localStorage.getItem('mapData')) {
    mapData = JSON.parse(localStorage.getItem('mapData'))
    await renderMap(mapData)
    mapWrap.classList.remove('bank-map__map-placeholder')
  } else {
    mapData = await Api.getMapInfo()
    if (Array.isArray(mapData.payload)) {
      mapData = mapData.payload.map((el) => [el.lat, el.lon])
      localStorage.setItem('mapData', JSON.stringify(mapData))
      await renderMap(mapData)
      mapWrap.classList.remove('bank-map__map-placeholder')
    } else {
      mapWrap.classList.remove('bank-map__map-placeholder')
      if (mapData.error === 'Unauthorized') {
        let data = {
          titleText: 'Упс! Проблема с авторизацией',
          btn: 'Войти снова',
          callback: () => router.navigate('/auth'),
        }
        const modal = createModal(data)
        document.body.append(modal)
      } else {
        let data = {
          titleText: 'Отсутствует связь с сервером',
          btn: 'Окей',
          callback: () => {
            console.log('Ошибка связи с сервером')
          },
        }
        const modal = createModal(data)
        document.body.append(modal)
      }
    }
  }
}
