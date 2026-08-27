import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { GithubOAuthSetupDialog } from '../github-oauth-setup-dialog'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode
    href: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

describe('<GithubOAuthSetupDialog />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.history.pushState({}, '', '/')
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    })
  })

  it('renders the three-step GitHub OAuth setup guide', () => {
    render(
      <GithubOAuthSetupDialog open onOpenChange={jest.fn()} basePath="/cms" />
    )

    expect(
      screen.getByText('Connect GitHub in 3 quick steps')
    ).toBeInTheDocument()
    expect(screen.getByText('Create a GitHub OAuth app')).toBeInTheDocument()
    expect(screen.getByText('Add the OAuth credentials')).toBeInTheDocument()
    expect(screen.getByText('Restart and sign in')).toBeInTheDocument()
    expect(
      screen.getByText(/Add your Client ID and Secret to/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Create a GitHub OAuth app for free self-hosting.')
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/Outstatic Pro users/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText('OUTSTATIC_API_KEY=your_api_key_here')
    ).not.toBeInTheDocument()

    expect(screen.getByText('http://localhost/')).toBeInTheDocument()
    expect(
      screen.getByText('http://localhost/cms/api/outstatic/callback')
    ).toBeInTheDocument()
    expect(
      screen.getByText(/OST_GITHUB_ID=YOUR_GITHUB_OAUTH_APP_ID/)
    ).toHaveTextContent(
      'OST_GITHUB_ID=YOUR_GITHUB_OAUTH_APP_ID OST_GITHUB_SECRET=YOUR_GITHUB_OAUTH_APP_SECRET'
    )

    expect(
      screen.getByRole('link', { name: /create github oauth app/i })
    ).toHaveAttribute('href', 'https://github.com/settings/applications/new')
    expect(
      screen.getByRole('link', { name: /view setup guide/i })
    ).toHaveAttribute(
      'href',
      'https://outstatic.com/docs/access-integration/setting-up-github-authentication'
    )
  })

  it('builds the callback URL without a base path when one is not configured', () => {
    render(<GithubOAuthSetupDialog open onOpenChange={jest.fn()} />)

    expect(
      screen.getByText('http://localhost/api/outstatic/callback')
    ).toBeInTheDocument()
  })

  it('copies the homepage, callback, and empty environment variables', async () => {
    render(
      <GithubOAuthSetupDialog open onOpenChange={jest.fn()} basePath="/cms" />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Copy homepage URL' }))

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'http://localhost/'
      )
      expect(
        screen.getByRole('button', { name: 'homepage URL copied' })
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Copy authorization callback URL'
      })
    )

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'http://localhost/cms/api/outstatic/callback'
      )
      expect(
        screen.getByRole('button', {
          name: 'authorization callback URL copied'
        })
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Copy environment variables'
      })
    )

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'OST_GITHUB_ID=\nOST_GITHUB_SECRET='
      )
      expect(
        screen.getByRole('button', {
          name: 'environment variables copied'
        })
      ).toBeInTheDocument()
    })
  })
})
