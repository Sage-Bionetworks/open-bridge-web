import {cleanup, render, screen, waitForElementToBeRemoved, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {EventUpdateType, SchedulingEvent, StudySession} from '@typedefs/scheduling'
import React from 'react'
import {act} from 'react-dom/test-utils'
import {createWrapper} from '__test_utils/utils'
import SchedulableSingleSessionContainer from './SchedulableSingleSessionContainer'

const onUpdateFn = jest.fn()

afterEach(() => {
  cleanup()
})

const studySession: StudySession = {
  guid: 'PVmIJnk8yOgyIZ6oUM28TaJU',
  name: 'Session1',
  symbol: 'Session1Circle',
  performanceOrder: 'participant_choice',
  assessments: [
    {
      guid: 'Bf1w8SGCcOTj-ssNIPuDNNS1',
      appId: 'shared',
      identifier: 'vocabulary',
      revision: 7,
      title: 'Word Meaning',
      tags: ['vocabulary'],
      minutesToComplete: 2,
    },
  ],
  timeWindows: [
    {
      guid: 'YJEULu_UIHqzciaUeqL4N4K6',
      startTime: '08:00',
      persistent: false,

      expiration: 'PT2H',
    },
    {
      guid: 'CTZYEcLRO-LqKTaW5Y4wwPQ_',
      startTime: '10:15',
      expiration: 'PT2H',
      persistent: false,
    },
  ],
  notifications: [
    {
      notifyAt: 'after_window_start',
      offset: 'PT40M',
      allowSnooze: false,
      messages: [
        {
          lang: 'en',
          subject: 'New Activities are Live',
          message: 'Please complete',
        },
      ],
    },
    {
      notifyAt: 'before_window_end',
      offset: 'PT15M',
      allowSnooze: false,
      messages: [
        {
          lang: 'en',
          subject: 'New Activities are Live',
          message: 'Please complete',
        },
      ],
    },
  ],
  studyBurstIds: [],
  labels: [],
  startEventIds: ['timeline_retrieved'],
}

const customEvents = [
  {
    eventId: 'Event 1',
    updateType: 'mutable' as EventUpdateType,
    type: 'CustomEvent',
  },
  {
    eventId: 'Event 2',
    updateType: 'mutable' as EventUpdateType,
    type: 'CustomEvent',
  },
  {
    eventId: 'Event 3',
    updateType: 'mutable' as EventUpdateType,
    type: 'CustomEvent',
  },
]

const SessionWrapper: React.FunctionComponent<{_session: StudySession; customEvents: SchedulingEvent[]}> = ({
  _session,
  customEvents,
}) => {
  const [session, setSession] = React.useState(_session)

  return (
    <SchedulableSingleSessionContainer
      onOpenEventsEditor={() => {}}
      key={'12345'}
      customEvents={customEvents}
      sessionErrorState={undefined}
      studySession={session}
      hasCriticalStartEvent={false}
      burstOriginEventId={undefined}
      onUpdateSessionSchedule={(
        ss: StudySession,
        shouldInvalidateBurst: boolean,
        shouldUpdateStudyStartEvent: boolean
      ) => {
        onUpdateFn(ss, shouldInvalidateBurst, shouldUpdateStudyStartEvent)
        setSession(ss)
      }}
    />
  )
}

function setUp(session: StudySession, customEvents: SchedulingEvent[] = []) {
  const user = userEvent.setup()
  const component = render(<SessionWrapper _session={session} customEvents={customEvents} />, {
    wrapper: createWrapper(),
  })
  return {component, user}
}

describe('SchedulableSingleSessionContainer', () => {
  describe('start date', () => {
    test('should switch start date to start event only', async () => {
      const {user} = setUp({...studySession, delay: 'PT47H', startEventIds: ['custom:Event 2']}, customEvents)

      const section = screen.getByRole('region', {name: /scheduling-form-section-start-date/i})
      const eventOnlyRadioButton = within(within(section).getByLabelText('event-only')).getByRole('radio')
      const eventAndDurationRadioButton = within(within(section).getByLabelText('event-and-duration')).getByRole(
        'radio'
      )

      expect(eventOnlyRadioButton.parentElement).not.toHaveClass('Mui-checked')
      expect(eventAndDurationRadioButton.parentElement).toHaveClass('Mui-checked')

      await act(async () => {
        await user.click(eventOnlyRadioButton)
      })

      expect(eventOnlyRadioButton.parentElement).toHaveClass('Mui-checked')
      expect(eventAndDurationRadioButton.parentElement).not.toHaveClass('Mui-checked')

      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenLastCalledWith(
        {...studySession, startEventIds: ['custom:Event 2']},
        undefined,
        undefined
      )
    })

    test('should update start date - change start event only', async () => {
      const {user} = setUp(studySession, customEvents)

      const section = screen.getByRole('region', {name: /scheduling-form-section-start-date/i})
      const formGroup = within(section).getByLabelText('event-only')
      const eventButton = within(formGroup).getByRole('button', {name: /initial_login/i})

      await act(async () => {
        user.click(eventButton)
      })
      const eventDropdownItem = await screen.findByRole('option', {name: /event 2/i})
      user.click(eventDropdownItem)
      await waitForElementToBeRemoved(eventDropdownItem)

      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenLastCalledWith({...studySession, startEventIds: ['custom:Event 2']}, true, false)
      expect(await within(formGroup).findByRole('button', {name: /event 2/i})).toBeInTheDocument()
    })

    test('should switch start date to duration and start event', async () => {
      const {user} = setUp(studySession, customEvents)

      const formGroup = screen.getByLabelText('event-and-duration')
      const radioButton = within(formGroup).getByRole('radio')
      expect(radioButton.parentElement).not.toHaveClass('Mui-checked')

      await act(async () => {
        await user.click(radioButton)
      })
      expect(radioButton.parentElement).toHaveClass('Mui-checked')

      const durationBox = within(formGroup).getByLabelText('duration-box')
      const durationValue = within(durationBox).getByRole('spinbutton')
      const durationUnitsButton = within(durationBox).getByRole('button')

      const eventButtonContainer = within(formGroup).getByLabelText('select-event-id')
      const eventButton = within(eventButtonContainer).getByRole('button')

      expect(durationValue).toHaveValue(null)
      expect(durationBox).toHaveTextContent('days')
      expect(eventButton).toHaveTextContent(/initial_login/i)

      await act(async () => {
        await user.clear(durationValue)
        await user.type(durationValue, '47')
        await user.keyboard('{Tab}') // to trigger onUpdateFn
      })
      expect(durationValue).toHaveValue(47)
      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenLastCalledWith({...studySession, delay: 'P47D'}, undefined, undefined)

      user.click(durationUnitsButton)
      const durationDropdownItem = await screen.findByRole('option', {name: /hours/i})
      user.click(durationDropdownItem)
      await waitForElementToBeRemoved(durationDropdownItem)
      expect(durationBox).toHaveTextContent('hours')

      expect(onUpdateFn).toHaveBeenLastCalledWith({...studySession, delay: 'PT47H'}, undefined, undefined)
    })

    test('should update start date - change start event in duration and event section', async () => {
      const {user} = setUp({...studySession, delay: 'PT47H', startEventIds: ['custom:Event 2']}, customEvents)

      const section = screen.getByRole('region', {name: /scheduling-form-section-start-date/i})
      const formGroup = within(section).getByLabelText('event-and-duration')
      const eventButton = within(within(formGroup).getByLabelText(/select-event-id/i)).getByRole('button')

      await act(async () => {
        user.click(eventButton)
      })
      const eventDropdownItem = await screen.findByRole('option', {name: /initial_login/i})
      user.click(eventDropdownItem)
      await waitForElementToBeRemoved(eventDropdownItem)

      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenLastCalledWith(
        {...studySession, delay: 'PT47H', startEventIds: ['timeline_retrieved']},
        true,
        false
      )
      expect(await within(formGroup).findByLabelText(/initial_login/i)).toBeInTheDocument()
    })
  })
})

test.skip('renders and changes reminder notification type', async () => {
  const {user} = setUp(studySession)
  const reminderNotification = screen
    .getByText(/Follow-up Notification/i)
    .parentElement?.closest('div.MuiPaper-root') as HTMLElement

  const radioButton = within(reminderNotification!).getByRole('radio', {
    name: /after start of window/i,
  })

  expect(radioButton.parentElement).not.toHaveClass('Mui-checked')

  await act(async () => {
    await user.click(radioButton)
  })

  // notification key includes notifyAt, so will remove old notification and mount new instance
  expect(reminderNotification).not.toBeInTheDocument()

  expect(onUpdateFn).toHaveBeenCalledWith(
    expect.objectContaining({
      // notifications: expect.anything(),
      notifications: expect.arrayContaining([
        expect.objectContaining({
          notifyAt: 'after_window_start',
          offset: 'PT15M',
        }),
      ]),
    }),
    undefined,
    undefined
  )

  const updatedNotification = screen
    .getByText(/Follow-up Notification/i)
    .parentElement?.closest('div.MuiPaper-root') as HTMLElement
  const updatedRadioButton = within(updatedNotification!).getByRole('radio', {
    name: /after start of window/i,
  })
  expect(updatedRadioButton.parentElement).toHaveClass('Mui-checked')
})

test('renders and changes reminder notification interval', async () => {
  const {user} = setUp(studySession)
  const reminderNotification = screen
    .getByText(/Follow-up Notification/i)
    .parentElement?.closest('div.MuiPaper-root') as HTMLElement
  const value = within(reminderNotification!).getByRole('spinbutton')

  await act(async () => {
    await user.clear(value)
    await user.type(value, '47')
  })

  const radioButton = within(reminderNotification!).getByRole('radio', {
    name: /window expires/i,
  })

  await act(async () => {
    await user.click(radioButton)
  })

  expect(onUpdateFn).toHaveBeenCalledWith(
    expect.objectContaining({
      notifications: expect.arrayContaining([
        expect.objectContaining({
          notifyAt: 'before_window_end',
          offset: 'PT47M',
        }),
      ]),
    }),
    undefined,
    undefined
  )
})
