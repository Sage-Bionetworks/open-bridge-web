import AlertWithTextWrapper from '@components/widgets/AlertWithTextWrapper'
import {Box} from '@mui/material'
import {FormatOptionsYear, YearQuestion} from '@typedefs/surveys'
import _ from 'lodash'
import React from 'react'
import YearRadioGroup, {YearFormatType} from './YearRadioGroup'

export const DEFAULT_MIN_YEAR = 1900
export const DEFAULT_MAX_YEAR = new Date().getFullYear()

const yearFormatToAllowValueMap: Record<YearFormatType, boolean | undefined> = {
  SET: undefined,
  ANY: true,
  CURRENT: false,
}

function yearFormatToAllowValue(yearFormat: YearFormatType) {
  return yearFormatToAllowValueMap[yearFormat]
}

function allowValueToYearFormat(allowValue: boolean | undefined): YearFormatType {
  return (
    (Object.keys(yearFormatToAllowValueMap) as YearFormatType[]).find(
      key => yearFormatToAllowValueMap[key] === allowValue
    ) || 'ANY'
  )
}

function setYearValue(yearFormat: YearFormatType, yearValue: number | undefined) {
  return yearFormat === 'SET' ? yearValue : undefined
}

export const ErrorMessages = {
  RANGE: 'Max value must be greater than min value',
  NO_PAST_YEARS: 'No past years allowed',
  NO_FUTURE_YEARS: 'No future years allowed',
}

const Year: React.FunctionComponent<{
  step: YearQuestion
  onChange: (step: YearQuestion) => void
}> = ({step, onChange}) => {
  const [allowPast, setAllowPast] = React.useState<boolean | undefined>(step.inputItem.formatOptions?.allowPast)
  const [allowFuture, setAllowFuture] = React.useState<boolean | undefined>(step.inputItem.formatOptions?.allowFuture)
  const [range, setRange] = React.useState<{min?: number; max?: number}>({
    min: step.inputItem.formatOptions?.minimumYear || setYearValue(allowValueToYearFormat(allowPast), DEFAULT_MIN_YEAR),
    max:
      step.inputItem.formatOptions?.maximumYear || setYearValue(allowValueToYearFormat(allowFuture), DEFAULT_MAX_YEAR),
  })
  const [prevFormatOptions, setPrevFormatOptions] = React.useState<FormatOptionsYear | undefined>(
    step.inputItem.formatOptions
  )

  const validate = (
    range: {min?: number; max?: number},
    allowPast?: boolean,
    allowFuture?: boolean
  ): keyof typeof ErrorMessages | null => {
    const currYear = new Date().getFullYear()
    const gtCurrent = (range.min && range.min > currYear) || (range.max && range.max > currYear)
    const ltCurrent = (range.min && range.min < currYear) || (range.max && range.max < currYear)

    if (range.min === undefined && range.max === undefined) {
      return null
    }
    if (range.max && range.min && range.max < range.min) {
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

  const error: keyof typeof ErrorMessages | null = validate(range, allowPast, allowFuture)

  React.useEffect(() => {
    if (!error) {
      const formatOptions = {
        minimumYear: range?.min,
        maximumYear: range?.max,
        allowFuture: allowFuture,
        allowPast: allowPast,
      }
      // only call onChange if the formatOptions have actually changed
      if (!_.isEqual(formatOptions, prevFormatOptions)) {
        setPrevFormatOptions(formatOptions)
        const inputItem = {...step.inputItem, formatOptions: formatOptions}
        onChange({...step, inputItem})
      }
    }
  }, [range, allowFuture, allowPast, prevFormatOptions, error, onChange, step])

  return (
    <>
      <Box>
        <YearRadioGroup
          type="min"
          yearFormat={allowValueToYearFormat(allowPast)}
          yearValue={range?.min}
          hasError={error === 'RANGE' || error === 'NO_PAST_YEARS'}
          onChange={(yearFormat, yearValue) => {
            setRange(prev => ({...(prev || {}), min: setYearValue(yearFormat, yearValue || DEFAULT_MIN_YEAR)}))
            setAllowPast(yearFormatToAllowValue(yearFormat))
          }}
        />
        <YearRadioGroup
          type="max"
          yearFormat={allowValueToYearFormat(allowFuture)}
          yearValue={range?.max}
          hasError={error === 'RANGE' || error === 'NO_FUTURE_YEARS'}
          onChange={(yearFormat, yearValue) => {
            setRange(prev => ({...(prev || {}), max: setYearValue(yearFormat, yearValue || DEFAULT_MAX_YEAR)}))
            setAllowFuture(yearFormatToAllowValue(yearFormat))
          }}
        />
      </Box>
      {error && <AlertWithTextWrapper text={ErrorMessages[error]}></AlertWithTextWrapper>}
    </>
  )
}

export default Year
