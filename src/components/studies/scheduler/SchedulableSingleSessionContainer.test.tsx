import {DEFAULT_NOTIFICATION} from '@services/schedule.service'
import {cleanup, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'
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
      offset: 'PT15M',
      allowSnooze: false,
      messages: [
        {
          lang: 'en',
          subject: 'initial',
          message: '1234',
        },
      ],
    },
    {
      notifyAt: 'before_window_end',
      offset: 'PT1H',
      allowSnooze: false,
      messages: [
        {
          lang: 'en',
          subject: 'reminder',
          message: '5678',
        },
      ],
    },
  ],
  studyBurstIds: [],
  labels: [],
  startEventIds: ['timeline_retrieved'],
}

const multidaySession = {
  ...studySession,
  timeWindows: [{...studySession.timeWindows[0], expiration: 'P3D'}],
  notifications: [DEFAULT_NOTIFICATION, DEFAULT_NOTIFICATION],
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

const thirtyCharString = '012345678901234567890123456789'
const fortyCharString = '0123456789012345678901234567890123456789'

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

  describe('end date', () => {
    test('should update end date - end at study end', async () => {
      const {user} = setUp({...studySession, occurrences: 5})

      const endDateSection = screen.getByRole('region', {name: /scheduling-form-section-end-date/i})
      const endAfterStudyRadioButton = within(endDateSection).getByRole('radio', {name: /end-after-study/i})
      const nOccurrencesRadioButton = within(endDateSection).getByRole('radio', {name: /end-after-n-occurrences/i})
      const repeatFrequencySection = screen.getByRole('region', {name: /scheduling-form-section-repeat-frequency/i})

      expect(endAfterStudyRadioButton.parentElement).not.toHaveClass('Mui-checked')
      expect(nOccurrencesRadioButton.parentElement).toHaveClass('Mui-checked')
      expect(repeatFrequencySection).toHaveTextContent(/for 5 times/i)

      await act(async () => {
        await user.click(endAfterStudyRadioButton)
      })
      expect(endAfterStudyRadioButton.parentElement).toHaveClass('Mui-checked')
      expect(nOccurrencesRadioButton.parentElement).not.toHaveClass('Mui-checked')
      expect(repeatFrequencySection).toHaveTextContent(/until the end of study/i)

      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenLastCalledWith(studySession, undefined, undefined)
    })

    test('should update end date - end after n occurrences', async () => {
      const {user} = setUp(studySession)

      const endDateSection = screen.getByRole('region', {name: /scheduling-form-section-end-date/i})
      const endAfterStudyRadioButton = within(endDateSection).getByRole('radio', {name: /end-after-study/i})
      const nOccurrencesRadioButton = within(endDateSection).getByRole('radio', {name: /end-after-n-occurrences/i})
      const nOccurrencesValue = within(endDateSection).getByRole('textbox', {name: /n-occurrences/i})
      const repeatFrequencySection = screen.getByRole('region', {name: /scheduling-form-section-repeat-frequency/i})

      expect(endAfterStudyRadioButton.parentElement).toHaveClass('Mui-checked')
      expect(nOccurrencesRadioButton.parentElement).not.toHaveClass('Mui-checked')
      expect(repeatFrequencySection).toHaveTextContent(/until the end of study/i)

      await act(async () => {
        await user.click(nOccurrencesRadioButton)
      })
      expect(endAfterStudyRadioButton.parentElement).not.toHaveClass('Mui-checked')
      expect(nOccurrencesRadioButton.parentElement).toHaveClass('Mui-checked')
      expect(repeatFrequencySection).toHaveTextContent(/until the end of study/i)

      await act(async () => {
        await user.clear(nOccurrencesValue)
        await user.type(nOccurrencesValue, '5')
      })
      expect(nOccurrencesValue).toHaveValue('5')
      expect(repeatFrequencySection).toHaveTextContent(/for 5 times/i)

      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenLastCalledWith({...studySession, occurrences: '5'}, undefined, undefined)
    })
  })

  describe('repeat frequency', () => {
    test('should update repeat frequency - duration', async () => {
      const {user} = setUp({...studySession, occurrences: 5})

      const repeatFrequencySection = screen.getByRole('region', {name: /scheduling-form-section-repeat-frequency/i})
      expect(repeatFrequencySection).toHaveTextContent(/for 5 times/i)

      const durationBox = within(repeatFrequencySection).getByLabelText('duration-box')
      const durationValue = within(durationBox).getByRole('spinbutton')

      expect(durationValue).toHaveValue(null)
      expect(durationBox).toHaveTextContent('days')

      await act(async () => {
        await user.clear(durationValue)
        await user.type(durationValue, '20')
        await user.keyboard('{Tab}') // to trigger onUpdateFn
      })

      expect(durationValue).toHaveValue(20)
      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenLastCalledWith(
        {...studySession, occurrences: 5, interval: 'P20D'},
        undefined,
        undefined
      )
    })

    test('should update repeat frequency - duration units', async () => {
      const {user} = setUp({...studySession, occurrences: 5, interval: 'P20D'})

      const repeatFrequencySection = screen.getByRole('region', {name: /scheduling-form-section-repeat-frequency/i})
      expect(repeatFrequencySection).toHaveTextContent(/for 5 times/i)

      const durationBox = within(repeatFrequencySection).getByLabelText('duration-box')
      const durationUnitsButton = within(within(durationBox).getByLabelText(/repeat every/i)).getByRole('button')
      expect(durationBox).toHaveTextContent('days')

      user.click(durationUnitsButton)
      const durationDropdownItem = await screen.findByRole('option', {name: /weeks/i})
      user.click(durationDropdownItem)
      await waitForElementToBeRemoved(durationDropdownItem)

      expect(durationBox).toHaveTextContent('weeks')
      expect(onUpdateFn).toHaveBeenLastCalledWith(
        {...studySession, occurrences: 5, interval: 'P20W'},
        undefined,
        undefined
      )
    })

    test('should clear repeat frequency after clicking clear button', async () => {
      const {user} = setUp({...studySession, occurrences: 5, interval: 'P20D'})

      const section = screen.getByRole('region', {name: /scheduling-form-section-repeat-frequency/i})
      const durationValue = within(section).getByRole('spinbutton')
      const clearButton = within(section).getByRole('button', {name: /clear-duration-value/i})

      expect(durationValue).toHaveValue(20)

      await act(async () => {
        await user.click(clearButton)
      })

      expect(durationValue).toHaveValue(null)
      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenCalledWith({...studySession, occurrences: 5}, undefined, undefined)
    })
  })

  describe('assessment window', () => {
    test('should update session window - start time', async () => {
      const {user} = setUp(studySession)

      const section = screen.getByRole('region', {name: /scheduling-form-section-session-window/i})
      const sessionWindow = within(section).getByLabelText(/session-window-2/i)
      const startTimeContainer = within(sessionWindow).getByLabelText(/start-time/i)

      const startTimeButton = within(startTimeContainer).getByRole('button')
      expect(startTimeButton).toHaveTextContent('10:15 AM')

      user.click(startTimeButton)
      const dropdownTime = await screen.findByRole('option', {name: /5:30 pm/i})
      user.click(dropdownTime)
      await waitForElementToBeRemoved(dropdownTime)

      expect(sessionWindow).not.toBeInTheDocument()
      const sessionWindowUpdated = within(section).getByLabelText(/session-window-2/i)
      expect(sessionWindowUpdated).toHaveTextContent(/5:30 pm/i)

      const updatedTimeWindow = {
        ...studySession.timeWindows[1],
        startTime: '17:30',
      }
      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenCalledWith(
        {...studySession, timeWindows: [studySession.timeWindows[0], updatedTimeWindow]},
        undefined,
        undefined
      )
    })

    test('should update session window - expiration duration', async () => {
      const {user} = setUp(studySession)

      const section = screen.getByRole('region', {name: /scheduling-form-section-session-window/i})
      const sessionWindow = within(section).getByLabelText(/session-window-2/i)
      const durationBox = within(sessionWindow).getByLabelText('duration-box')
      const durationValue = within(durationBox).getByRole('spinbutton')

      expect(durationValue).toHaveValue(2)
      expect(durationBox).toHaveTextContent('hours')

      await act(async () => {
        await user.clear(durationValue)
        await user.type(durationValue, '18')
        await user.keyboard('{Tab}') // to trigger onUpdateFn
      })

      const updatedTimeWindow = {
        ...studySession.timeWindows[1],
        expiration: 'PT18H',
      }

      expect(durationValue).toHaveValue(18)
      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenLastCalledWith(
        {...studySession, timeWindows: [studySession.timeWindows[0], updatedTimeWindow]},
        undefined,
        undefined
      )
    })

    test('should update session window - expiration duration units', async () => {
      const {user} = setUp(studySession)

      const section = screen.getByRole('region', {name: /scheduling-form-section-session-window/i})
      const sessionWindow = within(section).getByLabelText(/session-window-2/i)
      const durationBox = within(sessionWindow).getByLabelText('duration-box')
      const durationUnitsButton = within(within(durationBox).getByLabelText(/expire after/i)).getByRole('button')
      expect(durationBox).toHaveTextContent('hours')

      user.click(durationUnitsButton)
      const durationDropdownItem = await screen.findByRole('option', {name: /days/i})
      user.click(durationDropdownItem)
      await waitForElementToBeRemoved(durationDropdownItem)
      expect(durationBox).toHaveTextContent('days')

      const updatedTimeWindow = {
        ...studySession.timeWindows[1],
        expiration: 'P2D',
      }

      expect(onUpdateFn).toHaveBeenLastCalledWith(
        {...studySession, timeWindows: [studySession.timeWindows[0], updatedTimeWindow]},
        undefined,
        undefined
      )
    })

    test('should clear expiration duration after clicking clear button', async () => {
      const {user} = setUp(studySession)

      const section = screen.getByRole('region', {name: /scheduling-form-section-session-window/i})
      const sessionWindow = within(section).getByLabelText(/session-window-2/i)
      const durationValue = within(sessionWindow).getByRole('spinbutton')
      const clearButton = within(sessionWindow).getByRole('button', {name: /clear-duration-value/i})

      expect(durationValue).toHaveValue(2)

      await act(async () => {
        await user.click(clearButton)
      })

      expect(durationValue).not.toBeInTheDocument()
      const durationValueUpdated = within(within(section).getByLabelText(/session-window-2/i)).getByRole('spinbutton')
      expect(durationValueUpdated).toHaveValue(null)

      const updatedTimeWindow = {
        ...studySession.timeWindows[1],
        expiration: undefined,
      }

      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenCalledWith(
        {...studySession, timeWindows: [studySession.timeWindows[0], updatedTimeWindow]},
        undefined,
        undefined
      )
    })

    test('should remove session window', async () => {
      const {user} = setUp(studySession)

      const section = screen.getByRole('region', {name: /scheduling-form-section-session-window/i})
      const sessionWindow = within(section).getByLabelText(/session-window-1/i)
      expect(within(section).getByLabelText(/session-window-2/i)).toBeInTheDocument()

      const deleteButton = within(sessionWindow).getByRole('button', {name: /delete-button/i})
      await act(async () => {
        await user.click(deleteButton)
      })
      expect(sessionWindow).not.toBeInTheDocument()

      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenCalledWith(
        {...studySession, timeWindows: studySession.timeWindows.slice(1)},
        undefined,
        undefined
      )

      const remainingSessionWindow = within(section).getByLabelText(/session.window-1/i)
      const durationBox = within(remainingSessionWindow).getByLabelText('duration-box')
      const durationValue = within(durationBox).getByRole('spinbutton')

      expect(durationValue).toHaveValue(2)
      expect(durationBox).toHaveTextContent('hours')
      expect(remainingSessionWindow).toHaveTextContent(/10:15 am/i)
    })

    test('should add session window', async () => {
      // create a deep copy of studySession
      // ...since addNewWindow mutates the original session
      const copyStudySession = {
        ...studySession,
        timeWindows: [...studySession.timeWindows],
      }
      const {user} = setUp(copyStudySession)

      const section = screen.getByRole('region', {name: /scheduling-form-section-session-window/i})

      const addButton = within(section).getByRole('button', {name: /add-assessment-window-button/i})
      user.click(addButton)
      await within(section).findByLabelText(/session-window-3/i)

      expect(onUpdateFn).toHaveBeenCalledTimes(1)
      expect(onUpdateFn).toHaveBeenCalledWith(
        {...studySession, timeWindows: [...studySession.timeWindows, {startTime: '08:00'}]},
        undefined,
        undefined
      )
    })

    test('should disable ability to add new session if window longer than 24 hours', async () => {
      const longTimeWindow = {
        guid: '0QvoUQCbczCYo27Sy84YbBxX',
        startTime: '08:00',
        expiration: 'P3D',
        persistent: false,
        type: 'TimeWindow',
      }
      const {user} = setUp({...studySession, timeWindows: [longTimeWindow]})

      const section = screen.getByRole('region', {name: /scheduling-form-section-session-window/i})

      const addButton = within(section).getByRole('button', {name: /add-assessment-window-button/i})
      expect(addButton).toBeDisabled()
    })
  })

  describe('session notifications', () => {
    const getNotification = (type: string) => {
      const search = type === 'initial' ? /initial notification/i : /follow-up notification/i
      return screen.getByText(search).parentElement?.closest('div.MuiPaper-root') as HTMLElement
    }

    describe('toggle notifications', () => {
      test('should turn session notifications off', async () => {
        // start with one notification, so we can demonstrate that addButton is removed
        const {user} = setUp({...studySession, notifications: [studySession.notifications![0]]})

        const section = screen.getByRole('region', {name: /scheduling-form-section-session-notifications/i})
        const checkbox = within(section).getByRole('checkbox')
        const addButton = within(section).getByRole('button', {name: /add a reminder notification/i})
        const notification = within(section).getByText(/initial notification/i)

        expect(checkbox.parentElement).toHaveClass('Mui-checked')
        expect(section).toHaveTextContent(/on/i)

        user.click(checkbox)
        await waitFor(async () => {
          expect(checkbox.parentElement).not.toHaveClass('Mui-checked')
          expect(section).toHaveTextContent(/off/i)
          expect(addButton).not.toBeInTheDocument()
          expect(notification).not.toBeInTheDocument()
        })

        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith({...studySession, notifications: []}, undefined, undefined)
      })

      test('should turn session notifications on', async () => {
        const {user} = setUp({...studySession, notifications: []})

        const section = screen.getByRole('region', {name: /scheduling-form-section-session-notifications/i})
        const checkbox = within(section).getByRole('checkbox')

        expect(checkbox.parentElement).not.toHaveClass('Mui-checked')
        expect(section).toHaveTextContent(/off/i)

        user.click(checkbox)
        await waitFor(async () => {
          expect(checkbox.parentElement).toHaveClass('Mui-checked')
          expect(section).toHaveTextContent(/on/i)
          expect(within(section).getByRole('button', {name: /add a reminder notification/i})).toBeInTheDocument()
          expect(within(section).getByText(/initial notification/i)).toBeInTheDocument()
        })

        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {...studySession, notifications: [DEFAULT_NOTIFICATION]},
          undefined,
          undefined
        )
      })
    })

    describe('add and remove notifications', () => {
      test('should add reminder notification', async () => {
        const {user} = setUp({...studySession, notifications: [studySession.notifications![0]]})

        const section = screen.getByRole('region', {name: /scheduling-form-section-session-notifications/i})
        const addButton = within(section).getByRole('button', {name: /add a reminder notification/i})

        expect(within(section).getByText(/initial notification/i)).toBeInTheDocument()
        expect(within(section).queryByText(/follow-up notification/i)).not.toBeInTheDocument()

        user.click(addButton)
        await waitForElementToBeRemoved(addButton)

        expect(within(section).getByText(/initial notification/i)).toBeInTheDocument()
        expect(within(section).getByText(/follow-up notification/i)).toBeInTheDocument()

        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {...studySession, notifications: [studySession.notifications![0], DEFAULT_NOTIFICATION]},
          undefined,
          undefined
        )
      })

      test('should remove the only notification with the delete button', async () => {
        const {user} = setUp({...studySession, notifications: [studySession.notifications![0]]})

        const section = screen.getByRole('region', {name: /scheduling-form-section-session-notifications/i})
        const checkbox = within(section).getByRole('checkbox')
        const addButton = within(section).getByRole('button', {name: /add a reminder notification/i})
        const notification = getNotification('initial')
        const deleteButton = within(notification).getByRole('button', {name: /delete-button/i})

        expect(checkbox.parentElement).toHaveClass('Mui-checked')
        expect(section).toHaveTextContent(/on/i)

        user.click(deleteButton)
        await waitFor(async () => {
          expect(notification).not.toBeInTheDocument()
          expect(addButton).not.toBeInTheDocument()
          expect(checkbox.parentElement).not.toHaveClass('Mui-checked')
          expect(section).toHaveTextContent(/off/i)
        })

        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith({...studySession, notifications: []}, undefined, undefined)
      })

      test('should not be able to delete the first notification when two notifications exist', async () => {
        setUp(studySession)

        const firstNotification = getNotification('initial')
        const secondNotification = getNotification('reminder')

        expect(within(firstNotification).queryByRole('button', {name: /delete-button/i})).not.toBeInTheDocument()
        expect(within(secondNotification).getByRole('button', {name: /delete-button/i})).toBeInTheDocument()
      })

      test('should remove the second notification with the delete button', async () => {
        const {user} = setUp(studySession)

        const section = screen.getByRole('region', {name: /scheduling-form-section-session-notifications/i})
        const firstNotification = getNotification('initial')
        const secondNotification = getNotification('reminder')
        const deleteButton = within(secondNotification).getByRole('button', {name: /delete-button/i})

        const subject = within(firstNotification).getByRole('textbox', {name: /subject line/i})
        const body = within(firstNotification).getByRole('textbox', {name: /body text/i})
        const value = within(firstNotification).getByRole('spinbutton')

        expect(subject).toHaveValue('initial')
        expect(body).toHaveValue('1234')
        expect(value).toHaveValue(15)
        expect(within(firstNotification).getByRole('button', {name: /minutes/i})).toBeInTheDocument()
        expect(within(section).queryByText(/add a reminder notification/i)).not.toBeInTheDocument()

        await act(async () => {
          user.click(deleteButton)
        })
        await waitForElementToBeRemoved(secondNotification)

        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {...studySession, notifications: [{...studySession.notifications![0]}]},
          undefined,
          undefined
        )

        expect(firstNotification).toBeInTheDocument()
        expect(subject).toHaveValue('initial')
        expect(body).toHaveValue('1234')
        expect(value).toHaveValue(15)
        expect(within(firstNotification).getByRole('button', {name: /minutes/i})).toBeInTheDocument()
        expect(within(section).getByRole('button', {name: /add a reminder notification/i})).toBeInTheDocument()
      })
    })

    describe('initial notification', () => {
      test('should allow subject line <= 30 chararcters', async () => {
        const {user} = setUp(studySession)

        const notification = getNotification('initial')
        const subject = within(notification).getByRole('textbox', {name: /subject line/i})

        expect(subject).toHaveValue('initial')

        await act(async () => {
          await user.clear(subject)
          await user.type(subject, thirtyCharString)
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })
        expect(notification).not.toBeInTheDocument()

        const newMessage = {...studySession.notifications![0].messages[0], subject: thirtyCharString}
        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {
            ...studySession,
            notifications: [
              {...studySession.notifications![0], messages: [newMessage]},
              studySession.notifications![1],
            ],
          },
          undefined,
          undefined
        )

        const updatedNotification = getNotification('initial')
        const updatedSubject = within(updatedNotification).getByRole('textbox', {name: /subject line/i})

        expect(updatedSubject).toHaveValue(thirtyCharString)
      })

      test('should not allow subject line > 30 characters', async () => {
        const {user} = setUp(studySession)

        const notification = getNotification('initial')
        const subject = within(notification).getByRole('textbox', {name: /subject line/i})

        expect(subject).toHaveValue('initial')

        await act(async () => {
          await user.clear(subject)
          await user.type(subject, thirtyCharString + 'extra_chars')
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })
        expect(notification).not.toBeInTheDocument()

        const newMessage = {...studySession.notifications![0].messages[0], subject: thirtyCharString}
        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {
            ...studySession,
            notifications: [
              {...studySession.notifications![0], messages: [newMessage]},
              studySession.notifications![1],
            ],
          },
          undefined,
          undefined
        )

        const updatedNotification = getNotification('initial')
        const updatedSubject = within(updatedNotification).getByRole('textbox', {name: /subject line/i})

        expect(updatedSubject).toHaveValue(thirtyCharString)
      })

      test('should allow body text <= 40 chararcters', async () => {
        const {user} = setUp(studySession)

        const notification = getNotification('initial')
        const body = within(notification).getByRole('textbox', {name: /body text/i})

        expect(body).toHaveValue('1234')

        await act(async () => {
          await user.clear(body)
          await user.type(body, fortyCharString)
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })
        expect(notification).not.toBeInTheDocument()

        const newMessage = {...studySession.notifications![0].messages[0], message: fortyCharString}
        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {
            ...studySession,
            notifications: [
              {...studySession.notifications![0], messages: [newMessage]},
              studySession.notifications![1],
            ],
          },
          undefined,
          undefined
        )

        const updatedNotification = getNotification('initial')
        const updatedBody = within(updatedNotification).getByRole('textbox', {name: /body text/i})

        expect(updatedBody).toHaveValue(fortyCharString)
      })

      test('should not allow body text > 40 chararcters', async () => {
        const {user} = setUp(studySession)

        const notification = getNotification('initial')
        const body = within(notification).getByRole('textbox', {name: /body text/i})

        expect(body).toHaveValue('1234')

        await act(async () => {
          await user.clear(body)
          await user.type(body, fortyCharString + '_extra_char')
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })
        expect(notification).not.toBeInTheDocument()

        const newMessage = {...studySession.notifications![0].messages[0], message: fortyCharString}
        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {
            ...studySession,
            notifications: [
              {...studySession.notifications![0], messages: [newMessage]},
              studySession.notifications![1],
            ],
          },
          undefined,
          undefined
        )

        const updatedNotification = getNotification('initial')
        const updatedBody = within(updatedNotification).getByRole('textbox', {name: /body text/i})

        expect(updatedBody).toHaveValue(fortyCharString)
      })

      test('should update initial notification - notification is offset from start of window', async () => {
        const {user} = setUp({...studySession, notifications: [DEFAULT_NOTIFICATION]})

        const notification = getNotification('initial')
        const radioButton = within(notification!).getByRole('radio', {
          name: /after start of window/i,
        })
        const value = within(notification!).getByRole('spinbutton')

        expect(radioButton.parentElement).not.toHaveClass('Mui-checked')

        await act(async () => {
          await user.click(radioButton)
          await user.type(value, '30')
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })

        // notification key includes notifyAt, so will remove old notification and mount new instance
        expect(notification).not.toBeInTheDocument()

        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {
            ...studySession,
            notifications: [{...DEFAULT_NOTIFICATION, offset: 'PT30M'}],
          },
          undefined,
          undefined
        )

        const updatedNotification = getNotification('initial')
        const updatedRadioButton = within(updatedNotification!).getByRole('radio', {
          name: /after start of window/i,
        })
        expect(updatedRadioButton.parentElement).toHaveClass('Mui-checked')
      })

      test('should update initial notification - notification is at start of window', async () => {
        const {user} = setUp({...studySession, notifications: [{...DEFAULT_NOTIFICATION, offset: 'PT30M'}]})

        const notification = getNotification('initial')
        const radioButton = within(notification!).getByRole('radio', {
          name: /at start of window/i,
        })

        expect(radioButton.parentElement).not.toHaveClass('Mui-checked')

        await act(async () => {
          await user.click(radioButton)
        })

        // notification key includes notifyAt, so will remove old notification and mount new instance
        expect(notification).not.toBeInTheDocument()

        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {
            ...studySession,
            notifications: [DEFAULT_NOTIFICATION],
          },
          undefined,
          undefined
        )

        const updatedNotification = getNotification('initial')
        const updatedRadioButton = within(updatedNotification!).getByRole('radio', {
          name: /at start of window/i,
        })
        expect(updatedRadioButton.parentElement).toHaveClass('Mui-checked')
      })
    })

    describe('reminder notification', () => {
      test('should allow subject line <= 30 chararcters', async () => {
        const {user} = setUp(studySession)

        const notification = getNotification('reminder')
        const subject = within(notification).getByRole('textbox', {name: /subject line/i})

        expect(subject).toHaveValue('reminder')

        await act(async () => {
          await user.clear(subject)
          await user.type(subject, thirtyCharString)
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })
        expect(notification).not.toBeInTheDocument()

        const newMessage = {...studySession.notifications![1].messages[0], subject: thirtyCharString}
        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {
            ...studySession,
            notifications: [
              studySession.notifications![0],
              {...studySession.notifications![1], messages: [newMessage]},
            ],
          },
          undefined,
          undefined
        )

        const updatedNotification = getNotification('reminder')
        const updatedSubject = within(updatedNotification).getByRole('textbox', {name: /subject line/i})

        expect(updatedSubject).toHaveValue(thirtyCharString)
      })

      test('should not allow subject line > 30 characters', async () => {
        const {user} = setUp(studySession)

        const notification = getNotification('reminder')
        const subject = within(notification).getByRole('textbox', {name: /subject line/i})

        expect(subject).toHaveValue('reminder')

        await act(async () => {
          await user.clear(subject)
          await user.type(subject, thirtyCharString + 'extra_chars')
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })
        expect(notification).not.toBeInTheDocument()

        const newMessage = {...studySession.notifications![1].messages[0], subject: thirtyCharString}
        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {
            ...studySession,
            notifications: [
              studySession.notifications![0],
              {...studySession.notifications![1], messages: [newMessage]},
            ],
          },
          undefined,
          undefined
        )

        const updatedNotification = getNotification('reminder')
        const updatedSubject = within(updatedNotification).getByRole('textbox', {name: /subject line/i})

        expect(updatedSubject).toHaveValue(thirtyCharString)
      })

      test('should allow body text <= 40 chararcters', async () => {
        const {user} = setUp(studySession)

        const notification = getNotification('reminder')
        const body = within(notification).getByRole('textbox', {name: /body text/i})

        expect(body).toHaveValue('5678')

        await act(async () => {
          await user.clear(body)
          await user.type(body, fortyCharString)
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })
        expect(notification).not.toBeInTheDocument()

        const newMessage = {...studySession.notifications![1].messages[0], message: fortyCharString}
        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {
            ...studySession,
            notifications: [
              studySession.notifications![0],
              {...studySession.notifications![1], messages: [newMessage]},
            ],
          },
          undefined,
          undefined
        )

        const updatedNotification = getNotification('reminder')
        const updatedBody = within(updatedNotification).getByRole('textbox', {name: /body text/i})

        expect(updatedBody).toHaveValue(fortyCharString)
      })

      test('should not allow body text > 40 chararcters', async () => {
        const {user} = setUp(studySession)

        const notification = getNotification('reminder')
        const body = within(notification).getByRole('textbox', {name: /body text/i})

        expect(body).toHaveValue('5678')

        await act(async () => {
          await user.clear(body)
          await user.type(body, fortyCharString + '_extra_char')
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })
        expect(notification).not.toBeInTheDocument()

        const newMessage = {...studySession.notifications![1].messages[0], message: fortyCharString}
        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenCalledWith(
          {
            ...studySession,
            notifications: [
              studySession.notifications![0],
              {...studySession.notifications![1], messages: [newMessage]},
            ],
          },
          undefined,
          undefined
        )

        const updatedNotification = getNotification('reminder')
        const updatedBody = within(updatedNotification).getByRole('textbox', {name: /body text/i})

        expect(updatedBody).toHaveValue(fortyCharString)
      })

      test('should update offset days for reminder notification in multiday session', async () => {
        const {user} = setUp({...multidaySession})

        const reminderNotification = getNotification('reminder')
        const freqValue = within(reminderNotification).getByRole('spinbutton')
        const repeatCheckbox = within(reminderNotification).getByRole('checkbox')

        expect(freqValue).toHaveValue(null)
        expect(repeatCheckbox).not.toHaveProperty('checked', true)
        expect(within(reminderNotification).getByRole('button', {name: /8:00 am/i})).toBeInTheDocument()

        // change freq value
        await act(async () => {
          await user.type(freqValue, '5')
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })
        expect(reminderNotification).not.toBeInTheDocument()

        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenLastCalledWith(
          {...multidaySession, notifications: [DEFAULT_NOTIFICATION, {...DEFAULT_NOTIFICATION, offset: 'P5D'}]},
          undefined,
          undefined
        )

        const updatedNotification = getNotification('reminder')
        expect(within(updatedNotification).getByRole('spinbutton')).toHaveValue(5)
      })

      test('should update offset time for reminder notification in multiday session', async () => {
        const {user} = setUp({
          ...multidaySession,
          notifications: [DEFAULT_NOTIFICATION, {...DEFAULT_NOTIFICATION, offset: 'P5D'}],
        })

        const reminderNotification = getNotification('reminder')
        const timeButton = within(reminderNotification).getByRole('button', {name: /8:00 am/i})
        expect(within(reminderNotification).getByRole('spinbutton')).toHaveValue(5)

        user.click(timeButton)
        const dropdownTime = await screen.findByRole('option', {name: /3:15 pm/i})
        await act(async () => {
          await user.click(dropdownTime)
        })
        expect(dropdownTime).not.toBeInTheDocument()

        expect(reminderNotification).not.toBeInTheDocument()
        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenLastCalledWith(
          {...multidaySession, notifications: [DEFAULT_NOTIFICATION, {...DEFAULT_NOTIFICATION, offset: 'P5DT7H15M'}]},
          undefined,
          undefined
        )

        const updatedNotification = getNotification('reminder')
        expect(within(updatedNotification).getByRole('spinbutton')).toHaveValue(5)
        expect(within(updatedNotification).getByRole('button', {name: /3:15 pm/i})).toBeInTheDocument()
      })

      test('should allow repeat reminder notification in multiday session', async () => {
        const {user} = setUp({...multidaySession, notifications: [DEFAULT_NOTIFICATION, DEFAULT_NOTIFICATION]})

        const reminderNotification = getNotification('reminder')
        const repeatCheckbox = within(reminderNotification).getByRole('checkbox')

        expect(repeatCheckbox).not.toHaveProperty('checked', true)

        user.click(repeatCheckbox)

        const intervalBox = await within(reminderNotification).findByLabelText('duration-box')
        const intervalValue = within(intervalBox).getByRole('spinbutton')
        const intervalUnits = within(within(intervalBox).getByLabelText(/repeat every/i)).getByRole('button')

        expect(repeatCheckbox).toHaveProperty('checked', true)
        expect(intervalValue).toHaveValue(null)

        await act(async () => {
          await user.clear(intervalValue)
          await user.type(intervalValue, '4')
          await user.keyboard('{TAB}') // to trigger onUpdateFn
        })

        expect(intervalValue).toHaveValue(4)
        expect(intervalUnits).toHaveTextContent('minutes')

        expect(onUpdateFn).toHaveBeenCalledTimes(1)
        expect(onUpdateFn).toHaveBeenLastCalledWith(
          {
            ...multidaySession,
            notifications: [DEFAULT_NOTIFICATION, {...DEFAULT_NOTIFICATION, interval: 'PT4M'}],
          },
          undefined,
          undefined
        )
      })

      test('should update repeat interval units of reminder notification in multiday session', async () => {
        const {user} = setUp({
          ...multidaySession,
          notifications: [DEFAULT_NOTIFICATION, {...DEFAULT_NOTIFICATION, interval: 'PT3M'}],
        })

        const reminderNotification = getNotification('reminder')
        expect(within(reminderNotification).getByRole('checkbox')).toHaveProperty('checked', true)

        const intervalBox = await within(reminderNotification).findByLabelText('duration-box')
        const intervalValue = within(intervalBox).getByRole('spinbutton')
        const intervalUnits = within(within(intervalBox).getByLabelText(/repeat every/i)).getByRole('button')

        expect(intervalValue).toHaveValue(3)
        expect(intervalUnits).toHaveTextContent('minutes')

        user.click(intervalUnits)
        const dropdownUnits = await screen.findByRole('option', {name: /hours/i})
        user.click(dropdownUnits)
        await waitForElementToBeRemoved(dropdownUnits)

        expect(intervalValue).toHaveValue(3)
        expect(intervalUnits).toHaveTextContent('hours')

        expect(onUpdateFn).toHaveBeenLastCalledWith(
          {
            ...multidaySession,
            notifications: [DEFAULT_NOTIFICATION, {...DEFAULT_NOTIFICATION, interval: 'PT3H'}],
          },
          undefined,
          undefined
        )
      })

      test('should update multiday offset when session window start time is updated', async () => {
        const {user} = setUp({
          ...multidaySession,
          notifications: [DEFAULT_NOTIFICATION, {...DEFAULT_NOTIFICATION, offset: 'P5DT7H'}],
        })

        const sessionWindow = screen.getByLabelText(/session-window-1/i)
        const windowStartTimeButton = within(within(sessionWindow).getByLabelText(/start-time/i)).getByRole('button')
        expect(windowStartTimeButton).toHaveTextContent('8:00 AM')

        const reminderNotification = getNotification('reminder')
        expect(within(reminderNotification).getByRole('spinbutton')).toHaveValue(5)
        expect(within(reminderNotification).getByRole('button', {name: /3:00 pm/i})).toBeInTheDocument()

        user.click(windowStartTimeButton)
        const dropdownTime = await screen.findByRole('option', {name: /9:30 am/i})
        await act(async () => {
          await user.click(dropdownTime)
        })
        expect(dropdownTime).not.toBeInTheDocument()
        expect(reminderNotification).not.toBeInTheDocument()

        expect(sessionWindow).not.toBeInTheDocument()
        const updatedSessionWindow = screen.getByLabelText(/session-window-1/i)
        const updatedWindowStartTimeButton = within(
          within(updatedSessionWindow).getByLabelText(/start-time/i)
        ).getByRole('button')
        expect(updatedWindowStartTimeButton).toHaveTextContent('9:30 AM')

        const updatedReminderNotification = getNotification('reminder')
        expect(within(updatedReminderNotification).getByRole('spinbutton')).toHaveValue(5)
        expect(within(updatedReminderNotification).getByRole('button', {name: /3:00 pm/i})).toBeInTheDocument()

        expect(onUpdateFn).toHaveBeenCalledTimes(2) // first - update session window, second - update offset
        expect(onUpdateFn).toHaveBeenLastCalledWith(
          {
            ...multidaySession,
            timeWindows: [{...multidaySession.timeWindows[0], startTime: '09:30'}],
            notifications: [DEFAULT_NOTIFICATION, {...DEFAULT_NOTIFICATION, offset: 'P5DT5H30M'}],
          },
          undefined,
          undefined
        )
      })

      test('renders and changes reminder notification type', async () => {
        const {user} = setUp(studySession)
        const reminderNotification = getNotification('reminder')

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

        const updatedNotification = getNotification('reminder')
        const updatedRadioButton = within(updatedNotification!).getByRole('radio', {
          name: /after start of window/i,
        })
        expect(updatedRadioButton.parentElement).toHaveClass('Mui-checked')
      })

      test('renders and changes reminder notification interval', async () => {
        const {user} = setUp(studySession)
        const reminderNotification = getNotification('reminder')
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
                offset: 'PT47H',
              }),
            ]),
          }),
          undefined,
          undefined
        )
      })
    })
  })
})
