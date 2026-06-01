export function QueryWorkspace(): JSX.Element {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Query
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <span className="text-xs text-muted-foreground">Select an endpoint to begin</span>
      </div>
    </div>
  )
}
