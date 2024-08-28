import { useOstSession } from '@/utils/auth/hooks'
import { useOutstatic } from '@/utils/hooks'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export type AdminLayoutProps = {
  error?: string
  children: React.ReactNode
  settings?: React.ReactNode
  title?: string
}

export default function AdminLayout({
  children,
  error,
  settings,
  title
}: AdminLayoutProps) {
  const { dashboardRoute } = useOutstatic()
  const { status } = useOstSession()
  const { push } = useRouter()

  useEffect(() => {
    const pageTitle = title ? `${title} | Outstatic` : 'Outstatic'
    document.title = pageTitle
  }, [title])

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') {
      push(dashboardRoute)
    }
    return null
  }

  return (
    <>
      {status === 'loading' ? null : (
        <>
          <main className="w-auto flex-auto bg-white h-dvh max-h-[calc(100vh-128px)] md:max-h-[calc(100vh-64px)] overflow-y-scroll scrollbar-hide">
            {error && (
              <div className="mb-6 border border-red-500 p-2">
                Something went wrong{' '}
                <span role="img" aria-label="sad face">
                  😓
                </span>
              </div>
            )}
            {children}
          </main>
          {settings && settings}
        </>
      )}
    </>
  )
}
