// Mirrors Rust model structs; serde default serialization (PascalCase enum variants)

export interface UserInfo {
  id: string
  email: string
  token: string
  name: string
}

export type PracticeDataType = 'Int' | 'Bool' | 'Time' | 'Text' | 'Duration'

// Rust serde default: enum variants with data serialize as { "VariantName": payload }
export type PracticeValue =
  | { Int: number }
  | { Bool: boolean }
  | { Time: { h: number; m: number } }
  | { Text: string }
  | { Duration: number }

export interface UserPractice {
  id: string
  practice: string
  data_type: PracticeDataType
  is_active: boolean
  is_required?: boolean
  dropdown_variants?: string
}

export interface DiaryEntry {
  practice: string
  data_type: PracticeDataType
  dropdown_variants?: string
  value?: PracticeValue
}

export interface Confirmation {
  id: string
  email: string
  expires_at: string
}

// API response envelopes
export interface UserInfoWrapper { user: UserInfo }
export interface SignupLinkDetailsWrapper { confirmation: Confirmation }
