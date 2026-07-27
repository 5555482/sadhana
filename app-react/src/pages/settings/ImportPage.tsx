import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { LuUpload, LuFileText, LuCheck } from 'react-icons/lu'
import { importApi } from '../../api/import'
import type { ImportPreview, ImportResult } from '../../types/api'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.80)',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: '0.625rem',
  outline: 'none',
  fontSize: '0.85rem',
  color: '#1f2937',
  padding: '0.375rem 0.625rem',
  width: '100%',
  transition: 'border-color 0.15s',
}

export function ImportPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ImportResult | null>(null)

  const STEP_LABELS = [t('import.stepUpload'), t('import.stepMap'), t('import.stepDone')]

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    onDrop: ([f]) => { if (f) setFile(f) },
  })

  const previewMutation = useMutation({
    mutationFn: () => importApi.previewImport(file!),
    onSuccess: (data) => { setPreview(data); setStep(1) },
  })

  const confirmMutation = useMutation({
    mutationFn: () => importApi.confirmImport(mapping),
    onSuccess: (data) => { setResult(data); setStep(2) },
  })

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-4 pb-24">
      {/* Header */}
      <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={glass}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            boxShadow: '0 4px 16px rgba(1,163,134,0.30)',
          }}
        >
          <LuUpload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800">{t('import.title')}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{t('import.subtitle')}</p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-1 px-1">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col gap-1.5">
            <div
              className="h-1 rounded-full"
              style={{ background: i <= step ? '#01a386' : 'rgba(0,0,0,0.10)' }}
            />
            <span className="text-xs font-medium" style={{ color: i === step ? '#01a386' : '#9ca3af' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 0: Upload */}
      {step === 0 && (
        <div className="flex flex-col gap-3">
          <div
            {...getRootProps()}
            className="rounded-2xl flex flex-col items-center justify-center gap-3 py-12 cursor-pointer transition-all"
            style={{
              ...glass,
              border: isDragActive
                ? '2px dashed rgba(1,163,134,0.60)'
                : file ? '2px solid rgba(1,163,134,0.30)' : '2px dashed rgba(0,0,0,0.12)',
              background: isDragActive ? 'rgba(1,163,134,0.05)' : glass.background,
            }}
          >
            <input {...getInputProps()} />
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: file ? 'rgba(1,163,134,0.10)' : 'rgba(0,0,0,0.05)' }}
            >
              {file
                ? <LuFileText className="w-5 h-5" style={{ color: '#01a386' }} />
                : <LuUpload className="w-5 h-5" style={{ color: '#9ca3af' }} />
              }
            </div>
            {file ? (
              <div className="text-center">
                <p className="text-sm font-semibold" style={{ color: '#01a386' }}>{file.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t('import.clickToChange')}</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  {isDragActive ? t('import.drop') : t('import.dropOrClick')}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{t('import.csvOnly')}</p>
              </div>
            )}
          </div>

          {previewMutation.isError && (
            <p className="text-sm rounded-xl px-3 py-2.5" style={{ background: 'rgba(225,29,72,0.07)', color: '#e11d48' }}>
              {t('import.sendError')}
            </p>
          )}

          <button
            onClick={() => previewMutation.mutate()}
            disabled={!file || previewMutation.isPending}
            className="w-full h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
              opacity: !file || previewMutation.isPending ? 0.45 : 1,
            }}
          >
            {previewMutation.isPending && <span className="loading loading-spinner loading-xs" />}
            {t('import.next')}
          </button>
        </div>
      )}

      {/* Step 1: Map columns */}
      {step === 1 && preview && (
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl overflow-hidden" style={glass}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t('import.mapColumns')}</p>
            </div>
            {preview.columns.map((col, i) => (
              <div
                key={col}
                className="px-4 py-3 flex items-center gap-3"
                style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.04)' }}
              >
                <div className="w-1/3">
                  <p className="text-sm font-semibold text-gray-800 truncate">{col}</p>
                  <p className="text-xs text-gray-400 truncate">{preview.sample_rows[0]?.[i] ?? '—'}</p>
                </div>
                <span style={{ color: '#d1d5db' }}>→</span>
                <input
                  style={inputStyle}
                  value={mapping[col] ?? ''}
                  onChange={e => setMapping({ ...mapping, [col]: e.target.value })}
                  placeholder={t('import.practicePlaceholder')}
                  onFocus={e => { e.target.style.borderColor = '#01a386' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.10)' }}
                />
              </div>
            ))}
          </div>

          {(() => {
            const unmapped = preview.columns.filter(col => !mapping[col]?.trim())
            return unmapped.length > 0 ? (
              <div className="rounded-xl px-4 py-3 flex flex-col gap-1" style={{ background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.25)' }}>
                <p className="text-xs font-semibold" style={{ color: '#b45309' }}>{t('import.unmatchedColumns')}</p>
                <p className="text-xs" style={{ color: '#92400e' }}>{t('import.unmatchedMemo')}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {unmapped.map(col => (
                    <span key={col} className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(251,191,36,0.20)', color: '#92400e' }}>
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            ) : null
          })()}

          {confirmMutation.isError && (
            <p className="text-sm rounded-xl px-3 py-2.5" style={{ background: 'rgba(225,29,72,0.07)', color: '#e11d48' }}>
              {t('import.sendError')}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setStep(0)}
              className="flex-1 h-12 rounded-full text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.85)', color: '#374151', border: '1px solid rgba(0,0,0,0.12)' }}
            >
              ← {t('common.back')}
            </button>
            <button
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
              className="flex-1 h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
                opacity: confirmMutation.isPending ? 0.55 : 1,
              }}
            >
              {confirmMutation.isPending && <span className="loading loading-spinner loading-xs" />}
              {t('import.importBtn')}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Done */}
      {step === 2 && result && (
        <div className="rounded-2xl px-5 py-12 flex flex-col items-center gap-5" style={glass}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(1,163,134,0.12)' }}
          >
            <LuCheck className="w-7 h-7" style={{ color: '#01a386' }} />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-gray-800">{t('import.complete')}</p>
            <p className="text-sm text-gray-400 mt-1">{t('import.rowsImported', { count: result.imported_count })}</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="px-8 h-11 rounded-full text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
            }}
          >
            {t('import.done')}
          </button>
        </div>
      )}
    </div>
  )
}
