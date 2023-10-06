import {screen, waitFor, within} from '@testing-library/react'
import {FormatOptionsYear, YearQuestion} from '@typedefs/surveys'
import {renderSurveyQuestionComponent} from '__test_utils/utils'
import Year, {DEFAULT_MAX_YEAR, DEFAULT_MIN_YEAR, ErrorMessages} from './Year'

//render the component
const renderComponent = (step: YearQuestion) => {
  return renderSurveyQuestionComponent<YearQuestion>({step, Component: Year})
}

// render component and return controls
function setUp(step: YearQuestion) {
  const {user, element: component} = renderComponent(step)

  const minYearFormatGroup = screen.getByRole('radiogroup', {name: 'Minimum Year'})
  const minYear = {
    buttons: {
      ANY: within(minYearFormatGroup).getByRole('radio', {name: /allow anytime in the past/i}),
      CURRENT: within(minYearFormatGroup).getByRole('radio', {name: /current year/i}),
      SET: within(minYearFormatGroup).getByRole('radio', {name: /set min value/i}),
    },
    value: document.getElementById('minYearValue'),
  }

  const maxYearFormatGroup = screen.getByRole('radiogroup', {name: 'Maximum Year'})
  const maxYear = {
    buttons: {
      ANY: within(maxYearFormatGroup).getByRole('radio', {name: /allow anytime in the future/i}),
      CURRENT: within(maxYearFormatGroup).getByRole('radio', {name: /current year/i}),
      SET: within(maxYearFormatGroup).getByRole('radio', {name: /set max value/i}),
    },
    value: document.getElementById('maxYearValue'),
  }

  return {component, user, minYear, maxYear}
}

// default props
const step: YearQuestion = {
  type: 'simpleQuestion',
  identifier: 'simpleQ2',
  nextStepIdentifier: 'followupQ',
  title: 'Enter a birth year',
  inputItem: {
    type: 'year',
    fieldLabel: 'year of birth',
    placeholder: 'YYYY',
    formatOptions: {
      allowFuture: false,
      minimumYear: 1900,
    },
  },
}

function createStepProps(formatOptions: FormatOptionsYear) {
  return {...step, inputItem: {...step.inputItem, formatOptions: formatOptions}}
}

