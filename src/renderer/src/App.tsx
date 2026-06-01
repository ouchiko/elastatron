import { useEffect } from 'react'
import { Group, Panel, Separator, useDefaultLayout } from 'react-resizable-panels'
import { EndpointList } from '@renderer/components/panels/EndpointList'
import { IndexList } from '@renderer/components/panels/IndexList'
import { QueryWorkspace } from '@renderer/components/panels/QueryWorkspace'
import { Toaster } from '@renderer/components/Toaster'
import { useConnectionStore } from '@renderer/store/connection'

export default function App(): JSX.Element {
  const onStatusUpdate = useConnectionStore((s) => s.onStatusUpdate)
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'elastatron-layout',
    storage: localStorage
  })

  useEffect(() => {
    window.connection.onStatus(onStatusUpdate)
  }, [onStatusUpdate])

  return (
    <div className="h-screen bg-background text-foreground">
      <Group
        direction="horizontal"
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
      >
        <Panel defaultSize={20} minSize={15}>
          <EndpointList />
        </Panel>
        <Separator className="w-px bg-border transition-colors hover:bg-primary" />
        <Panel defaultSize={60} minSize={30}>
          <QueryWorkspace />
        </Panel>
        <Separator className="w-px bg-border transition-colors hover:bg-primary" />
        <Panel defaultSize={20} minSize={15}>
          <IndexList />
        </Panel>
      </Group>
      <Toaster />
    </div>
  )
}
