import {act, cleanup, render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {DWsEnum} from '@typedefs/scheduling'
import {createWrapper} from '__test_utils/utils'
import Duration, {DurationProps} from './Duration'

afterEach(() => {
  cleanup()
})

const durationProps: DurationProps = {
  onChange: Function,
  durationString: '',
  unitData: DWsEnum,
  unitLabel: 'unit',
  numberLabel: 'value',
}

function setUp(durationProps: DurationProps) {
  const user = userEvent.setup()
  const component = render(<Duration {...durationProps} onChange={() => {}} />, {
    wrapper: createWrapper(),
  })
  const value = screen.getByRole('spinbutton')
  const unitButton = screen.getAllByRole('button')[0]
  return {component, user, value, unitButton}
}

describe('<Duration />', () => {
  test('should use maxDigits to restrict number of digits in value when maxDurationDays not set', async () => {
    const {user, value} = setUp({...durationProps, durationString: 'P20D'})

    expect(value).toHaveValue(20)

    await act(async () => {
      await user.clear(value)
      await user.type(value, '123')
    })
    expect(value).toHaveValue(123)

    await act(async () => {
      await user.type(value, '456')
    })
    expect(value).toHaveValue(123)

    await act(async () => {
      await user.clear(value)
      await user.type(value, '5678')
    })
    expect(value).toHaveValue(567)
  })

  test('should use maxDurationDays to restrict value entered in days', async () => {
    const {user, value, unitButton} = setUp({...durationProps, maxDurationDays: 1825})

    user.click(unitButton)
    const dropdown = await screen.findByRole('option', {name: /days/i})
    user.click(dropdown)
    await waitForElementToBeRemoved(dropdown)

    expect(value).toHaveValue(null)
    expect(unitButton).toHaveTextContent('days')

    await act(async () => {
      await user.type(value, '1825')
    })
    expect(value).toHaveValue(1825)
    expect(unitButton).toHaveTextContent('days')

    await act(async () => {
      await user.clear(value)
      await user.type(value, '1826')
    })
    expect(value).toHaveValue(182)
    expect(unitButton).toHaveTextContent('days')
  })

  test('should use maxDurationDays to restrict value entered in weeks', async () => {
    const {user, value, unitButton} = setUp({...durationProps, maxDurationDays: 1825})

    user.click(unitButton)
    const dropdown = await screen.findByRole('option', {name: /weeks/i})
    user.click(dropdown)
    await waitForElementToBeRemoved(dropdown)

    expect(value).toHaveValue(null)
    expect(unitButton).toHaveTextContent('weeks')

    await act(async () => {
      await user.type(value, '260')
    })
    expect(value).toHaveValue(260)
    expect(unitButton).toHaveTextContent('weeks')

    await act(async () => {
      await user.clear(value)
      await user.type(value, '261')
    })
    expect(value).toHaveValue(26)
    expect(unitButton).toHaveTextContent('weeks')
  })

  test('should use maxDigits to set input field width when inputWidth not set', async () => {
    setUp({...durationProps})

    const valueParent = screen.getByLabelText(/value/i)
    expect(valueParent).toHaveAttribute('width', '7')
  })

  test('should use inputWidth to set input field width', async () => {
    setUp({...durationProps, inputWidth: 50})

    const valueParent = screen.getByLabelText(/value/i)
    expect(valueParent).toHaveAttribute('width', '50')
  })
})