describe('Year', () => {
  test('correctly renders inputs for anytime in the past or future', async () => {
    const {minYear, maxYear} = setUp(createStepProps({allowPast: true, allowFuture: true}))

    expect(minYear.buttons.ANY).toBeChecked()
    expect(minYear.buttons.CURRENT).not.toBeChecked()
    expect(minYear.buttons.SET).not.toBeChecked()
    expect(minYear.value).toHaveValue(null)

    expect(maxYear.buttons.ANY).toBeChecked()
    expect(maxYear.buttons.CURRENT).not.toBeChecked()
    expect(maxYear.buttons.SET).not.toBeChecked()
    expect(maxYear.value).toHaveValue(null)
  })

  test('correctly renders inputs for only allowing current year', async () => {
    const {minYear, maxYear} = setUp(createStepProps({allowPast: false, allowFuture: false}))

    expect(minYear.buttons.ANY).not.toBeChecked()
    expect(minYear.buttons.CURRENT).toBeChecked()
    expect(minYear.buttons.SET).not.toBeChecked()
    expect(minYear.value).toHaveValue(null)

    expect(maxYear.buttons.ANY).not.toBeChecked()
    expect(maxYear.buttons.CURRENT).toBeChecked()
    expect(maxYear.buttons.SET).not.toBeChecked()
    expect(maxYear.value).toHaveValue(null)
  })

  test('correctly renders inputs for setting a time range', async () => {
    const {minYear, maxYear} = setUp(createStepProps({minimumYear: 2000, maximumYear: 2015}))

    expect(minYear.buttons.ANY).not.toBeChecked()
    expect(minYear.buttons.CURRENT).not.toBeChecked()
    expect(minYear.buttons.SET).toBeChecked()
    expect(minYear.value).toHaveValue(2000)

    expect(maxYear.buttons.ANY).not.toBeChecked()
    expect(maxYear.buttons.CURRENT).not.toBeChecked()
    expect(maxYear.buttons.SET).toBeChecked()
    expect(maxYear.value).toHaveValue(2015)
  })

  test('correctly updates minYear inputs', async () => {
    const {user, minYear} = setUp(createStepProps({allowFuture: true, allowPast: true}))

    expect(minYear.buttons.ANY).toBeChecked()
    expect(minYear.buttons.CURRENT).not.toBeChecked()
    expect(minYear.buttons.SET).not.toBeChecked()
    expect(minYear.value).toHaveValue(null)

    await waitFor(() => user.click(minYear.buttons.CURRENT))
    expect(minYear.buttons.ANY).not.toBeChecked()
    expect(minYear.buttons.CURRENT).toBeChecked()
    expect(minYear.buttons.SET).not.toBeChecked()
    expect(minYear.value).toHaveValue(null)

    await waitFor(() => user.click(minYear.buttons.SET))
    expect(minYear.buttons.ANY).not.toBeChecked()
    expect(minYear.buttons.CURRENT).not.toBeChecked()
    expect(minYear.buttons.SET).toBeChecked()
    expect(minYear.value).toHaveValue(DEFAULT_MIN_YEAR)

    await waitFor(() => user.click(minYear.buttons.ANY))
    expect(minYear.buttons.ANY).toBeChecked()
    expect(minYear.buttons.CURRENT).not.toBeChecked()
    expect(minYear.buttons.SET).not.toBeChecked()
    expect(minYear.value).toHaveValue(null)
  })

  test('correctly updates maxYear inputs', async () => {
    const {user, maxYear} = setUp(createStepProps({allowFuture: true, allowPast: true}))

    expect(maxYear.buttons.ANY).toBeChecked()
    expect(maxYear.buttons.CURRENT).not.toBeChecked()
    expect(maxYear.buttons.SET).not.toBeChecked()
    expect(maxYear.value).toHaveValue(null)

    await waitFor(() => user.click(maxYear.buttons.CURRENT))
    expect(maxYear.buttons.ANY).not.toBeChecked()
    expect(maxYear.buttons.CURRENT).toBeChecked()
    expect(maxYear.buttons.SET).not.toBeChecked()
    expect(maxYear.value).toHaveValue(null)

    await waitFor(() => user.click(maxYear.buttons.SET))
    expect(maxYear.buttons.ANY).not.toBeChecked()
    expect(maxYear.buttons.CURRENT).not.toBeChecked()
    expect(maxYear.buttons.SET).toBeChecked()
    expect(maxYear.value).toHaveValue(DEFAULT_MAX_YEAR)

    await waitFor(() => user.click(maxYear.buttons.ANY))
    expect(maxYear.buttons.ANY).toBeChecked()
    expect(maxYear.buttons.CURRENT).not.toBeChecked()
    expect(maxYear.buttons.SET).not.toBeChecked()
    expect(maxYear.value).toHaveValue(null)
  })

  test('correctly updates minimumYear value', async () => {
    const {user, minYear} = setUp(createStepProps({allowFuture: true, minimumYear: 2020}))
    expect(minYear.buttons.SET).toBeChecked()
    expect(minYear.value).toHaveValue(2020)

    await waitFor(async () => {
      await user.dblClick(minYear.value!)
      await user.keyboard('2014')
    })
    expect(minYear.value).toHaveValue(2014)
  })

  test('correctly updates maximumYear value', async () => {
    const {user, maxYear} = setUp(createStepProps({allowPast: true, maximumYear: 2015}))
    expect(maxYear.buttons.SET).toBeChecked()
    expect(maxYear.value).toHaveValue(2015)

    await waitFor(async () => {
      await user.dblClick(maxYear.value!)
      await user.keyboard('2039')
    })
    expect(maxYear.value).toHaveValue(2039)
  })

  test('error is shown when allowPast is false and maximumYear is less than current year', async () => {
    const currentYear = new Date().getFullYear()
    const errorYear = currentYear - 1

    const {user, maxYear} = setUp(createStepProps({allowPast: false, maximumYear: currentYear}))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await waitFor(async () => {
      await user.dblClick(maxYear.value!)
      await user.keyboard(errorYear.toString())
    })
    expect(maxYear.value).toHaveValue(errorYear)
    const alert = screen.queryByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(ErrorMessages['NO_PAST_YEARS'])
  })

  test('error is shown when allowFuture is false and minimumYear is greater than current year', async () => {
    const currentYear = new Date().getFullYear()
    const errorYear = currentYear + 1

    const {user, minYear} = setUp(createStepProps({allowFuture: false, minimumYear: currentYear}))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await waitFor(async () => {
      await user.dblClick(minYear.value!)
      await user.keyboard(errorYear.toString())
    })
    expect(minYear.value).toHaveValue(errorYear)
    const alert = screen.queryByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(ErrorMessages['NO_FUTURE_YEARS'])
  })

  test('error is shown when maximumYear is less than minimumYear', async () => {
    const year = 2023
    const errorYear = year - 1
    const {user, minYear, maxYear} = setUp(createStepProps({minimumYear: year, maximumYear: year}))

    expect(minYear.value).toHaveValue(year)
    expect(maxYear.value).toHaveValue(year)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await waitFor(async () => {
      await user.dblClick(maxYear.value!)
      await user.keyboard(errorYear.toString())
    })
    expect(maxYear.value).toHaveValue(errorYear)
    const alert = screen.queryByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(ErrorMessages['RANGE'])
  })

  test('error is shown when minimumYear is greater than maximumYear', async () => {
    const year = 2023
    const errorYear = year + 1
    const {user, minYear, maxYear} = setUp(createStepProps({minimumYear: year, maximumYear: year}))

    expect(minYear.value).toHaveValue(year)
    expect(maxYear.value).toHaveValue(year)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await waitFor(async () => {
      await user.dblClick(minYear.value!)
      await user.keyboard(errorYear.toString())
    })
    expect(minYear.value).toHaveValue(errorYear)
    const alert = screen.queryByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(ErrorMessages['RANGE'])
  })
})
