import { useToastStore } from '@renderer/store/toast'
import { cn } from '@renderer/lib/utils'
import { X } from 'lucide-react'

export function Toaster(): JSX.Element {
  const { toasts, remove } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-3 rounded-md border px-4 py-3 text-sm shadow-lg',
            t.type === 'success'
              ? 'border-green-700 bg-green-900/80 text-green-100'
              : 'border-red-700 bg-red-900/80 text-red-100'
          )}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="shrink-0 opacity-70 hover:opacity-100">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
