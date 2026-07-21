import { apiClient } from './client'
import type { ChartReport, SharedChart } from '../types/api'

interface ServerReport {
  id: string
  name: string
  definition: unknown
}

export const chartsApi = {
  async getCharts(): Promise<ChartReport[]> {
    const res = await apiClient.get<{ reports: ServerReport[] }>('/reports')
    return res.data.reports.map(r => ({
      id: r.id,
      name: r.name,
      practices: [],
      date_from: '',
      date_to: '',
      chart_type: 'Line' as const,
    }))
  },
  async getSharedChart(id: string): Promise<SharedChart> {
    const res = await apiClient.get<{ chart: SharedChart }>(`/charts/shared/${id}`)
    return res.data.chart
  },
}
