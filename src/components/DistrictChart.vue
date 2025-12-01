<template>
  <div class="chart-wrapper">
    <div id="chart-container" style="width: 100%; height: 420px;"></div>
    <p class="hint">Клик по сектору — показать/скрыть округ</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { districtColors } from '@/composables/useDistrictColors'
import type { District } from '@/types'

const props = defineProps<{
  stats: Record<District | 'Вне округа', number>
  visibleDistricts?: Set<District>
}>()

const emit = defineEmits<{
  (e: 'toggle', district: District): void
}>()

let root: am5.Root | null = null
let series: am5percent.PieSeries | null = null

onMounted(async () => {

  await nextTick()

  const container = document.getElementById('chart-container')
  if (!container) return

  root = am5.Root.new(container)
  root.setThemes([am5themes_Animated.new(root)])

  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      innerRadius: am5.percent(45),
      layout: root.verticalLayout
    })
  )

  series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: 'value',
      categoryField: 'district',
      alignLabels: false
    })
  )

  series.slices.template.setAll({
    interactive: true,
    toggleable: true,
    cursorOverStyle: "pointer",
    stroke: am5.color("#ffffff"),
    strokeWidth: 3,
    cornerRadius: 5,
    tooltipText: '{category}: {value} точек',
  })


  series.slices.template.adapters.add("fill", (fill, target) => {
    const district = target.dataItem?.get("category") as District
    return am5.color(districtColors[district] || "#888888")
  })

  series.slices.template.adapters.add("fillOpacity", (_, target) => {
    const district = target.dataItem?.get("category") as District
    return props.visibleDistricts?.has(district) ? 1 : 0.8
  })

  series.slices.template.events.on("click", (ev) => {
    const dataItem = ev.target.dataItem
    if (!dataItem) return

    const district = dataItem.get("category") as District
    if (!district || district === "Вне округа") return

    emit("toggle", district)
  })

  series.labels.template.setAll({ forceHidden: true })
  series.ticks.template.setAll({ forceHidden: true })

  const data = Object.entries(props.stats)
    .filter(([d]) => d !== 'Вне округа')
    .map(([district, value]) => ({
      district: district as District,
      value,
    }))

  series.data.setAll(data)

  series.appear(1000)
  chart.appear(1000, 100)
})

onUnmounted(() => {
  root?.dispose()
})

watch(
  () => props.visibleDistricts,
  () => {
    series?.dataItems.forEach(item => {
      const slice = item.get('slice')
      if (slice) {
        const district = item.get('category') as District
        const opacity = props.visibleDistricts?.has(district) ?? true ? 1 : 0.25
        slice.set('fillOpacity', opacity)
      }
    })
  },
  { deep: true }
)

watch(
  () => props.stats,
  (newStats) => {
    if (!series) return

    const data = Object.entries(newStats)
      .filter(([d]) => d !== 'Вне округа')
      .map(([district, value]) => ({
        district: district as District,
        value,
      }))

    series.data.setAll(data)
  },
  { immediate: true }
)
</script>

<style scoped>
.chart-wrapper {
  text-align: center;
}

.hint {
  margin-top: 12px;
  font-size: 0.9em;
  color: #666;
}
</style>