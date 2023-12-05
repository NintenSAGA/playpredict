import { SliderMarks } from 'antd/es/slider'

export interface CalcResult {
  daysToGo: number;
  endDate: Date;
}

export interface TimeData {
  timeType: 0 | 1 | 2
  timeArrays : number[][]
}

export interface SliderConfig {
  labels: string[],
  min: number,
  max: number,
  sliderMarks: SliderMarks,
  step: number
}