import {StyledCheckbox, StyledFormControl} from '@components/surveys/widgets/SharedStyled'
import AlertWithTextWrapper from '@components/widgets/AlertWithTextWrapper'
import {SimpleTextInput, SimpleTextLabel} from '@components/widgets/StyledComponents'
import {Box, FormControlLabel, Typography} from '@mui/material'
import {poppinsFont, theme} from '@style/theme'
import {FormatOptionsInteger, NumericQuestion} from '@typedefs/surveys'
import React, {ChangeEvent} from 'react'

const ValueSelector: React.FunctionComponent<{
  value?: number
  isDisabled?: boolean
  hasError?: boolean
  type: 'MIN' | 'MAX'

  onChange: (value: number) => void
}> = ({value, type, isDisabled, hasError, onChange}) => {
  const CONFIG = {
    MIN: {
      label: 'Min Value',
      labelId: 'minValueLbl',
    },
    MAX: {
      label: 'Max Value',
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
          disabled={isDisabled}
          //@ts-ignore
          onChange={(e: ChangeEvent<any>) => {
            onChange(parseInt(e.target.value))
          }}
        />
      </StyledFormControl>
    </>
  )
}

const Numeric: React.FunctionComponent<{
  step: NumericQuestion
  onChange: (step: NumericQuestion) => void
}> = ({step, onChange}) => {
  const [rangeDisabled, setRangeDisabled] = React.useState(
    step.inputItem.formatOptions?.minimumValue === undefined && step.inputItem.formatOptions?.maximumValue === undefined
  )
  const [range, setRange] = React.useState<{min?: number; max?: number} | undefined>({
    min: step.inputItem.formatOptions?.minimumValue,
    max: step.inputItem.formatOptions?.maximumValue,
  })
  const [error, setError] = React.useState('')

  const onUpdateFormat = (fm?: FormatOptionsInteger) => {
    const inputItem = {...step.inputItem, formatOptions: fm}
    onChange({...step, inputItem})
  }

  const validate = (range: {min?: number; max?: number}) => {
    if (range.min === undefined || range.max === undefined) {
      return true
    }
    return range.max > range.min
  }

  React.useEffect(() => {
    setError(!range || validate(range) ? '' : 'Max value should be less than min value')
  }, [range])

  const changeRangeDisabled = (val: boolean) => {
    setRangeDisabled(val)
    if (val) {
      setRange(undefined)
      setError('')
      //onUpdateFormat(undefined)
    }
  }

  return (
    <>
      <FormControlLabel
        sx={{mt: theme.spacing(1.5)}}
        control={<StyledCheckbox checked={rangeDisabled} onChange={e => changeRangeDisabled(e.target.checked)} />}
        label={<Typography sx={{fontFamily: poppinsFont, fontWeight: '14px'}}>No min and max validation!</Typography>}
      />
      <Box
        sx={{
          display: 'flex',
        }}>
        <ValueSelector
          type="MIN"
          isDisabled={rangeDisabled}
          value={range?.min}
          hasError={!!error}
          onChange={num => {
            const isValid = validate({min: num, max: range?.max})
            if (isValid) {
              onUpdateFormat({
                ...step.inputItem.formatOptions,
                minimumValue: num,
              })
            }
            setRange(prev => ({...(prev || {}), min: num}))
          }}
        />
        <ValueSelector
          type="MAX"
          isDisabled={rangeDisabled}
          value={range?.max}
          onChange={num => {
            const isValid = validate({min: range?.min, max: num})
            if (isValid) {
              onUpdateFormat({
                ...step.inputItem.formatOptions,
                maximumValue: num,
              })
            }
            setRange(prev => ({...(prev || {}), max: num}))
          }}
        />
      </Box>
      {error && <AlertWithTextWrapper text={error}></AlertWithTextWrapper>}
    </>
  )
}

export default Numeric
