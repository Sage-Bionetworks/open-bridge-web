import * as useUserSessionDataState from '@helpers/AuthContext'
import AdherenceService from '@services/adherence.service'
import {act, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import constants from '@typedefs/constants'
import {AdherenceAlert} from '@typedefs/types'
import {rest} from 'msw'
import * as adherenceAlerts from '__test_utils/mocks/adherenceAlerts.json'
import {loggedInSessionData} from '__test_utils/mocks/user'
import server from '__test_utils/test_server/server'
import {createWrapper} from '__test_utils/utils'
import AdherenceAlerts from './AdherenceAlerts'

type AdherenceAlertBody = {
  items: AdherenceAlert[]
  total: number
}

const studyId = 'hprczm'

jest.mock('@helpers/AuthContext')

const mockedAuth = useUserSessionDataState as jest.Mocked<typeof useUserSessionDataState>
mockedAuth.useUserSessionDataState.mockImplementation(() => loggedInSessionData)

export const renderComponent = () => {
  const userData = loggedInSessionData
  mockedAuth.useUserSessionDataState.mockImplementation(() => userData)

  const element = render(<AdherenceAlerts studyId={studyId} />, {wrapper: createWrapper()})
  return element
}

describe('AdherenceAlerts', () => {
  test('should render table with all filters checked', async () => {
    // set up
    renderComponent()
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

  test('should call service with appropriate filters', async () => {
    const user = userEvent.setup()

    // spy on adherence alerts service
    const spyOnGetAdherenceAlerts = jest.spyOn(AdherenceService, 'getAdherenceAlerts').mockImplementation(() => {
      console.log('getting all mocked alerts from spy!')
      return Promise.resolve(adherenceAlerts as AdherenceAlertBody)
    })
    const filters = [
      'low_adherence',
      'new_enrollment',
      'study_burst_change',
      'timeline_accessed',
      'upcoming_study_burst',
    ]

    // set up
    renderComponent()
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

    // restore
    spyOnGetAdherenceAlerts.mockRestore()
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
    renderComponent()

    // checkboxes exist
    screen.queryAllByRole('checkbox').forEach(eachCheckbox => {
      expect(eachCheckbox).toHaveProperty('checked', true)
    })

    // table does not exist
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
