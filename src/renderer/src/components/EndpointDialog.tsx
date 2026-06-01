import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import type { Endpoint, EndpointInput, AuthMethod } from '@renderer/types/endpoint'

interface Props {
  open: boolean
  endpoint?: Endpoint
  onSave: (input: EndpointInput) => Promise<void>
  onClose: () => void
}

const blank: EndpointInput = {
  name: '',
  url: '',
  authMethod: 'basic',
  username: '',
  credential: '',
  ignoreSSL: false
}

export function EndpointDialog({ open, endpoint, onSave, onClose }: Props): JSX.Element {
  const [form, setForm] = useState<EndpointInput>(blank)
  const [saving, setSaving] = useState(false)
  const isEdit = !!endpoint

  useEffect(() => {
    if (open) {
      setForm(
        endpoint
          ? {
              name: endpoint.name,
              url: endpoint.url,
              authMethod: endpoint.authMethod,
              username: endpoint.username ?? '',
              credential: '',
              ignoreSSL: endpoint.ignoreSSL
            }
          : blank
      )
    }
  }, [open, endpoint])

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setSaving(true)
    try {
      const input: EndpointInput = {
        ...form,
        credential: isEdit && !form.credential ? undefined : form.credential
      }
      await onSave(input)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  function set<K extends keyof EndpointInput>(key: K, value: EndpointInput[K]): void {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit endpoint' : 'Add endpoint'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ep-name">Name</Label>
            <Input
              id="ep-name"
              placeholder="Local Dev"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ep-url">URL</Label>
            <Input
              id="ep-url"
              placeholder="https://localhost:9200"
              value={form.url}
              onChange={(e) => set('url', e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Auth method</Label>
            <div className="flex gap-4">
              {(['basic', 'apikey'] as AuthMethod[]).map((method) => (
                <label key={method} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="authMethod"
                    value={method}
                    checked={form.authMethod === method}
                    onChange={() => set('authMethod', method)}
                    className="accent-primary"
                  />
                  {method === 'basic' ? 'Basic auth' : 'API key'}
                </label>
              ))}
            </div>
          </div>

          {form.authMethod === 'basic' && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ep-username">Username</Label>
              <Input
                id="ep-username"
                placeholder="elastic"
                value={form.username ?? ''}
                onChange={(e) => set('username', e.target.value)}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ep-credential">
              {form.authMethod === 'basic' ? 'Password' : 'API key'}
            </Label>
            <Input
              id="ep-credential"
              type="password"
              placeholder={isEdit ? 'Leave blank to keep existing' : ''}
              value={form.credential ?? ''}
              onChange={(e) => set('credential', e.target.value)}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.ignoreSSL}
              onChange={(e) => set('ignoreSSL', e.target.checked)}
              className="accent-primary"
            />
            Ignore SSL certificate errors
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
