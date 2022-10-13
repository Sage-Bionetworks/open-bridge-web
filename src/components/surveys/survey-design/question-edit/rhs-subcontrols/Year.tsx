import {StyledCheckbox, StyledFormControl} from '@components/surveys/widgets/SharedStyled'
import AlertWithTextWrapper from '@components/widgets/AlertWithTextWrapper'
import {SimpleTextInput, SimpleTextLabel} from '@components/widgets/StyledComponents'
import {Box, FormControlLabel, Typography} from '@mui/material'
import {poppinsFont, theme} from '@style/theme'
import {FormatOptionsYear, YearQuestion} from '@typedefs/surveys'
import React, {ChangeEvent} from 'react'

const GeneralAllowCheckbox: React.FunctionComponent<{
  value: boolean
  type: 'PAST' | 'FUTURE'
  onChange: (checked: boolean) => void
}> = ({type, value, onChange}) => {
  const CONFIG = {
    PAST: {
      label: 'Allow past years',
      labelId: 'pastValueLbl',
    },
    FUTURE: {
      label: 'Allow future years',
      labelId: 'futureValueLbl',
    },
  }

  return (
    <FormControlLabel
      htmlFor={CONFIG[type].labelId}
      sx={{mt: theme.spacing(1.5)}}
      control={<StyledCheckbox checked={value !== false} onChange={e => onChange(e.target.checked)} />}
      label={<Typography sx={{fontFamily: poppinsFont, fontWeight: '14px'}}>{CONFIG[type].label}</Typography>}
    />
  )
}

const ValueSelector: React.FunctionComponent<{
  value?: number

  hasError?: boolean
  type: 'MIN' | 'MAX'

  onChange: (value: number) => void
}> = ({value, type, hasError, onChange}) => {
  const CONFIG = {
    MIN: {
      label: 'Min Year',
      labelId: 'minValueLbl',
    },
    MAX: {
      label: 'Max Year',
      labelId: 'maxValueLbl',
    },
  }

  return (
    <>
      <StyledFormControl sx={{marginRight: theme.spacing(2)}} mb={1}>
        <SimpleTextLabel htmlFor={CONFIG[type].labelId}>{CONFIG[type].label}</SimpleTextLabel>

        <SimpleTextInput
          sx={{width: '80px'}}
          id={CONFIG[type].labelId}
          error={hasError}
          value={value ?? ''}
          type="number"
          //@ts-ignore
          onChange={(e: ChangeEvent<any>) => {
            onChange(parseInt(e.target.value))
          }}
        />
      </StyledFormControl>
    </>
  )
}

const ErrorMessages = {
  RANGE: 'Max value must be greater than min value',
  NO_PAST_YEARS: 'No past years allowed',
  NO_FUTURE_YEARS: 'No future years allowed',
}

const Year: React.FunctionComponent<{
  step: YearQuestion
  onChange: (step: YearQuestion) => void
}> = ({step, onChange}) => {
  const [range, setRange] = React.useState<{min?: number; max?: number} | undefined>({
    min: step.inputItem.formatOptions?.minimumYear,
    max: step.inputItem.formatOptions?.maximumYear,
  })
  const [allowFuture, setAllowFuture] = React.useState(step.inputItem.formatOptions?.allowFuture !== false)
  const [allowPast, setAllowPast] = React.useState(step.inputItem.formatOptions?.allowPast !== false)
  const [error, setError] = React.useState<keyof typeof ErrorMessages | null>(null)

  const onUpdateFormat = (fm?: FormatOptionsYear) => {
    const inputItem = {...step.inputItem, formatOptions: fm}
    onChange({...step, inputItem})
  }

  const validate = (
    range: {min?: number; max?: number},
    allowPast: boolean,
    allowFuture: boolean
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
    if (gtCurrent && !allowFuture) {
      return 'NO_FUTURE_YEARS'
    }
    if (ltCurrent && !allowPast) {
      return 'NO_PAST_YEARS'
    }

    return null
  }

  React.useEffect(() => {
    const error = validate(range || {}, allowPast, allowFuture)

    setError(error)
    if (!error) {
      onUpdateFormat({
        ...step.inputItem.formatOptions,
        minimumYear: range?.min,
        maximumYear: range?.max,
        allowFuture,
        allowPast,
      })
    }
  }, [range, allowPast, allowFuture])

  return (
    <>
      <GeneralAllowCheckbox type="PAST" value={allowPast} onChange={setAllowPast} />
      <GeneralAllowCheckbox type="FUTURE" value={allowFuture} onChange={setAllowFuture} />

      <Box
        sx={{
          display: 'flex',
        }}>
        <ValueSelector
          type="MIN"
          value={range?.min}
          hasError={error === 'RANGE' || error === 'NO_PAST_YEARS'}
          onChange={num => {
            setRange(prev => ({...(prev || {}), min: num}))
          }}
        />
        <ValueSelector
          type="MAX"
          value={range?.max}
          hasError={error === 'RANGE' || error === 'NO_FUTURE_YEARS'}
          onChange={num => {
            setRange(prev => ({...(prev || {}), max: num}))
          }}
        />
      </Box>
      {error && <AlertWithTextWrapper text={ErrorMessages[error]}></AlertWithTextWrapper>}
    </>
  )
}

export default Year
