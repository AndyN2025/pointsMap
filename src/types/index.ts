export type District =
  'ЦАО'
  | 'САО'
  | 'СВАО'
  | 'ВАО'
  | 'ЮВАО'
  | 'ЮАО'
  | 'ЮЗАО'
  | 'ЗАО'
  | 'СЗАО'
  | 'ЗелАО'
  | 'НАО'
  | 'ТАО'

export interface Point {
    id: number
    lat: number
    lng: number
    district: District
}

export interface DistrictBounds {
    name: District
    minLat: number
    maxLat: number
    minLng: number
    maxLng: number
}