import { useEffect, useRef, useState } from 'react'
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
  initialValues?: { name: string; dataType: PracticeDataType; dropdownVariants?: string; id?: string }
  onSuccess: () => void
}

const TYPE_OPTIONS: { value: PracticeDataType; icon: React.ElementType; label: string; hint: string }[] = [
  { value: 'Bool',     icon: FaCheckCircle, label: 'Yes / No',  hint: 'Did you do it?' },
  { value: 'Int',      icon: FaHashtag,     label: 'Count',     hint: 'Number of reps' },
  { value: 'Duration', icon: FaStopwatch,   label: 'Duration',  hint: 'Minutes spent' },
  { value: 'Time',     icon: FaClock,       label: 'Time',      hint: 'Clock time' },
  { value: 'Text',     icon: FaList,        label: 'Text',      hint: 'Choose option' },
]

const inputBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.80)',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: '0.75rem',
  outline: 'none',
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

function TypePreview({ dataType, dropdownVariants, onVariantsChange, t }: {
  dataType: PracticeDataType
  dropdownVariants: string
  onVariantsChange: (v: string) => void
  t: (k: string) => string
}) {
  const variantsRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (dataType === 'Text') {
      setTimeout(() => variantsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
    }
  }, [dataType])

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.80)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}
    >
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Preview</p>

      {dataType === 'Bool' && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Done today?</span>
          <div
            className="relative w-12 h-7 rounded-full"
            style={{ backgroundColor: '#01a386' }}
          >
            <span
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white shadow"
            />
          </div>
        </div>
      )}

      {dataType === 'Int' && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-medium"
            style={{ background: 'rgba(1,163,134,0.10)', color: '#01a386', border: '1px solid rgba(0,0,0,0.07)' }}
          >−</button>
          <span
            className="w-16 h-9 rounded-xl flex items-center justify-center text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(0,0,0,0.10)', color: '#374151' }}
          >0</span>
          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-medium"
            style={{ background: 'rgba(1,163,134,0.10)', color: '#01a386', border: '1px solid rgba(0,0,0,0.07)' }}
          >+</button>
        </div>
      )}

      {dataType === 'Duration' && (
        <div className="flex items-center gap-2">
          <span
            className="w-20 h-9 rounded-xl flex items-center justify-center text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(0,0,0,0.10)', color: '#374151' }}
          >0</span>
          <span className="text-sm text-gray-400">min</span>
        </div>
      )}

      {dataType === 'Time' && (
        <div className="flex items-center gap-1">
          <span
            className="w-14 h-9 rounded-xl flex items-center justify-center text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(0,0,0,0.10)', color: '#374151' }}
          >06</span>
          <span className="font-bold text-gray-400">:</span>
          <span
            className="w-14 h-9 rounded-xl flex items-center justify-center text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(0,0,0,0.10)', color: '#374151' }}
          >00</span>
        </div>
      )}

      {dataType === 'Text' && (
        <div className="flex flex-col gap-3">
          <textarea
            ref={variantsRef}
            rows={4}
            placeholder={t('practice.dropdownVariantsHint')}
            value={dropdownVariants}
            onChange={(e) => onVariantsChange(e.target.value)}
            style={{ ...inputBase, width: '100%', padding: '0.625rem 0.875rem', resize: 'vertical' }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <p className="text-xs text-gray-400">{t('practice.dropdownVariants')}</p>
        </div>
      )}
    </div>
  )
}

export function PracticeForm({ mode, initialValues, onSuccess }: PracticeFormProps) {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [name, setName] = useState(initialValues?.name ?? '')
  const [dataType, setDataType] = useState<PracticeDataType>(initialValues?.dataType ?? 'Bool')
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
    <div className="px-4 py-4 max-w-lg mx-auto">
      <form
        onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-2"
          style={{
            background: 'rgba(255,255,255,0.90)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.80)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {t('practice.name')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning run"
            style={{ ...inputBase, width: '100%', padding: '0.625rem 0.875rem' }}
            onFocus={onFocus}
            onBlur={onBlur}
            autoFocus
          />
        </div>

        {/* Data type */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{
            background: 'rgba(255,255,255,0.90)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.80)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {t('practice.type')}
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {TYPE_OPTIONS.map(({ value, icon: Icon, label, hint }) => {
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
                  <span className="text-[10px] text-gray-400 text-center leading-tight hidden sm:block">
                    {hint}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Preview */}
        <TypePreview
          dataType={dataType}
          dropdownVariants={dropdownVariants}
          onVariantsChange={setDropdownVariants}
          t={t}
        />

        <ErrorBanner message={error} />

        <button
          type="submit"
          disabled={mutation.isPending || !name.trim()}
          className="h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            color: '#134e4a',
            boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
            opacity: !name.trim() ? 0.45 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {mutation.isPending && <span className="loading loading-spinner loading-sm" />}
          {t('common.save')}
        </button>
      </form>
    </div>
  )
}
