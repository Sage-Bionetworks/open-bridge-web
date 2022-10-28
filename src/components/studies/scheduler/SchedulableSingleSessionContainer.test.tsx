import {cleanup, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {StudySession} from '@typedefs/scheduling'
import React from 'react'
import {act} from 'react-dom/test-utils'
import {MemoryRouter} from 'react-router-dom'
import {ProvideTheme} from '__test_utils/utils'
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

const Wrapper: React.FunctionComponent<{_session: StudySession}> = ({
  _session,
}) => {
  const [session, setSession] = React.useState(_session)

  return (
    <ProvideTheme>
      <MemoryRouter>
        <SchedulableSingleSessionContainer
          onOpenEventsEditor={() => {}}
          key={'12345'}
          customEvents={[]}
          sessionErrorState={undefined}
          studySession={session}
          hasCriticalStartEvent={false}
          burstOriginEventId={undefined}
          onUpdateSessionSchedule={(
            ss: StudySession,
            shouldInvalidateBurst: boolean,
            shouldUpdaeStudyStartEvent: boolean
          ) => {
            onUpdateFn(ss, shouldInvalidateBurst, shouldUpdaeStudyStartEvent)
            setSession(ss)
          }}
        />
      </MemoryRouter>
    </ProvideTheme>
  )
}

function setUp(session: StudySession) {
  const user = userEvent.setup()
  const component = render(<Wrapper _session={session} />)
  return {component, user}
}

test('renders and changes reminder notification type', async () => {
  const {user} = setUp(studySession)
  const reminderNotification = screen.getByText(
    /Send a reminder notification/i
  ).parentElement
  const radioButton = within(reminderNotification!).getByRole('radio', {
    name: /after start of window/i,
  })
  expect(radioButton.parentElement).not.toHaveClass('Mui-checked')

  await act(async () => {
    await user.click(radioButton)
  })

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

  expect(radioButton.parentElement).toHaveClass('Mui-checked')
})

test('renders and changes reminder notification interval', async () => {
  const {user} = setUp(studySession)
  const reminderNotification = screen.getByText(
    /Send a reminder notification/i
  ).parentElement
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
