import SelectWithEnum from '@components/widgets/SelectWithEnum'
import SmallTextBox from '@components/widgets/SmallTextBox'
import Utility from '@helpers/utility'
import ClearIcon from '@mui/icons-material/HighlightOff'
import {Box, IconButton, StandardTextFieldProps, styled} from '@mui/material'
import React from 'react'
import {getValueFromPeriodString} from './utility'

const StyledIconButton = styled(IconButton, {label: 'StyledIconButton'})(({theme}) => ({
  minWidth: 'auto',
  padding: 0,
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(-0.75),
}))

export interface DurationProps {
  onChange: Function
  durationString: string | undefined
  unitData: any
  unitLabel: string
  numberLabel: string
  isIntro?: boolean
  unitDefault?: any
  maxDurationDays?: number
  disabled?: boolean
  isShowClear?: boolean
  placeHolder?: string
  selectWidth?: number
  inputWidth?: number
  /* maxDigits: max number of digits that can be entered for the value, sets width of input field accordingly, defaults to 3
  ...can override max digits restriction by setting maxDurationDays
  ...can override input field width by setting inputWidth */
  maxDigits?: number
}

const Duration: React.FunctionComponent<DurationProps & StandardTextFieldProps> = ({
  durationString,
  unitData,
  onChange,
  unitLabel,
  numberLabel,
  isIntro,
  unitDefault,
  maxDurationDays,
  disabled,
  placeHolder,
  selectWidth,
  inputWidth,
  maxDigits = 3,
  isShowClear = true,
  ...props
}: DurationProps) => {
  const [unt, setUnit] = React.useState<string | undefined>(undefined)
  const [num, setNum] = React.useState<number | undefined>(undefined)

  const unitDefaultValue = Utility.getEnumKeyByEnumValue(unitData, unitDefault)

  React.useEffect(() => {
    try {
      if (!durationString /*|| !durationString.includes('P')*/) {
        throw new Error(durationString + 'no value!')
      }

      let unit = durationString[durationString.length - 1]
      const n = getValueFromPeriodString(durationString)

      setUnit(unit)
      setNum(n)
    } catch (e) {
      setUnit(undefined)
      setNum(undefined)
    }
  }, [durationString])

  const hasAppropriateNumberOfDigits = (value: number) => {
    return `${value}`.length <= maxDigits
  }

  const validate = (value: number, unit: string) => {
    if (!maxDurationDays) {
      return hasAppropriateNumberOfDigits(value)
    }
    const days = unit === 'W' ? value * 7 : value
    return days <= maxDurationDays
  }

  const changeValue = (value?: number, unit?: string) => {
    if (unit) {
      if (validate(value || num || 0, unit)) {
        setUnit(unit)
      }
    }
    if (value !== undefined) {
      if (validate(value, unit || unitDefaultValue || 'D')) {
        setNum(value)
        if (!unit && unitDefault) {
          unit = unitDefaultValue
          setUnit(unitDefaultValue)
        }
      }
    }
  }

  const triggerChange = (e: any) => {
    const time = unt === 'H' || unt === 'M' ? 'T' : ''
    const p = unt === undefined || num === undefined ? undefined : `P${time}${num}${unt}`

    onChange({target: {value: p}})
  }

  return (
    <Box sx={{display: 'flex', alignItems: 'center'}} onBlur={triggerChange}>
      <SmallTextBox
        disabled={!!disabled}
        sx={{marginBottom: 0}}
        value={num || ''}
        aria-label={numberLabel}
        type="number"
        {...props}
        id={numberLabel.replace(' ', '')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          changeValue(Number(e.target.value as string), unt)
        }}
        // inputWidth is theme.spacing
        inputWidth={inputWidth || maxDigits + 4}></SmallTextBox>

      <SelectWithEnum
        disabled={!!disabled}
        aria-label={unitLabel}
        {...props}
        value={unt}
        label={placeHolder}
        sourceData={unitData}
        id={unitLabel.replace(' ', '')}
        onChange={e => changeValue(num, e.target.value as string)}
        sx={{width: `${selectWidth || 100}px`}}></SelectWithEnum>
      {isShowClear && (
        <StyledIconButton onClick={_e => onChange({target: {value: undefined}})} size="large">
          <ClearIcon />
        </StyledIconButton>
      )}
    </Box>
  )
}

export default Duration
