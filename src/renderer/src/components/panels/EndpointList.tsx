import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useEndpointsStore } from '@renderer/store/endpoints'
import { useConnectionStore } from '@renderer/store/connection'
import { EndpointDialog } from '@renderer/components/EndpointDialog'
import { Button } from '@renderer/components/ui/button'
import type { Endpoint, EndpointInput } from '@renderer/types/endpoint'
import type { ConnStatus } from '@renderer/types/electron'
import { cn } from '@renderer/lib/utils'

export function EndpointList(): JSX.Element {
  const { endpoints, activeId, load, add, update, remove, setActive } = useEndpointsStore()
  const connStatus = useConnectionStore((s) => s.status)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Endpoint | undefined>(undefined)

  useEffect(() => {
    load()
  }, [load])

  function openAdd(): void {
    setEditing(undefined)
    setDialogOpen(true)
  }

  function openEdit(ep: Endpoint): void {
    setEditing(ep)
    setDialogOpen(true)
  }

  async function handleSave(input: EndpointInput): Promise<void> {
    if (editing) {
      await update(editing.id, input)
    } else {
      await add(input)
    }
  }

  return (
    <div className="flex h-full flex-col border-r border-border">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Endpoints
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={openAdd}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {endpoints.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-muted-foreground">No endpoints</span>
          </div>
        ) : (
          <ul>
            {endpoints.map((ep) => (
              <EndpointRow
                key={ep.id}
                endpoint={ep}
                isActive={ep.id === activeId}
                connStatus={ep.id === activeId ? connStatus : 'idle'}
                onSelect={() => setActive(ep.id)}
                onEdit={() => openEdit(ep)}
                onDelete={() => remove(ep.id)}
              />
            ))}
          </ul>
        )}
      </div>

      <EndpointDialog
        open={dialogOpen}
        endpoint={editing}
        onSave={handleSave}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}

interface RowProps {
  endpoint: Endpoint
  isActive: boolean
  connStatus: ConnStatus
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

function statusDot(status: ConnStatus, isActive: boolean): string {
  if (!isActive) return 'bg-muted'
  switch (status) {
    case 'connected':
      return 'bg-green-500'
    case 'connecting':
      return 'bg-yellow-500 animate-pulse'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-muted'
  }
}

function EndpointRow({
  endpoint,
  isActive,
  connStatus,
  onSelect,
  onEdit,
  onDelete
}: RowProps): JSX.Element {
  return (
    <li
      className={cn(
        'group flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-accent',
        isActive && 'bg-accent'
      )}
      onClick={onSelect}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          title={connStatus}
          className={cn('h-2 w-2 shrink-0 rounded-full', statusDot(connStatus, isActive))}
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{endpoint.name}</div>
          <div className="truncate text-xs text-muted-foreground">{endpoint.url}</div>
        </div>
      </div>
      <div className="ml-2 flex shrink-0 gap-1 opacity-0 group-hover:opacity-100">
        <button
          className="rounded p-1 hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <Pencil className="h-3 w-3 text-muted-foreground" />
        </button>
        <button
          className="rounded p-1 hover:bg-destructive/20"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </li>
  )
}
