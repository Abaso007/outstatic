'use client'

import Link from 'next/link'
import { ArrowUpRight, Github, KeyRound, RotateCw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/shadcn/dialog'
import { Button } from '@/components/ui/shadcn/button'
import { OUTSTATIC_API_PATH } from '@/utils/constants'
import { useClientOrigin } from '@/utils/hooks/use-client-origin'

type GithubOAuthSetupDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerLabel?: string
  basePath?: string
}

const GITHUB_OAUTH_APP_URL = 'https://github.com/settings/applications/new'
const GITHUB_AUTH_DOCS_URL =
  'https://outstatic.com/docs/access-integration/setting-up-github-authentication'

export function GithubOAuthSetupDialog({
  open,
  onOpenChange,
  triggerLabel,
  basePath
}: GithubOAuthSetupDialogProps) {
  const clientOrigin = useClientOrigin()
  const normalizedBasePath = (basePath ?? '').replace(/\/+$/, '')
  const homepageUrl = clientOrigin
    ? `${clientOrigin}/`
    : 'https://your-site.com/'
  const callbackUrl = clientOrigin
    ? `${clientOrigin}${normalizedBasePath}${OUTSTATIC_API_PATH}/callback`
    : `https://your-site.com${normalizedBasePath}${OUTSTATIC_API_PATH}/callback`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerLabel ? (
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">{triggerLabel}</Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Connect GitHub in 3 quick steps
          </DialogTitle>
          <DialogDescription className="text-base">
            Create a GitHub OAuth app for free self-hosting.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="bg-card flex items-start gap-3 rounded-lg border p-3">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
              1
            </div>
            <div className="min-w-0">
              <p className="text-foreground flex items-center gap-2 text-sm font-medium">
                <Github className="h-4 w-4 text-primary" />
                Create a GitHub OAuth app
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Register a new OAuth app on GitHub and use these URLs:
              </p>
              <dl className="mt-2 space-y-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">Homepage URL</dt>
                  <dd>
                    <code className="bg-muted mt-1 block overflow-x-auto rounded px-2 py-1">
                      {homepageUrl}
                    </code>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    Authorization callback URL
                  </dt>
                  <dd>
                    <code className="bg-muted mt-1 block overflow-x-auto rounded px-2 py-1">
                      {callbackUrl}
                    </code>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-card flex items-start gap-3 rounded-lg border p-3">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
              2
            </div>
            <div className="min-w-0">
              <p className="text-foreground flex items-center gap-2 text-sm font-medium">
                <KeyRound className="h-4 w-4 text-primary" />
                Add the OAuth credentials
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Generate a client secret, then add the Client ID and Client
                Secret to your <code>.env</code> file.
              </p>
              <code className="bg-muted mt-2 block overflow-x-auto whitespace-pre rounded px-2 py-1 text-xs">
                {
                  'OST_GITHUB_ID=YOUR_GITHUB_OAUTH_APP_ID\nOST_GITHUB_SECRET=YOUR_GITHUB_OAUTH_APP_SECRET'
                }
              </code>
            </div>
          </div>

          <div className="bg-card flex items-start gap-3 rounded-lg border p-3">
            <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
              3
            </div>
            <div>
              <p className="text-foreground flex items-center gap-2 text-sm font-medium">
                <RotateCw className="h-4 w-4 text-primary" />
                Restart and sign in
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Restart your app, return to this page, and click Sign in with
                GitHub again.
              </p>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          Outstatic Pro users can continue using <code>OUTSTATIC_API_KEY</code>{' '}
          for managed sign-in and Pro features.
        </p>
        <DialogFooter>
          <Button asChild variant="outline">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={GITHUB_AUTH_DOCS_URL}
            >
              View setup guide
            </Link>
          </Button>
          <Button asChild>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={GITHUB_OAUTH_APP_URL}
            >
              Create GitHub OAuth App
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
