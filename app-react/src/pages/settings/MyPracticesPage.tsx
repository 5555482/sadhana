import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaGripVertical, FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { practicesApi } from '../../api/practices'
import { Spinner } from '../../components/ui/Spinner'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import type { UserPractice } from '../../types/api'
import { useTranslation } from 'react-i18next'

function SortableRow({ practice, onDelete }: { practice: UserPractice; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: practice.id })
  const { t } = useTranslation()
  const style = { transform: CSS.Transform.toString(transform), transition }
  const modalId = `delete-practice-${practice.id}`

  return (
    <div ref={setNodeRef} style={style} className="card bg-base-100 shadow-sm">
      <div className="card-body p-3 flex-row items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="btn btn-ghost btn-xs btn-circle cursor-grab touch-none"
          aria-label="Drag to reorder"
        >
          <FaGripVertical className="w-4 h-4 text-base-content/40" />
        </button>
        <div className="flex-1 min-w-0">
          <span className="font-medium">{practice.practice}</span>
          <span className="badge badge-ghost badge-sm ml-2">{practice.data_type}</span>
        </div>
        <Link
          to={`/user/practice/${practice.id}/edit`}
          className="btn btn-ghost btn-xs btn-circle"
        >
          <FaEdit className="w-4 h-4" />
        </Link>
        <button
          className="btn btn-ghost btn-xs btn-circle text-error"
          onClick={() => (document.getElementById(modalId) as HTMLDialogElement)?.showModal()}
        >
          <FaTrash className="w-4 h-4" />
        </button>
        <ConfirmModal
          id={modalId}
          title={t('practice.delete')}
          message={`${t('practice.deleteConfirm')} "${practice.practice}"?`}
          confirmLabel={t('common.delete')}
          onConfirm={() => onDelete(practice.id)}
        />
      </div>
    </div>
  )
}

export function MyPracticesPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const { data = [], isLoading } = useQuery({
    queryKey: ['practices'],
    queryFn: practicesApi.getUserPractices,
  })
  const [items, setItems] = useState<UserPractice[]>([])
  const initialized = useRef(false)

  if (!initialized.current && data.length > 0) {
    setItems(data)
    initialized.current = true
  }

  const reorder = useMutation({
    mutationFn: (ids: string[]) => practicesApi.reorderUserPractices(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['practices'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => practicesApi.deleteUserPractice(id),
    onSuccess: () => {
      initialized.current = false
      qc.invalidateQueries({ queryKey: ['practices'] })
    },
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = items.findIndex((i) => i.id === active.id)
    const newIdx = items.findIndex((i) => i.id === over.id)
    const next = arrayMove(items, oldIdx, newIdx)
    setItems(next)
    reorder.mutate(next.map((i) => i.id))
  }

  if (isLoading) return <Spinner />

  return (
    <div className="px-4 py-4 flex flex-col gap-3 pb-24">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((p) => (
            <SortableRow key={p.id} practice={p} onDelete={(id) => deleteMutation.mutate(id)} />
          ))}
        </SortableContext>
      </DndContext>
      {items.length === 0 && (
        <p className="text-center text-base-content/50 py-8">{t('practice.empty')}</p>
      )}
      <Link
        to="/user/practice/new"
        className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-4 shadow-lg z-30"
      >
        <FaPlus className="w-6 h-6" />
      </Link>
    </div>
  )
}
