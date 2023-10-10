import AlertWithTextWrapper from '@components/widgets/AlertWithTextWrapper'
import {Box} from '@mui/material'
import {YearQuestion} from '@typedefs/surveys'
import React from 'react'
import YearRadioGroup from './YearRadioGroup'

export const ErrorMessages = {
  RANGE: 'Max value must be greater than min value',
  NO_PAST_YEARS: 'No past years allowed',
  NO_FUTURE_YEARS: 'No future years allowed',
}

const Year: React.FunctionComponent<{
  step: YearQuestion
  onChange: (step: YearQuestion) => void
}> = ({step: initialStep, onChange: onValidChange}) => {
  const [minimumYear, setMinimumYear] = React.useState<number | undefined>(
    initialStep.inputItem.formatOptions?.minimumYear
  )
  const [maximumYear, setMaximumYear] = React.useState<number | undefined>(
    initialStep.inputItem.formatOptions?.maximumYear
  )
  const [allowFuture, setAllowFuture] = React.useState<boolean | undefined>(
    initialStep.inputItem.formatOptions?.allowFuture
  )
  const [allowPast, setAllowPast] = React.useState<boolean | undefined>(initialStep.inputItem.formatOptions?.allowPast)
  const [error, setError] = React.useState<keyof typeof ErrorMessages | null>(null)

  const validate = (
    minimumYear?: number,
    maximumYear?: number,
    allowPast?: boolean,
    allowFuture?: boolean
  ): keyof typeof ErrorMessages | null => {
    const currYear = new Date().getFullYear()
    const gtCurrent = (minimumYear && minimumYear > currYear) || (maximumYear && maximumYear > currYear)
    const ltCurrent = (minimumYear && minimumYear < currYear) || (maximumYear && maximumYear < currYear)

    if (minimumYear === undefined && maximumYear === undefined) {
      return null
    }
    if (maximumYear && minimumYear && maximumYear < minimumYear) {
      return 'RANGE'
    }
    if (gtCurrent && allowFuture !== undefined && !allowFuture) {
      return 'NO_FUTURE_YEARS'
    }
    if (ltCurrent && allowPast !== undefined && !allowPast) {
      return 'NO_PAST_YEARS'
    }

    return null
  }

  const updateParentIfValid = (
    minimumYear?: number,
    maximumYear?: number,
    allowPast?: boolean,
    allowFuture?: boolean
  ) => {
    const error = validate(minimumYear, maximumYear, allowPast, allowFuture)
    setError(error)

    if (!error) {
      const formatOptions = {
        minimumYear: minimumYear,
        maximumYear: maximumYear,
        allowFuture: allowFuture,
        allowPast: allowPast,
      }
      const inputItem = {...initialStep.inputItem, formatOptions: formatOptions}
      onValidChange({...initialStep, inputItem})
    }
  }

  return (
    <>
      <Box>
        <YearRadioGroup
          type="min"
          allowValue={allowPast}
          yearValue={minimumYear}
          hasError={error === 'RANGE' || error === 'NO_PAST_YEARS'}
          onChange={(allowPast, minimumYear) => {
            setMinimumYear(minimumYear)
            setAllowPast(allowPast)
            updateParentIfValid(minimumYear, maximumYear, allowPast, allowFuture)
          }}
        />
        <YearRadioGroup
          type="max"
          allowValue={allowFuture}
          yearValue={maximumYear}
          hasError={error === 'RANGE' || error === 'NO_FUTURE_YEARS'}
          onChange={(allowFuture, maximumYear) => {
            setMaximumYear(maximumYear)
            setAllowFuture(allowFuture)
            updateParentIfValid(minimumYear, maximumYear, allowPast, allowFuture)
          }}
        />
      </Box>
      {error && <AlertWithTextWrapper text={ErrorMessages[error]}></AlertWithTextWrapper>}
    </>
  )
}

export default Year
