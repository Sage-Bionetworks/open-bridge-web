import AlertWithTextWrapper from '@components/widgets/AlertWithTextWrapper'
import {SimpleTextInput} from '@components/widgets/StyledComponents'
import {Box, FormControlLabel, Radio, RadioGroup, styled, Typography} from '@mui/material'
import {theme} from '@style/theme'
import {FormatOptionsYear, YearQuestion} from '@typedefs/surveys'
import React from 'react'

const Labels = styled('div', {label: 'labels'})(({theme}) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(2, 1.5),
  marginTop: theme.spacing(2),

  '& > label': {
    marginBottom: theme.spacing(0.5),
    '& span': {
      width: '130px',
      display: 'inline-block',
    },
  },
}))

type LimitType = 'VALUE' | 'NONE'

const CONFIG = {
  MIN: {
    label: 'Minimum year:',
    anyLabel: 'Allow anytime in the past',
    yearLabel: 'Set Min Value',
    validateRange: (e: number, formatOptions: FormatOptionsYear) =>
      !formatOptions.maximumYear || e < formatOptions.maximumYear,
    fields: {
      NONE: 'allowPast',
      VALUE: 'minimumYear',
    } as Record<string, keyof FormatOptionsYear>,
  },
  MAX: {
    label: 'Maximum year:',
    anyLabel: 'Allow anytime in the future',
    yearLabel: 'Set Max Value',
    validateRange: (e: number, formatOptions: FormatOptionsYear) =>
      !formatOptions.minimumYear || e > formatOptions.minimumYear,
    fields: {
      NONE: 'allowFuture',
      VALUE: 'maximumYear',
    } as Record<string, keyof FormatOptionsYear>,
  },
}

const getLimitYearValue = (type: 'MIN' | 'MAX', formatOptions?: FormatOptionsYear): number | undefined => {
  const valueField = CONFIG[type].fields['VALUE']
  return formatOptions?.[valueField] ? parseInt(formatOptions[valueField]!.toString()) : undefined
}

const getPFValue = (type: 'MAX' | 'MIN', fo?: FormatOptionsYear) => {
  const pFField = CONFIG[type].fields['NONE']
  return !fo || fo[pFField] === undefined || fo[pFField]
}

function getLimit(type: 'MAX' | 'MIN', fo?: FormatOptionsYear): LimitType {
  const limitYearValue = getLimitYearValue(type, fo)
  if (limitYearValue || getPFValue(type, fo) === false) {
    return 'VALUE'
  }

  return 'NONE'
}

const Limit: React.FunctionComponent<{
  type: 'MAX' | 'MIN'
  formatOptions: FormatOptionsYear
  onChange: (fo: FormatOptionsYear) => void
}> = ({formatOptions, type, onChange}) => {
  const [exclude, setExclude] = React.useState<LimitType>('NONE')
  const [value, setValue] = React.useState('')
  const [error, setError] = React.useState('')

  const validateYear = (val: string): boolean => {
    const intVal = parseInt(val)
    if (isNaN(intVal)) {
      setError('Please enter a valid year')
      return false
    }
    var validRange = CONFIG[type].validateRange(intVal, formatOptions)
    if (!validRange) {
      setError('Please make sure your minimum is less than you maximum')
      return false
    }
    const validNumber = 1900 < intVal && intVal < 2200
    if (!validNumber) {
      setError('Please make sure that your year is between 1900 and 2200')
      return false
    }
    return true
  }

  React.useEffect(() => {
    const limit = getLimit(type, formatOptions)
    const value = getLimitYearValue(type, formatOptions)
    setExclude(limit)
    setValue(value ? value.toString() : '')
  }, [formatOptions, type])

  const onUpdateFormat = (fo: FormatOptionsYear, limit: LimitType) => {
    const _fo = {...fo}
    let isValid = true
    setError('')

    const allowXField = CONFIG[type].fields['NONE']!
    const valueField = CONFIG[type].fields['VALUE']!

    let result: FormatOptionsYear = {
      ..._fo,
      [allowXField]: true,
      [valueField]: undefined,
    }

    if (limit === 'VALUE') {
      isValid = value ? validateYear(value) : true
      result = {..._fo, [allowXField]: false, [valueField]: value || undefined}
    }

    if (isValid && result) {
      console.log('changing')
      onChange(result)
    }
  }

  return (
    <>
      <Labels>
        <Typography>{CONFIG[type].label}</Typography>
        <RadioGroup
          id={`${type}-limits`}
          value={exclude}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setExclude(e.target.value as LimitType)
            onUpdateFormat(formatOptions, e.target.value as LimitType)
          }}>
          <FormControlLabel
            value="NONE"
            sx={{mt: theme.spacing(1.5), alignItems: 'center'}}
            control={<Radio />}
            label={CONFIG[type].anyLabel}
          />

          <FormControlLabel
            sx={{alignItems: 'center'}}
            value="VALUE"
            control={<Radio />}
            label={
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <span>{CONFIG[type].yearLabel}</span>{' '}
                <SimpleTextInput
                  value={value || ''}
                  onChange={e => {
                    if (exclude !== value) {
                      setExclude('VALUE')
                    }
                    setValue(e.target.value || '')
                  }}
                  onBlur={e => {
                    onUpdateFormat(formatOptions, exclude)
                  }}
                  sx={{
                    width: '75px',
                    marginLeft: theme.spacing(1),
                    '> input': {padding: theme.spacing(1)},
                  }}
                />
              </Box>
            }
          />
        </RadioGroup>
        {error && <AlertWithTextWrapper text={error}></AlertWithTextWrapper>}
      </Labels>
    </>
  )
}

const Year: React.FunctionComponent<{
  step: YearQuestion
  onChange: (step: YearQuestion) => void
}> = ({step, onChange}) => {
  return (
    <>
      <Limit
        formatOptions={step.inputItem.formatOptions || {}}
        onChange={fo => {
          console.log('changing to', fo)
          onChange({...step, inputItem: {...step.inputItem, formatOptions: fo}})
        }}
        type="MIN"
      />
      <Limit
        formatOptions={step.inputItem.formatOptions || {}}
        onChange={fo => {
          console.log('changing to', fo)
          onChange({...step, inputItem: {...step.inputItem, formatOptions: fo}})
        }}
        type="MAX"
      />
    </>
  )
}

export default Year
