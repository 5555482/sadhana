import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { practicesApi } from '../api/practices'
import { yatrasApi } from '../api/yatras'
import { ErrorBanner } from './ui/ErrorBanner'
import type { PracticeDataType } from '../types/api'

type PracticeFormMode = { type: 'user' } | { type: 'yatra'; yatraId: string }

interface PracticeFormProps {
  mode: PracticeFormMode
  initialValues?: { name: string; dataType: PracticeDataType; dropdownVariants?: string; id?: string }
  onSuccess: () => void
}

const DATA_TYPES: PracticeDataType[] = ['Int', 'Bool', 'Text', 'Time', 'Duration']

const fieldStyle = {
  background: 'rgba(255,255,255,0.80)',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: '0.75rem',
  outline: 'none',
  width: '100%',
  padding: '0 0.75rem',
  height: '2.75rem',
  fontSize: '0.9rem',
  color: '#1f2937',
}

export function PracticeForm({ mode, initialValues, onSuccess }: PracticeFormProps) {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [name, setName] = useState(initialValues?.name ?? '')
  const [dataType, setDataType] = useState<PracticeDataType>(initialValues?.dataType ?? 'Int')
  const [dropdownVariants, setDropdownVariants] = useState(initialValues?.dropdownVariants ?? '')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async () => {
      const data = { practice: name, data_type: dataType, dropdown_variants: dropdownVariants || undefined }
      if (mode.type === 'user') {
        if (initialValues?.id) await practicesApi.updateUserPractice(initialValues.id, data)
        else await practicesApi.createUserPractice(data)
        qc.invalidateQueries({ queryKey: ['practices'] })
      } else {
        if (initialValues?.id) await yatrasApi.updateYatraPractice(mode.yatraId, initialValues.id, data)
        else await yatrasApi.createYatraPractice(mode.yatraId, data)
        qc.invalidateQueries({ queryKey: ['yatra', mode.yatraId] })
      }
    },
    onSuccess,
    onError: () => setError(t('common.error')),
  })

  return (
    <div className="px-4 py-4">
      <div
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.80)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
          className="flex flex-col gap-5"
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('practice.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('practice.name')}
              style={fieldStyle}
              onFocus={(e) => { e.target.style.borderColor = '#01a386'; e.target.style.boxShadow = '0 0 0 3px rgba(1,163,134,0.12)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.10)'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('practice.type')}
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as PracticeDataType)}
              style={{ ...fieldStyle, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
              onFocus={(e) => { e.target.style.borderColor = '#01a386'; e.target.style.boxShadow = '0 0 0 3px rgba(1,163,134,0.12)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.10)'; e.target.style.boxShadow = 'none' }}
            >
              {DATA_TYPES.map((dt) => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
          </div>

          {/* Dropdown variants — only for Text */}
          {dataType === 'Text' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t('practice.dropdownVariants')}
              </label>
              <textarea
                rows={3}
                placeholder={t('practice.dropdownVariantsHint')}
                value={dropdownVariants}
                onChange={(e) => setDropdownVariants(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.80)',
                  border: '1px solid rgba(0,0,0,0.10)',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: '0.9rem',
                  color: '#1f2937',
                  resize: 'vertical',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#01a386'; e.target.style.boxShadow = '0 0 0 3px rgba(1,163,134,0.12)' }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.10)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          )}

          <ErrorBanner message={error} />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="h-11 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
              color: '#134e4a',
              boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
              opacity: mutation.isPending ? 0.7 : 1,
            }}
          >
            {mutation.isPending && <span className="loading loading-spinner loading-sm" />}
            {t('common.save')}
          </button>
        </form>
      </div>
    </div>
  )
}
