import { Button } from '@renderer/components/ui/button'
import { useAppStore } from '@renderer/store'

export default function App(): JSX.Element {
  const count = useAppStore((s) => s.count)
  const increment = useAppStore((s) => s.increment)

  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Elastatron</h1>
        <p className="text-sm text-muted-foreground">Elasticsearch Desktop Client</p>
        <Button onClick={increment}>Count: {count}</Button>
      </div>
    </div>
  )
}
