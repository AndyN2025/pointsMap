import type { District } from '@/types'

export const districtColors: Record<District, string> = {
  'ЦАО': '#ffDc33',   
  'САО': '#36A2EB',   
  'СВАО': '#C724B1',  
  'ВАО': '#4accCc',   
  'ЮВАО': '#dd6666',  
  'ЮАО': '#44dd99',   
  'ЮЗАО': '#FF6B9D',  
  'ЗАО': '#1111cc',   
  'СЗАО': '#ef11ef',  
  'ЗелАО': '#8BC34A', 
  'НАО': '#FF9800',   
  'ТАО': '#795548'   
}

export const amChartColors = Object.values(districtColors)

export const getYandexColor = (district: District): string => {
  return districtColors[district] || '#888888'
}