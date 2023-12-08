import {getDropdownTimeItems} from '@components/studies/scheduler/utility'
import {StyledFormControl, StyledLabel14} from '@components/surveys/widgets/SharedStyled'
import {StyledDropDown, StyledDropDownItem} from '@components/surveys/widgets/StyledDropDown'
import AlertWithTextWrapper from '@components/widgets/AlertWithTextWrapper'
import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import {theme} from '@style/theme'
import {FormatOptionsTime, TimeQuestion} from '@typedefs/surveys'
import React from 'react'

// TODO: syoung 10/11/2023 Revisit this design later - it doesn't really make sense to allow time questions to constrain to future/past.
// const Labels = styled('div', {label: 'labels'})(({theme}) => ({
//   backgroundColor: '#fff',
//   padding: theme.spacing(2, 1.5),
//   marginTop: theme.spacing(2),

//   '& > label': {
//     marginBottom: theme.spacing(0.5),
//     '& span': {
//       width: '130px',
//       display: 'inline-block',
//     },
//   },
// }))

const ValueSelector: React.FunctionComponent<{
  value: string | undefined
  isDisabled: boolean
  isReadOnly?: boolean
  type: 'MIN' | 'MAX'

  onChange: (value: string) => void
}> = ({value, type, isDisabled, isReadOnly, onChange}) => {
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
    <StyledFormControl sx={{marginRight: theme.spacing(2), marginBottom: theme.spacing(2)}}>
      <StyledLabel14 mb={0.5} id={CONFIG[type].labelId}>
        {CONFIG[type].label}
      </StyledLabel14>

      <StyledDropDown
        readOnly={isReadOnly}
        labelId={CONFIG[type].labelId}
        value={value || ''}
        height="42px"
        width="92px"
        disabled={isDisabled}
        onChange={(e: SelectChangeEvent<unknown>) => onChange(e.target.value as string)}
        input={<OutlinedInput />}>
        {Object.keys(getDropdownTimeItems()).map(opt => (
          <MenuItem value={opt} key={opt}>
            <StyledDropDownItem>
              <Box paddingLeft="13px">{opt}</Box>{' '}
            </StyledDropDownItem>
          </MenuItem>
        ))}
      </StyledDropDown>
    </StyledFormControl>
  )
}

// TODO: Time is partially controlled, so parent (QuestionEditRhs) uses a key
// to re-render the entire component when the step is changed.
// Consider making this components fully controlled instead.
const Time: React.FunctionComponent<{
  step: TimeQuestion
  isReadOnly?: boolean
  onChange: (step: TimeQuestion) => void
}> = ({step, isReadOnly, onChange}) => {
  const [rangeDisabled, setRangeDisabled] = React.useState(
    step.inputItem.formatOptions?.minimumValue === undefined && step.inputItem.formatOptions?.maximumValue === undefined
  )
  const [range, setRange] = React.useState<{min?: string; max?: string} | undefined>({
    min: step.inputItem.formatOptions?.minimumValue,
    max: step.inputItem.formatOptions?.maximumValue,
  })

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

  React.useEffect(() => {
    setError(!range || validate(range) ? '' : 'Max value should be less than min value')
  }, [range])

  const changeRangeDisabled = (val: boolean) => {
    if (isReadOnly) return
    setRangeDisabled(val)
    if (val) {
      setRange(undefined)
      setError('')
      onUpdateFormat({
        ...step.inputItem.formatOptions,
        maximumValue: undefined,
        minimumValue: undefined,
      })
    }
  }
  return (
    <>
      <FormControlLabel
        sx={{mt: theme.spacing(1.5)}}
        control={<Checkbox checked={rangeDisabled} onChange={e => changeRangeDisabled(e.target.checked)} />}
        label={<Typography sx={{fontWeight: '14px'}}>No min and max validation</Typography>}
      />
      <Box
        sx={{
          display: 'flex',
        }}>
        <ValueSelector
          type="MIN"
          isDisabled={rangeDisabled}
          isReadOnly={isReadOnly}
          value={range?.min}
          onChange={num => {
            const isValid = validate({min: num, max: range?.min})
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
          isReadOnly={isReadOnly}
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
      {/* <Labels>
        <RadioGroup
          id="exclude"
          value={exclude}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setExclude(e.target.value as LimitType)
            const fo = {...(step.inputItem.formatOptions || {})}
            fo.allowFuture = e.target.value !== 'PAST'
            fo.allowPast = e.target.value !== 'FUTURE'
            onUpdateFormat(fo)
          }}>
          <FormControlLabel
            value="NONE"
            sx={{mt: theme.spacing(1.5), alignItems: 'center'}}
            control={<Radio />}
            label={'Allow any time value'}
          />
          <FormControlLabel
            value="FUTURE"
            sx={{alignItems: 'center'}}
            control={<Radio />}
            label={'Allow only time in the future'}
          />

          <FormControlLabel
            sx={{alignItems: 'center'}}
            value="PAST"
            control={<Radio />}
            label={'Allow only time in the past'}
          />
        </RadioGroup>
      </Labels> */}
      <Typography variant="body1" margin={(theme.spacing(3), 'auto', 'auto', theme.spacing(3))}>
        *The actual UI for this question will default to the system's OS interface.{' '}
      </Typography>
    </>
  )
}

export default Time
