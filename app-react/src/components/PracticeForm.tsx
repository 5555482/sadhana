import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { practicesApi } from '../api/practices'
import { yatrasApi } from '../api/yatras'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { ErrorBanner } from './ui/ErrorBanner'
import type { PracticeDataType } from '../types/api'

type PracticeFormMode = { type: 'user' } | { type: 'yatra'; yatraId: string }

interface PracticeFormProps {
  mode: PracticeFormMode
  initialValues?: { name: string; dataType: PracticeDataType; dropdownVariants?: string; id?: string }
  onSuccess: () => void
}

const DATA_TYPES: PracticeDataType[] = ['Int', 'Bool', 'Text', 'Time', 'Duration']

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
    <form
      onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
      className="flex flex-col gap-4 p-4"
    >
      <Input
        label={t('practice.name')}
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex flex-col gap-1">
        <label className="label text-sm font-medium">{t('practice.type')}</label>
        <select
          className="select select-bordered w-full"
          value={dataType}
          onChange={(e) => setDataType(e.target.value as PracticeDataType)}
        >
          {DATA_TYPES.map((dt) => (
            <option key={dt} value={dt}>{dt}</option>
          ))}
        </select>
      </div>
      {dataType === 'Text' && (
        <div className="flex flex-col gap-1">
          <label className="label text-sm font-medium">{t('practice.dropdownVariants')}</label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={3}
            placeholder={t('practice.dropdownVariantsHint')}
            value={dropdownVariants}
            onChange={(e) => setDropdownVariants(e.target.value)}
          />
        </div>
      )}
      <ErrorBanner message={error} />
      <Button variant="primary" type="submit" loading={mutation.isPending} className="w-full">
        {t('common.save')}
      </Button>
    </form>
  )
}
