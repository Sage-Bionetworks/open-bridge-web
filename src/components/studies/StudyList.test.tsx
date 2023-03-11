import * as useUserSessionDataState from '@helpers/AuthContext'
import {render, screen, waitFor} from '@testing-library/react'
import constants from '@typedefs/constants'
import {rest} from 'msw'
import {loggedInSessionData} from '__test_utils/mocks/user'
import server from '__test_utils/test_server/server'
import {createWrapper} from '__test_utils/utils'
import StudyList from './StudyList'

jest.mock('@helpers/AuthContext')

const mockedAuth = useUserSessionDataState as jest.Mocked<typeof useUserSessionDataState>
mockedAuth.useUserSessionDataState.mockImplementation(() => loggedInSessionData)

function renderComponent(isVerified: boolean | undefined) {
  const userData = {...loggedInSessionData, isVerified: isVerified}
  mockedAuth.useUserSessionDataState.mockImplementation(() => userData)

  const routeComponentPropsMock = {
    history: {} as any,
    location: {} as any,
    match: {} as any,
  }

  // stub for adherence weekly handler - StudyCard calls useAdherenceForWeek hook
  server.use(
    rest.post(`*${constants.endpoints.adherenceWeekly}`, async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          items: [],
          total: 0,
        })
      )
    })
  )

  // scroll window placeholder
  window.scrollTo = jest.fn()

  return render(<StudyList {...routeComponentPropsMock} />, {wrapper: createWrapper()})
}

describe('Verify Banner', () => {
  test('should appear when user is not verified', async () => {
    // set up
    renderComponent(false)

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // show that banner appears
    expect(screen.queryByRole('alert')).toBeInTheDocument()
    expect(screen.queryByRole('link', {name: /become verified/i}))
  })

  test('should appear when isVerified is undefined', async () => {
    // set up
    renderComponent(undefined)

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // show that banner appears
    expect(screen.queryByRole('alert')).toBeInTheDocument()
    expect(screen.queryByRole('link', {name: /become verified/i}))
  })

  test('should not appear when user is verified', async () => {
    // set up
    renderComponent(true)

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // show that banner is not present
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', {name: /become verified/i})).not.toBeInTheDocument()
  })
})
