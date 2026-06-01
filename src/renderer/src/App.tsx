import { Group, Panel, Separator, useDefaultLayout } from 'react-resizable-panels'
import { EndpointList } from '@renderer/components/panels/EndpointList'
import { IndexList } from '@renderer/components/panels/IndexList'
import { QueryWorkspace } from '@renderer/components/panels/QueryWorkspace'

export default function App(): JSX.Element {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'elastatron-layout',
    storage: localStorage
  })

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
    </div>
  )
}
