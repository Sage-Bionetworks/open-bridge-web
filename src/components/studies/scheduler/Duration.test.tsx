import {cleanup, fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {DWsEnum} from '@typedefs/scheduling'
import {createWrapper} from '__test_utils/utils'
import Duration, {DurationProps} from './Duration'

const onChangeFn = jest.fn()

afterEach(() => {
  cleanup()
})

const durationProps: DurationProps = {
  onChange: Function,
  durationString: '',
  unitData: DWsEnum,
  unitLabel: 'unit',
  numberLabel: 'number',
}

function setUp(durationProps: DurationProps) {
  const user = userEvent.setup()
  const component = render(
    <Duration
      {...durationProps}
      onChange={e => {
        onChangeFn(e)
      }}
    />,
    {
      wrapper: createWrapper(),
    }
  )
  const value = screen.getByRole('spinbutton')
  const unitButton = screen.getAllByRole('button')[0]
  return {component, user, value, unitButton}
}

describe('<Duration />', () => {
  test('should use maxDigits to restrict number of digits in value when maxDurationDays not set', async () => {
    const {user, value} = setUp({...durationProps, durationString: 'P20D'})

    expect(value).toHaveValue(20)

    await user.clear(value)
    await user.type(value, '123')

    expect(value).toHaveValue(123)

    fireEvent.blur(value)
    expect(onChangeFn).toHaveBeenCalledTimes(1)
    expect(onChangeFn).toHaveBeenLastCalledWith({target: {value: 'P123D'}})

    await user.type(value, '456')

    expect(value).toHaveValue(123)

    fireEvent.blur(value)
    expect(onChangeFn).toHaveBeenCalledTimes(2)
    expect(onChangeFn).toHaveBeenLastCalledWith({target: {value: 'P123D'}})

    await user.clear(value)
    await user.type(value, '5678')
    expect(value).toHaveValue(567)

    fireEvent.blur(value)
    expect(onChangeFn).toHaveBeenCalledTimes(3)
    expect(onChangeFn).toHaveBeenLastCalledWith({target: {value: 'P567D'}})
  })

  test('should use maxDurationDays to restrict value entered in days', async () => {
    const {user, value, unitButton} = setUp({...durationProps, maxDurationDays: 1825})

    await user.click(unitButton)
    const dropdown = await screen.findByRole('option', {name: /days/i})
    await user.click(dropdown)
    await waitForElementToBeRemoved(dropdown)

    expect(onChangeFn).toHaveBeenLastCalledWith({target: {value: undefined}})

    expect(value).toHaveValue(null)
    expect(unitButton).toHaveTextContent('days')

    await user.type(value, '1825')

    expect(value).toHaveValue(1825)
    expect(unitButton).toHaveTextContent('days')

    fireEvent.blur(value)
    expect(onChangeFn).toHaveBeenLastCalledWith({target: {value: 'P1825D'}})

    await user.clear(value)
    await user.type(value, '1826')

    expect(value).toHaveValue(182)
    expect(unitButton).toHaveTextContent('days')

    fireEvent.blur(value)
    expect(onChangeFn).toHaveBeenLastCalledWith({target: {value: 'P182D'}})
  })

  test('should use maxDurationDays to restrict value entered in weeks', async () => {
    const {user, value, unitButton} = setUp({...durationProps, maxDurationDays: 1825})

    await user.click(unitButton)
    const dropdown = await screen.findByRole('option', {name: /weeks/i})
    await user.click(dropdown)
    await waitForElementToBeRemoved(dropdown)

    expect(value).toHaveValue(null)
    expect(unitButton).toHaveTextContent('weeks')

    fireEvent.blur(value)
    expect(onChangeFn).toHaveBeenLastCalledWith({target: {value: undefined}})

    await user.type(value, '260')

    expect(value).toHaveValue(260)
    expect(unitButton).toHaveTextContent('weeks')

    fireEvent.blur(value)
    expect(onChangeFn).toHaveBeenLastCalledWith({target: {value: 'P260W'}})

    await user.clear(value)
    await user.type(value, '261')

    expect(value).toHaveValue(26)
    expect(unitButton).toHaveTextContent('weeks')

    fireEvent.blur(value)
    expect(onChangeFn).toHaveBeenLastCalledWith({target: {value: 'P26W'}})
  })

  test('should not allow user to change unit into invalid state when maxDurationDays set', async () => {
    const {user, value, unitButton} = setUp({...durationProps, durationString: 'P1825D', maxDurationDays: 1825})

    expect(value).toHaveValue(1825)
    expect(unitButton).toHaveTextContent('days')

    await user.click(unitButton)
    const dropdown = await screen.findByRole('option', {name: /weeks/i})
    await user.click(dropdown)
    await waitForElementToBeRemoved(dropdown)

    expect(unitButton).toHaveTextContent('days')
    expect(onChangeFn).toHaveBeenCalledWith({target: {value: 'P1825D'}})
  })

  test('should not overwrite historic data with more digits than maxDigits', async () => {
    const {user, value, unitButton} = setUp({...durationProps, maxDigits: 1, durationString: 'P123456789D'})

    expect(value).toHaveValue(123456789)
    expect(unitButton).toHaveTextContent('days')

    fireEvent.blur(value)
    expect(onChangeFn).toHaveBeenCalledTimes(1)
    expect(onChangeFn).toHaveBeenCalledWith({target: {value: 'P123456789D'}})

    await user.click(unitButton)
    const dropdown = await screen.findByRole('option', {name: /weeks/i})
    await user.click(dropdown)
    await waitForElementToBeRemoved(dropdown)

    expect(value).toHaveValue(123456789)
    expect(unitButton).toHaveTextContent('days')

    fireEvent.blur(value)
    expect(onChangeFn).toHaveBeenCalledWith({target: {value: 'P123456789D'}})
  })

  test('should use maxDigits to set input field width when inputWidth not set', async () => {
    setUp({...durationProps})

    const valueParent = screen.getByLabelText(/number/i)
    expect(valueParent).toHaveAttribute('width', '7')
  })

  test('should use inputWidth to set input field width', async () => {
    setUp({...durationProps, inputWidth: 50})

    const valueParent = screen.getByLabelText(/number/i)
    expect(valueParent).toHaveAttribute('width', '50')
  })
})
