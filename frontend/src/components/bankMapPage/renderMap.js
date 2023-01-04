import ymaps from 'ymaps'

export async function renderMap(mapData) {
  const maps = await ymaps.load(
    'https://api-maps.yandex.ru/2.1/?apikey=04a1662a-2115-4736-a95d-a9f299ca73cb&lang=ru_RU'
  )
  let myMap = new maps.Map('map', {
    center: [55.76, 37.64],
    zoom: 10,
  })
  myMap.behaviors.disable('scrollZoom')
  for (let i of mapData) {
    let myGeoObject = new maps.GeoObject({
      geometry: {
        coordinates: [i[0], i[1]],
        type: 'Point',
      },
    })
    myMap.geoObjects.add(myGeoObject)
  }
}
