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

type LimitType = 'CURRENT' | 'VALUE' | 'ANY'

function getLimit(type: 'MAX' | 'MIN', fo?: FormatOptionsYear): LimitType {
  if (type === 'MIN') {
    if (fo?.allowPast === false) {
      return 'CURRENT'
    }
    if (fo?.minimumYear) {
      return 'VALUE'
    }
  } else {
    if (fo?.allowFuture === false) {
      return 'CURRENT'
    }
    if (fo?.maximumYear) {
      return 'VALUE'
    }
  }
  return 'ANY'
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
    type === 'MIN' ? formatOptions.minimumYear : formatOptions.maximumYear
  )

  const CONFIG = {
    MIN: {
      label: 'Minimum year:',
      anyLabel: 'Allow anytime in the past',
      yearLabel: 'Set Min Value',
    },
    MAX: {
      label: 'Maximum year:',
      anyLabel: 'Allow anytime in the future',
      yearLabel: 'Set Max Value',
    },
  }

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
    /* if (limit=== 'ANY') {
        const field = fieldConfig['MIN']['CURRENT']!
        _fo['allowPast'] = true
        _fo[field]=true
    }
    const field = fieldConfig[type][limit]

    onChange({...step, inputItem})*/
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
            const fo = {...formatOptions}
            fo.allowFuture = e.target.value !== 'FUTURE'
            fo.allowFuture = e.target.value !== 'PAST'
            onUpdateFormat(fo, e.target.value as LimitType)
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
                  onChange={e => {
                    // const ext = new RegExp(/(?:(?:18|19|20|21)[0-9]{2})/)
                    // const val = parseInt(e.target.value)
                    setExclude('VALUE')
                    setValue(parseInt(e.target.value))
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
