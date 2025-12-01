<template>
  <div class="app">
    <h1>100 случайных координат в Москве</h1>

    <RegenerateButton @regenerate="handleRegenerate" />
    <PointsCounter :total="100" :visible="visiblePoints.length" />

    <div class="dashboard">
      <div class="map">
        <MapView :points="visiblePoints" :visible-districts="visibleDistricts" />
      </div>

      <div class="chart">
        <h3>По округам</h3>
        <DistrictChart :stats="districtStats" @toggle="toggleDistrict" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapView from '@/components/MapView.vue'
import DistrictChart from '@/components/DistrictChart.vue'
import RegenerateButton from '@/components/RegenerateButton.vue'
import PointsCounter from '@/components/PointsCounter.vue'
import { useRandomPoints } from '@/composables/useRandomPoints.ts'

const {
  visiblePoints,
  visibleDistricts,
  districtStats,
  generate,
  toggleDistrict
} = useRandomPoints()

const handleRegenerate = () => generate()
</script>

<style scoped>
.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 10px;
}

.dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 20px;
}

.map,
.chart {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.map {
  height: 562px;
}

.chart {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 960px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}
</style>