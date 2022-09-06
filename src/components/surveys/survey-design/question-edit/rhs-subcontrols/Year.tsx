import {SimpleTextInput} from '@components/widgets/StyledComponents'
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  Typography,
} from '@mui/material'
import {theme} from '@style/theme'
import {
  FormatOptionsTime,
  FormatOptionsYear,
  Step,
  YearQuestion,
} from '@typedefs/surveys'
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

type LimitType = 'CURRENT' | 'VALUE' | 'NONE'
const fieldConfig: {
  MIN: Record<string, keyof FormatOptionsYear>
  MAX: Record<string, keyof FormatOptionsYear>
} = {
  MIN: {
    CURRENT: 'allowPast',
    VALUE: 'minimumYear',
  },
  MAX: {
    CURRENT: 'allowFuture',
    VALUE: 'maximumYear',
  },
}

function getLimit(type: 'MAX' | 'MIN', fo?: FormatOptionsYear): LimitType {
  const allowXField = fieldConfig[type]['CURRENT']!
  const valueField = fieldConfig[type]['VALUE']!
  if (!fo) {
    return 'NONE'
  }
  if (fo[allowXField] === false) {
    return 'CURRENT'
  }
  if (fo[valueField]) {
    return 'VALUE'
  }
  return 'NONE'
}

const Limit: React.FunctionComponent<{
  type: 'MAX' | 'MIN'
  formatOptions: FormatOptionsYear
  onChange: (fo: FormatOptionsYear) => void
}> = ({formatOptions, type, onChange}) => {
  const [exclude, setExclude] = React.useState<LimitType>(
    getLimit(type, formatOptions)
  )
  const [value, setValue] = React.useState(
    ''
    // type === 'MIN' ? formatOptions.minimumYear : formatOptions.maximumYear
  )

  const validateYear = (val: string): boolean => {
    const intVal = parseInt(val)
    if (isNaN(intVal)) {
      return false
    }
    var validRange = CONFIG[type].validateRange(intVal)
    return 1900 < intVal && intVal < 2200 && validRange
  }

  const CONFIG = {
    MIN: {
      label: 'Minimum year:',
      anyLabel: 'Allow anytime in the past',
      yearLabel: 'Set Min Value',
      validateRange: (e: number) =>
        !formatOptions.maximumYear || e < formatOptions.maximumYear,
    },
    MAX: {
      label: 'Maximum year:',
      anyLabel: 'Allow anytime in the future',
      yearLabel: 'Set Max Value',
      validateRange: (e: number) =>
        !formatOptions.minimumYear || e > formatOptions.minimumYear,
    },
  }

  React.useEffect(() => {
    const valueField = fieldConfig[type]['VALUE']!
    if (formatOptions[valueField] === undefined) {
      setValue('')
    } else {
      const year = formatOptions[valueField]?.toString() || ''
      const currentYear = new Date().getFullYear().toString()
      setValue(year === currentYear ? '' : year)
    }
  }, [formatOptions, type])

  /* const getLimit = (type: 'MAX' | 'MIN', fo: FormatOptionsYear): LimitType => {
    if (fo[fieldConfig[type]['CURRENT']] === false) {
      return 'CURRENT'
    }

    if (fo[fieldConfig[type]['VALUE']]) {
      return 'VALUE'
    }

    return 'ANY'
  }*/

  const onUpdateFormat = (fo: FormatOptionsYear, limit: LimitType) => {
    const _fo = {...fo}
    /*  allowFuture?: boolean
  allowPast?: boolean
  minimumYear?: number
  maximumYear?: number*/
    const allowXField = fieldConfig[type]['CURRENT']!
    const valueField = fieldConfig[type]['VALUE']!
    // let result: FormatOptionsYear
    let isValid = true

    //if (limit === 'ANY') {
    let result: FormatOptionsYear = {
      ..._fo,
      [allowXField]: true,
      [valueField]: undefined,
    }
    //  }
    if (limit === 'CURRENT') {
      result = {
        ..._fo,
        [allowXField]: undefined,
        [valueField]: new Date().getFullYear(),
      }
    }
    //if (limit === 'VALUE') {
    if (limit === 'VALUE') {
      isValid = value !== undefined && validateYear(value)
      result = {..._fo, [allowXField]: undefined, [valueField]: value}
    }

    if (isValid && result) {
      onChange(result)
    } else {
      alert('invalid')
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
            value="CURRENT"
            sx={{alignItems: 'center'}}
            control={<Radio />}
            label={'Current Year'}
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
                    setExclude('VALUE')
                    setValue(e.target.value || '')
                  }}
                  onBlur={e => {
                    if (value) {
                      validateYear(value)
                    }
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
      </Labels>
    </>
  )
}

const Time: React.FunctionComponent<{
  step: YearQuestion
  onChange: (step: Step) => void
}> = ({step, onChange}) => {
  const onUpdateFormat = (fm: FormatOptionsTime) => {
    const inputItem = {...step.inputItem, formatOptions: fm}
    onChange({...step, inputItem})
  }
  const [error, setError] = React.useState('')

  const validate = (range: {min?: string; max?: string}) => {
    if (range.min === undefined || range.max === undefined) {
      return true
    }
    return range.max > range.min
  }

  return (
    <>
      <Limit
        formatOptions={step.inputItem.formatOptions || {}}
        onChange={fo =>
          onChange({...step, inputItem: {...step.inputItem, formatOptions: fo}})
        }
        type="MIN"
      />
      <Limit
        formatOptions={step.inputItem.formatOptions || {}}
        onChange={fo =>
          onChange({...step, inputItem: {...step.inputItem, formatOptions: fo}})
        }
        type="MAX"
      />
    </>
  )
}

export default Time
