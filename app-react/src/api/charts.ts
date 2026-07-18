import { apiClient } from './client'
import type { ChartReport, SharedChart } from '../types/api'

export const chartsApi = {
  async getCharts(): Promise<ChartReport[]> {
    const res = await apiClient.get<{ charts: ChartReport[] }>('/charts')
    return res.data.charts
  },
  async createChart(data: Omit<ChartReport, 'id' | 'share_id'>): Promise<ChartReport> {
    const res = await apiClient.post<{ chart: ChartReport }>('/charts', { chart: data })
    return res.data.chart
  },
  async getSharedChart(id: string): Promise<SharedChart> {
    const res = await apiClient.get<{ chart: SharedChart }>(`/charts/shared/${id}`)
    return res.data.chart
  },
}
