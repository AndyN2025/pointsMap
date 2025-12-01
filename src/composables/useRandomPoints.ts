import { ref, computed, readonly, triggerRef } from 'vue'
import type { Point, District } from '@/types'
import { districtPolygons } from '@/data/districtPolygons.ts'

const ALL_DISTRICTS: District[] = [
  'ЦАО', 'САО', 'СВАО', 'ВАО', 'ЮВАО', 'ЮАО',
  'ЮЗАО', 'ЗАО', 'СЗАО', 'ЗелАО', 'НАО', 'ТАО'
]

type DistrictOrOutside = District | 'Вне округа'

function isPointInPolygon(lat: number, lng: number, polygon: number[][]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1], yi = polygon[i][0]
    const xj = polygon[j][1], yj = polygon[j][0]

    const intersect = ((yi > lat) !== (yj > lat)) &&
                      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

function randomPointInPolygon(polygon: number[][]): { lat: number; lng: number } {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity
  for (const [lat, lng] of polygon) {
    minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat)
    minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng)
  }

  for (let i = 0; i < 1000; i++) {
    const lat = minLat + Math.random() * (maxLat - minLat)
    const lng = minLng + Math.random() * (maxLng - minLng)
    if (isPointInPolygon(lat, lng, polygon)) {
      return { lat, lng }
    }
  }

  return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 }
}

export function useRandomPoints() {
  const points = ref<Point[]>([])

  const visibleDistricts = ref<Set<District>>(new Set(ALL_DISTRICTS))

  const generate = (count = 100) => {
    const newPoints: Point[] = []
    let id = 0

    while (newPoints.length < count) {
      const district = ALL_DISTRICTS[Math.floor(Math.random() * ALL_DISTRICTS.length)]
      const polygon = districtPolygons[district]
      if (!polygon) continue

      const { lat, lng } = randomPointInPolygon(polygon)

      newPoints.push({ id: id++, lat, lng, district })
    }

    points.value = newPoints
    console.log(`Сгенерировано ${count} точек по округам Москвы`)
  }

  const toggleDistrict = (district: District) => {
    if (visibleDistricts.value.has(district)) {
      visibleDistricts.value.delete(district)
    } else {
      visibleDistricts.value.add(district)
    }
    triggerRef(visibleDistricts)
  }

  const visiblePoints = computed(() => {
    if (visibleDistricts.value.size === 0) return []
    return points.value.filter(p => visibleDistricts.value.has(p.district))
  })

  const districtStats = computed<Record<District | 'Вне округа', number>>(() => {
    const stats: Record<DistrictOrOutside, number> = { 'Вне округа': 0 }
    ALL_DISTRICTS.forEach(d => stats[d] = 0)

    points.value.forEach(p => {
      if (ALL_DISTRICTS.includes(p.district)) {
        stats[p.district]++
      } else {
        stats['Вне округа']++
      }
    })

    return stats
  })

  generate(100)

  return {
    points: readonly(points),
    visiblePoints,
    visibleDistricts,
    districtStats,
    generate,
    toggleDistrict,
    resetVisibility: () => {
      visibleDistricts.value = new Set(ALL_DISTRICTS)
    }
  }
}