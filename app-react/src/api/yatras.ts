import { apiClient } from './client'
import type { Yatra, UserPractice, PracticeDataType } from '../types/api'

export const yatrasApi = {
  async getYatras(): Promise<Yatra[]> {
    const res = await apiClient.get<{ yatras: Yatra[] }>('/yatras')
    return res.data.yatras
  },
  async getYatra(id: string): Promise<Yatra> {
    const res = await apiClient.get<{ yatra: Yatra }>(`/yatras/${id}`)
    return res.data.yatra
  },
  async joinYatra(id: string): Promise<void> {
    await apiClient.post(`/yatras/${id}/join`)
  },
  async leaveYatra(id: string): Promise<void> {
    await apiClient.delete(`/yatras/${id}/members/me`)
  },
  async removeMember(yatraId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/yatras/${yatraId}/members/${memberId}`)
  },
  async updateYatra(id: string, name: string): Promise<void> {
    await apiClient.put(`/yatras/${id}`, { yatra: { name } })
  },
  async createYatraPractice(yatraId: string, data: { practice: string; data_type: PracticeDataType; dropdown_variants?: string }): Promise<UserPractice> {
    const res = await apiClient.post<{ practice: UserPractice }>(`/yatras/${yatraId}/practices`, { practice: data })
    return res.data.practice
  },
  async updateYatraPractice(yatraId: string, practiceId: string, data: { practice?: string; data_type?: PracticeDataType }): Promise<void> {
    await apiClient.put(`/yatras/${yatraId}/practices/${practiceId}`, { practice: data })
  },
  async deleteYatraPractice(yatraId: string, practiceId: string): Promise<void> {
    await apiClient.delete(`/yatras/${yatraId}/practices/${practiceId}`)
  },
}
