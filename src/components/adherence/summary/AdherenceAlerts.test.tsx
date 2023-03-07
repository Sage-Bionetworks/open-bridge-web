import * as useUserSessionDataState from '@helpers/AuthContext'
import AdherenceService from '@services/adherence.service'
import {act, cleanup, render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import constants from '@typedefs/constants'
import {rest} from 'msw'
import * as adherenceAlerts from '__test_utils/mocks/adherenceAlerts.json'
import {loggedInSessionData} from '__test_utils/mocks/user'
import server from '__test_utils/test_server/server'
import {createWrapper} from '__test_utils/utils'
import AdherenceAlerts from './AdherenceAlerts'

const studyId = 'hprczm'

jest.mock('@helpers/AuthContext')

const mockedAuth = useUserSessionDataState as jest.Mocked<typeof useUserSessionDataState>
mockedAuth.useUserSessionDataState.mockImplementation(() => loggedInSessionData)

export const setUp = () => {
  const userData = loggedInSessionData
  mockedAuth.useUserSessionDataState.mockImplementation(() => userData)

  const user = userEvent.setup()

  // create new spy within each test
  // ...so MSW handler implementation is not overriden
  const spyOnGetAdherenceAlerts = jest.spyOn(AdherenceService, 'getAdherenceAlerts')
  const spyOnUpdateAdherenceAlerts = jest.spyOn(AdherenceService, 'updateAdherenceAlerts')

  const element = render(<AdherenceAlerts studyId={studyId} />, {wrapper: createWrapper()})
  return {user, spyOnGetAdherenceAlerts, spyOnUpdateAdherenceAlerts, element}
}

afterEach(() => {
  jest.restoreAllMocks()
  cleanup()
})

describe('AdherenceAlerts', () => {
  test('should render table with all filters checked', async () => {
    // set up
    setUp()
    expect(screen.queryByRole('progressbar')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // all filters are checked
    screen.queryAllByRole('checkbox').forEach(eachCheckbox => {
      expect(eachCheckbox).toHaveProperty('checked', true)
    })

    // table exists
    expect(screen.queryByRole('table')).toBeInTheDocument()
    expect(screen.queryAllByRole('row')).toHaveLength(adherenceAlerts.total)
  })

  test('should call get alerts service with appropriate filters', async () => {
    const filters = [
      'low_adherence',
      'new_enrollment',
      'study_burst_change',
      'timeline_accessed',
      'upcoming_study_burst',
    ]

    // set up
    const {user, spyOnGetAdherenceAlerts} = setUp()
    await waitFor(() => {
      expect(screen.queryByRole('table')).toBeInTheDocument()
    })

    // correct call made
    expect(spyOnGetAdherenceAlerts).toHaveBeenCalledTimes(1)
    expect(spyOnGetAdherenceAlerts).toHaveBeenLastCalledWith(
      studyId,
      filters,
      expect.any(Number),
      expect.any(Number),
      loggedInSessionData.token
    )

    // uncheck filter and show that hook is called correctly
    const checkbox = screen.getByRole('checkbox', {name: /adherence/i})
    await act(async () => await user.click(checkbox))
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    expect(screen.queryByRole('table')).toBeInTheDocument()

    // hook called with correct categories
    expect(spyOnGetAdherenceAlerts).toHaveBeenCalledTimes(2)
    expect(spyOnGetAdherenceAlerts).toHaveBeenLastCalledWith(
      studyId,
      filters.splice(1),
      expect.any(Number),
      expect.any(Number),
      loggedInSessionData.token
    )
  })

  test('should not render table when there are no alerts', async () => {
    // override server handler
    server.use(
      rest.post(`*${constants.endpoints.adherenceAlerts}`, async (req, res, ctx) => {
        console.log('getting empty mocked alerts!')
        return res(
          ctx.status(200),
          ctx.json({
            items: [],
            total: 0,
            requestParams: {
              pageSize: 50,
              offsetBy: 0,
              type: 'RequestParams',
            },
            type: 'PagedResourceList',
          })
        )
      })
    )

    // set up
    setUp()

    // checkboxes exist
    screen.queryAllByRole('checkbox').forEach(eachCheckbox => {
      expect(eachCheckbox).toHaveProperty('checked', true)
    })

    // table does not exist
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  describe('update alerts', () => {
    const readAlertId = 'JHnmnYJTxCT_9IltWOCikv23'
    const unreadAlertId = 'JHnmnYJTxCT_9IltWOCikv05'
    const readAlertIndex = 0
    const unreadAlertIndex = 1
    test('should call update alerts correctly to mark alerts as unread', async () => {
      const {user, spyOnUpdateAdherenceAlerts} = setUp()
      await waitFor(() => {
        expect(screen.queryByRole('table')).toBeInTheDocument()
      })

      const readAlertButton = screen.getAllByRole('button', {name: /more/i})[readAlertIndex]
      user.click(readAlertButton)
      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })
      user.click(screen.getByRole('menuitem', {name: /mark as unread/i}))
      await waitForElementToBeRemoved(screen.getByRole('menu'))

      expect(spyOnUpdateAdherenceAlerts).toHaveBeenCalledTimes(1)
      expect(spyOnUpdateAdherenceAlerts).toHaveBeenLastCalledWith(
        studyId,
        [readAlertId],
        'UNREAD',
        loggedInSessionData.token
      )
    })

    test('should call update alerts correctly to mark alerts as read', async () => {
      const {user, spyOnUpdateAdherenceAlerts} = setUp()
      await waitFor(() => {
        expect(screen.queryByRole('table')).toBeInTheDocument()
      })

      const unreadAlertButton = screen.getAllByRole('button', {name: /more/i})[unreadAlertIndex]
      user.click(unreadAlertButton)
      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })
      user.click(screen.getByRole('menuitem', {name: /mark as read/i}))
      await waitForElementToBeRemoved(screen.getByRole('menu'))

      expect(spyOnUpdateAdherenceAlerts).toHaveBeenCalledTimes(1)
      expect(spyOnUpdateAdherenceAlerts).toHaveBeenLastCalledWith(
        studyId,
        [unreadAlertId],
        'READ',
        loggedInSessionData.token
      )
    })

    test('should call update alerts correctly to delete alerts', async () => {
      const {user, spyOnUpdateAdherenceAlerts} = setUp()
      await waitFor(() => {
        expect(screen.queryByRole('table')).toBeInTheDocument()
      })

      // cancel resolve
      const unreadAlertButton = screen.getAllByRole('button', {name: /more/i})[unreadAlertIndex]
      user.click(unreadAlertButton)
      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })
      user.click(screen.getByRole('menuitem', {name: /resolve/i}))
      await waitForElementToBeRemoved(screen.getByRole('menu'))
      const cancelButton = screen.getByRole('button', {name: /cancel/i})
      user.click(cancelButton)
      await waitForElementToBeRemoved(cancelButton)

      expect(spyOnUpdateAdherenceAlerts).toHaveBeenCalledTimes(0)

      // resolve alert
      user.click(unreadAlertButton)
      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })
      user.click(screen.getByRole('menuitem', {name: /resolve/i}))
      await waitForElementToBeRemoved(screen.getByRole('menu'))
      const resolveButton = screen.getByRole('button', {name: /resolve alert/i})
      user.click(resolveButton)
      await waitForElementToBeRemoved(resolveButton)

      expect(spyOnUpdateAdherenceAlerts).toHaveBeenCalledTimes(1)
      expect(spyOnUpdateAdherenceAlerts).toHaveBeenLastCalledWith(
        studyId,
        [unreadAlertId],
        'DELETE',
        loggedInSessionData.token
      )
    })
  })
})
