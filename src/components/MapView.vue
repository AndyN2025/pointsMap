<template>
  <div class="map-wrapper">
    <div id="yandex-map" ref="mapContainer" class="yandex-map"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getYandexColor } from '@/composables/useDistrictColors'
import type { Point, District } from '@/types'

const props = defineProps<{
  points: Point[]
  visibleDistricts?: Set<string>
}>()

const mapContainer = ref<HTMLElement>()

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
  script.onload = initMap
  document.head.appendChild(script)
})

let ymap: unknown = null

function initMap() {
  // @ts-ignore
  ymaps.ready(() => {
    ymap = new ymaps.Map(mapContainer.value, {
      center: [55.7558, 37.6173],
      zoom: 10,
      controls: ['zoomControl', 'fullscreenControl']
    })

    renderPoints()
  })
}

function renderPoints() {
  if (!ymap) return

  ymap.geoObjects.removeAll()

  const visiblePoints = (!props.visibleDistricts || props.visibleDistricts.size === 0)
    ? props.points
    : props.points.filter(p => props.visibleDistricts!.has(p.district))

  visiblePoints.forEach((point, i) => {
    const placemark = new ymaps.Placemark(
      [point.lat, point.lng],
      {
        hintContent: point.district,
        balloonContent: `<strong>${point.district}</strong><br>Точка ${i + 1}`
      },
      {
        preset: 'islands#circleDotIcon',
        iconColor: getColor(point.district)
      }
    )
    ymap.geoObjects.add(placemark)
  })
}

function getColor(district: string) {
  return getYandexColor(district as District)
}

watch(
  () => props.points,
  renderPoints,
  { deep: true }
)

watch(
  () => props.visibleDistricts?.size,
  renderPoints
)

</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 562px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.yandex-map {
  width: 100%;
  height: 100%;
}
</style>