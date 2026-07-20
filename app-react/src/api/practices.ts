import { apiClient } from './client'
import type { UserPractice, DiaryEntry, PracticeDataType, PracticeValue } from '../types/api'

export const practicesApi = {
  async getUserPractices(): Promise<UserPractice[]> {
    const res = await apiClient.get<{ practices: UserPractice[] }>('/user/practices')
    return res.data.practices
  },
  async createUserPractice(data: { practice: string; data_type: PracticeDataType; is_required?: boolean; dropdown_variants?: string }): Promise<UserPractice> {
    const res = await apiClient.post<{ practice: UserPractice }>('/user/practices', { practice: data })
    return res.data.practice
  },
  async updateUserPractice(id: string, data: { practice?: string; data_type?: PracticeDataType; is_active?: boolean; is_required?: boolean; dropdown_variants?: string }): Promise<void> {
    await apiClient.put(`/user/practices/${id}`, { practice: data })
  },
  async deleteUserPractice(id: string): Promise<void> {
    await apiClient.delete(`/user/practices/${id}`)
  },
  async reorderUserPractices(ids: string[]): Promise<void> {
    await apiClient.put('/user/practices/reorder', { ids })
  },
  async getDiaryEntries(date: string): Promise<DiaryEntry[]> {
    const res = await apiClient.get<{ diary: DiaryEntry[] }>(`/diary?date=${date}`)
    return res.data.diary
  },
  async saveDiaryEntry(date: string, practice: string, value: PracticeValue): Promise<void> {
    await apiClient.put('/diary', { diary: { date, practice, value } })
  },
}
