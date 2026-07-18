import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import { importApi } from '../../api/import'
import { Button } from '../../components/ui/Button'
import type { ImportPreview } from '../../types/api'

export function ImportPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{ imported_count: number } | null>(null)

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
    <div className="px-4 py-4 flex flex-col gap-6">
      <ul className="steps steps-horizontal w-full">
        {['Upload', 'Map columns', 'Done'].map((s, i) => (
          <li key={s} className={`step ${i <= step ? 'step-primary' : ''}`}>{s}</li>
        ))}
      </ul>

      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-box p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <p className="font-medium">{file.name}</p>
            ) : (
              <p className="text-base-content/50">Drop a CSV file here, or click to browse</p>
            )}
          </div>
          <Button
            variant="primary"
            disabled={!file}
            loading={previewMutation.isPending}
            onClick={() => previewMutation.mutate()}
            className="w-full"
          >
            Next →
          </Button>
        </div>
      )}

      {step === 1 && preview && (
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>CSV Column</th>
                  <th>Map to practice</th>
                  <th>Sample</th>
                </tr>
              </thead>
              <tbody>
                {preview.columns.map((col, i) => (
                  <tr key={col}>
                    <td className="font-medium">{col}</td>
                    <td>
                      <input
                        className="input input-bordered input-sm w-32"
                        value={mapping[col] ?? ''}
                        onChange={(e) => setMapping({ ...mapping, [col]: e.target.value })}
                        placeholder="practice name"
                      />
                    </td>
                    <td className="text-xs text-base-content/50">
                      {preview.sample_rows[0]?.[i] ?? ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(0)} className="flex-1">← Back</Button>
            <Button
              variant="primary"
              loading={confirmMutation.isPending}
              onClick={() => confirmMutation.mutate()}
              className="flex-1"
            >
              Import
            </Button>
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="text-success text-5xl">✓</div>
          <p className="font-semibold">Imported {result.imported_count} rows</p>
          <Button variant="primary" onClick={() => navigate('/settings')} className="w-full">
            Done
          </Button>
        </div>
      )}
    </div>
  )
}
