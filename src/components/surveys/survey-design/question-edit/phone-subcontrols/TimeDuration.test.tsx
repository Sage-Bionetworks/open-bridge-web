import {render, screen} from '@testing-library/react'
import {ProvideTheme} from '__test_utils/utils'
import TimeDuration from './TimeDuration'

//render the component
export const renderComponent = (type: 'DURATION' | 'TIME') => {
  const element = render(
    <ProvideTheme>
      <TimeDuration type={type} />
    </ProvideTheme>
  )
  return element
}

//test the  'duration' component renders
test("renders the 'duration' component correctly", () => {
  renderComponent('DURATION')
  expect(screen.getByText('Hours')).toBeInTheDocument()
  expect(screen.getByText('Mins')).toBeInTheDocument()
  expect(screen.queryByText('PM')).not.toBeInTheDocument()
})

//test that the 'time' component renders
test("renders the 'time' component correctly", async () => {
  renderComponent('DURATION')
  expect(screen.getByText('Hours')).toBeInTheDocument()
  expect(screen.getByText('Mins')).toBeInTheDocument()
  expect(screen.queryByText('PM')).not.toBeInTheDocument()
})
