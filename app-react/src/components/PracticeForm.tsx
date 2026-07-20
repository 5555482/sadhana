import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FaHashtag, FaCheckCircle, FaStopwatch, FaClock, FaList } from 'react-icons/fa'
import { practicesApi } from '../api/practices'
import { yatrasApi } from '../api/yatras'
import { ErrorBanner } from './ui/ErrorBanner'
import type { PracticeDataType } from '../types/api'

type PracticeFormMode = { type: 'user' } | { type: 'yatra'; yatraId: string }

interface PracticeFormProps {
  mode: PracticeFormMode
  initialValues?: { name: string; dataType: PracticeDataType; isRequired?: boolean; dropdownVariants?: string; id?: string }
  onSuccess: () => void
}

const TYPE_OPTIONS: { value: PracticeDataType; icon: React.ElementType; label: string }[] = [
  { value: 'Bool',     icon: FaCheckCircle, label: 'Yes / No'  },
  { value: 'Int',      icon: FaHashtag,     label: 'Count'     },
  { value: 'Duration', icon: FaStopwatch,   label: 'Duration'  },
  { value: 'Time',     icon: FaClock,       label: 'Time'      },
  { value: 'Text',     icon: FaList,        label: 'Text'      },
]

const inputBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.80)',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: '0.75rem',
  outline: 'none',
  width: '100%',
  fontSize: '0.95rem',
  color: '#1f2937',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = '#01a386'
  e.target.style.boxShadow = '0 0 0 3px rgba(1,163,134,0.12)'
}
function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = 'rgba(0,0,0,0.10)'
  e.target.style.boxShadow = 'none'
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

export function PracticeForm({ mode, initialValues, onSuccess }: PracticeFormProps) {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [name, setName] = useState(initialValues?.name ?? '')
  const [dataType, setDataType] = useState<PracticeDataType>(initialValues?.dataType ?? 'Bool')
  const [isRequired, setIsRequired] = useState(initialValues?.isRequired ?? false)
  const [dropdownVariants, setDropdownVariants] = useState(initialValues?.dropdownVariants ?? '')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        practice: name,
        data_type: dataType,
        is_required: isRequired || undefined,
        dropdown_variants: dataType === 'Text' ? dropdownVariants || undefined : undefined,
      }
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
    <div className="px-4 py-4 max-w-lg mx-auto">
      <form
        onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <div className="rounded-2xl p-5 flex flex-col gap-2" style={cardStyle}>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {t('practice.name')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning run"
            style={{ ...inputBase, padding: '0.625rem 0.875rem' }}
            onFocus={onFocus}
            onBlur={onBlur}
            autoFocus
          />
        </div>

        {/* Data type */}
        <div className="rounded-2xl p-5 flex flex-col gap-3" style={cardStyle}>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {t('practice.type')}
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {TYPE_OPTIONS.map(({ value, icon: Icon, label }) => {
              const active = dataType === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDataType(value)}
                  className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 transition-all"
                  style={
                    active
                      ? { background: 'rgba(1,163,134,0.10)', border: '1.5px solid #01a386', boxShadow: '0 0 0 3px rgba(1,163,134,0.08)' }
                      : { background: 'rgba(0,0,0,0.03)', border: '1.5px solid rgba(0,0,0,0.07)' }
                  }
                >
                  <Icon className="w-5 h-5" style={{ color: active ? '#01a386' : '#9ca3af' }} />
                  <span className="text-xs font-semibold leading-tight text-center" style={{ color: active ? '#01a386' : '#6b7280' }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dropdown variants — Text type only */}
        {dataType === 'Text' && (
          <div className="rounded-2xl p-5 flex flex-col gap-2" style={cardStyle}>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {t('practice.dropdownVariants')}
            </label>
            <textarea
              rows={4}
              placeholder={t('practice.dropdownVariantsHint')}
              value={dropdownVariants}
              onChange={(e) => setDropdownVariants(e.target.value)}
              style={{ ...inputBase, padding: '0.625rem 0.875rem', resize: 'vertical' }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
        )}

        {/* Is required — user practices only */}
        {mode.type === 'user' && (
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={cardStyle}>
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setIsRequired((v) => !v)}
            >
              <span className="text-sm font-medium text-gray-700">{t('practice.isRequired')}</span>
              <div
                className="relative flex-shrink-0"
                style={{
                  width: '3rem',
                  height: '1.75rem',
                  borderRadius: '999px',
                  backgroundColor: isRequired ? '#01a386' : 'rgba(0,0,0,0.15)',
                  transition: 'background-color 0.2s',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '0.25rem',
                    left: '0.25rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transform: isRequired ? 'translateX(1.25rem)' : 'translateX(0)',
                    transition: 'transform 0.2s',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{t('practice.isRequiredHint')}</p>
          </div>
        )}

        <ErrorBanner message={error} />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            color: 'white',
            border: 'none',
            appearance: 'none' as React.CSSProperties['appearance'],
            boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
            opacity: name.trim() ? 1 : 0.55,
            transition: 'opacity 0.2s',
            cursor: name.trim() ? 'pointer' : 'default',
          }}
        >
          {mutation.isPending && <span className="loading loading-spinner loading-sm" />}
          {t('common.save')}
        </button>
      </form>
    </div>
  )
}
