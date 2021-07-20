// import {Button} from '@material-ui/core'
// import {render, screen} from '@testing-library/react'
// import {createMemoryHistory} from 'history'
import React from 'react'
// import {Router} from 'react-router-dom'
// import Scheduler from '../../../../components/studies/scheduler/Scheduler'
// import {Schedule, SessionSchedule} from '../../../../types/scheduling'
// import scheduleMock from '../../../mocks/schedule.json'

// const saveStudyScheduleMock = jest.fn()
// const onUpdateMock = jest.fn()
// //@ts-ignore
// const schedule: Schedule = scheduleMock

// const renderScheduler = (
//   overrides: Partial<Schedule>,
//   index = 0,
//   sessionOverride?: Partial<SessionSchedule>
// ) => {
//   let sessions
//   if (sessionOverride) {
//     sessions = schedule.sessions.map((s, i) =>
//       i !== index ? s : {...s, sessionOverride}
//     )
//   }
//   let sched = {...schedule, ...overrides}
//   if (sessions) {
//     sched.sessions = sessions
//   }
//   const history = createMemoryHistory()
//   const {container, debug, rerender} = render(
//     <Router history={history}>
//       <Scheduler
//         id="123"
//         schedule={sched}
//         token={'123'}
//         hasObjectChanged={false}
//         saveLoader={false}
//         onSave={() => saveStudyScheduleMock}
//         onUpdate={onUpdateMock}>
//         <Button>prev</Button> <Button>Next</Button>
//       </Scheduler>
//     </Router>
//   )

//   return {container, debug, rerender}
// }

test('placeholder', () => {})

// beforeEach(() => {
//   saveStudyScheduleMock.mockReset()
//   onUpdateMock.mockReset()
// })

// /* AG this functionality has been moved out of this control
// test('when there is no study duration or no start event id  - only show top section with continue button', async () => {
//   let { container, debug, rerender } = renderScheduler({
//     duration: undefined,
//     sessions: schedule.sessions.map(s => ({ ...s, startEventId: undefined })),
//   })

//   const continueButton = screen.getByRole('button', { name: /continue/i })
//   const sections1 = container.querySelectorAll('section')
//   expect(continueButton).toBeDefined()
//   expect(sections1.length).toBe(1)

//   const duration = screen.getByRole('spinbutton', { name: /duration/i })
//   const radio = screen.getByRole('radio', { name: /completion/i })
//   const cont = screen.getByRole('button', { name: /continue/i })
//   const unit = screen.getByLabelText(/unit/i, { exact: false })
//   const unitInput = unit.getElementsByClassName('MuiSelect-nativeInput').item(0)

//   fireEvent.change(unitInput!, { target: { value: 'D' } })
//   expect(cont).toBeDisabled()
//   userEvent.type(duration, '2')
//   userEvent.click(radio)
//   expect(cont).not.toBeDisabled()
//   userEvent.click(cont)
//   expect(onUpdateMock).toHaveBeenCalledWith(
//     expect.objectContaining({ duration: 'P2D' }),
//   )
// })
// */

// test('when there is initial data it should work', async () => {
//   const sched = {
//     ...schedule,
//     sessions: [schedule.sessions[0], schedule.sessions[0]],
//   }

//   let {container, debug, rerender} = renderScheduler({...sched})
//   const sections = container.querySelectorAll('section')
//   expect(sections.length).toBeGreaterThan(1)
//   expect(sched.sessions.length).toBe(2)
//   const saveBtn = screen.findAllByRole('button', {name: /save/i})
//   expect((await saveBtn).length).toBe(2)
// })
