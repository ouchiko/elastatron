import { useEffect } from 'react'
import { useConnectionStore } from '../../store/connection'
import { useIndicesStore } from '../../store/indices'

const HEALTH_DOT: Record<string, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  unknown: 'bg-muted-foreground/50'
}

function Header(): JSX.Element {
  return (
    <div className="border-b border-border px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Indices
      </span>
    </div>
  )
}

function CenteredMessage({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex h-full flex-col border-l border-border">
      <Header />
      <div className="flex flex-1 items-center justify-center px-4">
        <span className="text-center text-xs text-muted-foreground">{children}</span>
      </div>
    </div>
  )
}

export function IndexList(): JSX.Element {
  const { status, endpointId } = useConnectionStore()
  const { indices, loading, error, load } = useIndicesStore()

  useEffect(() => {
    if (status === 'connected') {
      load()
    }
  }, [status, endpointId])

  if (status !== 'connected') {
    return <CenteredMessage>No active connection</CenteredMessage>
  }

  if (loading) {
    return <CenteredMessage>Loading…</CenteredMessage>
  }

  if (error) {
    return (
      <div className="flex h-full flex-col border-l border-border">
        <Header />
        <div className="flex flex-1 items-center justify-center px-4">
          <span className="text-center text-xs text-destructive">{error}</span>
        </div>
      </div>
    )
  }

  if (indices.length === 0) {
    return <CenteredMessage>No indices found</CenteredMessage>
  }

  return (
    <div className="flex h-full flex-col border-l border-border">
      <Header />
      <div className="flex-1 overflow-y-auto">
        {indices.map((idx) => (
          <div
            key={idx.name}
            className="flex items-center gap-2 border-b border-border/50 px-3 py-2 hover:bg-accent/50"
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${HEALTH_DOT[idx.health] ?? HEALTH_DOT.unknown}`}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">{idx.name}</div>
              <div className="text-xs text-muted-foreground">
                {idx.docsCount.toLocaleString()} docs · {idx.size}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
