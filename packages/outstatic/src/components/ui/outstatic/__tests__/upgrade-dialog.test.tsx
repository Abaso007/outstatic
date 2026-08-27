import { UpgradeDialog } from '../upgrade-dialog'
import { fireEvent, render, screen } from '@testing-library/react'

const { renderToString } =
  require('react-dom/server.node') as typeof import('react-dom/server')

describe('UpgradeDialog', () => {
  it('server-renders trigger children without mounting Radix dialog markup', () => {
    const html = renderToString(
      <UpgradeDialog>
        <button type="button">Upgrade</button>
      </UpgradeDialog>
    )

    expect(html).toContain('Upgrade')
    expect(html).not.toContain('radix-')
    expect(html).not.toContain('Upgrade to Pro')
  })

  it('routes demo users to the project flow selection step', async () => {
    render(
      <UpgradeDialog open feature="demo" accountSlug="my-team">
        <button type="button">Edit demo</button>
      </UpgradeDialog>
    )

    const link = await screen.findByRole('link', { name: /Create your own/i })
    const destination = new URL(link.getAttribute('href') ?? '')

    expect(destination.pathname).toBe('/home/my-team/')
    expect(destination.searchParams.get('new_project')).toBe('true')
    expect(destination.searchParams.get('new_project_flow')).toBeNull()
    expect(destination.searchParams.get('template_repository')).toBeNull()
    expect(link).toHaveAttribute('target', '_self')
  })

  it('shows the Pro headline and prioritizes authentication features', async () => {
    render(
      <UpgradeDialog open>
        <button type="button">Upgrade</button>
      </UpgradeDialog>
    )

    expect(await screen.findByText('Sorry, only with Pro')).toBeInTheDocument()
    expect(
      screen
        .getAllByRole('heading', { level: 4 })
        .map((heading) => heading.textContent)
    ).toEqual(['Email and Google Authentication', 'Team Collaboration'])
    expect(screen.queryByText('AI Completions')).not.toBeInTheDocument()
  })

  it('offers GitHub sign-in when the login flow provides the action', async () => {
    const onGithubSignIn = jest.fn()

    render(
      <UpgradeDialog open onGithubSignIn={onGithubSignIn}>
        <button type="button">Upgrade</button>
      </UpgradeDialog>
    )

    fireEvent.click(
      await screen.findByRole('button', { name: 'Or sign in with GitHub' })
    )

    expect(onGithubSignIn).toHaveBeenCalledTimes(1)
  })
})
