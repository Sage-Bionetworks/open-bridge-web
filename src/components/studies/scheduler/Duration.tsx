import {IconButton, makeStyles, StandardTextFieldProps} from '@material-ui/core'
import ClearIcon from '@material-ui/icons/HighlightOff'
import moment from 'moment'
import React from 'react'
import Utility from '../../../helpers/utility'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import SmallTextBox from '../../widgets/SmallTextBox'
import {getAmountOfTimeFromString} from './utility'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  clear: {
    minWidth: 'auto',
    padding: 0,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(-0.75),
  },
}))

export interface DurationProps {
  onChange: Function
  durationString: string | undefined
  unitData: any
  unitLabel: string
  numberLabel: string
  isIntro?: boolean
  unitDefault?: any
  inputDurationCapInWeeks?: number
  disabled?: boolean
}

const Duration: React.FunctionComponent<
  DurationProps & StandardTextFieldProps
> = ({
  durationString,
  unitData,
  onChange,
  unitLabel,
  numberLabel,
  isIntro,
  unitDefault,
  inputDurationCapInWeeks,
  disabled,
  ...props
}: DurationProps) => {
  const classes = useStyles()
  const [unt, setUnit] = React.useState<string | undefined>(undefined)
  const [num, setNum] = React.useState<number | undefined>(undefined)

  React.useEffect(() => {
    try {
      if (!durationString /*|| !durationString.includes('P')*/) {
        throw new Error(durationString + 'no value!')
      }

      let unit = durationString[durationString.length - 1]
      const n = getAmountOfTimeFromString(durationString)

      setUnit(unit)
      setNum(n)
    } catch (e) {
      setUnit(undefined)
      setNum(undefined)
    }
  }, [durationString])

  const changeValue = (value?: number, unit?: string) => {
    if (unit) {
      setUnit(unit)
    }
    if (value !== undefined) {
      setNum(value)

      if (!unit && unitDefault) {
        const unitDefaultValue = Utility.getEnumKeyByEnumValue(
          unitData,
          unitDefault
        )
        unit = unitDefaultValue
        setUnit(unitDefaultValue)
      }
    }
    if (!unit || value === undefined) {
      return
    }
  }

  const triggerChange = (e: any) => {
    const time = unt === 'H' || unt === 'M' ? 'T' : ''
    const p = `P${time}${num}${unt}`

    onChange({target: {value: p}})
  }

  return (
    <div className={classes.root} onBlur={triggerChange}>
      <SmallTextBox
        disabled={!!disabled}
        style={{width: '60px'}}
        value={num || ''}
        aria-label={numberLabel}
        type="number"
        {...props}
        id={numberLabel.replace(' ', '')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (inputDurationCapInWeeks !== undefined) {
            const newValue = Number(e.target.value as string)
            const isOverScheduleDurationLimit =
              (newValue > inputDurationCapInWeeks && unt === 'W') ||
              (newValue > inputDurationCapInWeeks * 7 && unt === 'D')
            if (isOverScheduleDurationLimit) {
              return
            }
          }
          changeValue(Number(e.target.value as string), unt)
        }}
        inputWidth={isIntro ? 10 : undefined}></SmallTextBox>

      <SelectWithEnum
        disabled={!!disabled}
        aria-label={unitLabel}
        {...props}
        value={unt}
        sourceData={unitData}
        id={unitLabel.replace(' ', '')}
        onChange={e => {
          const daysNumTooLarge =
            inputDurationCapInWeeks !== undefined &&
            e.target.value === 'W' &&
            (num || 0) > inputDurationCapInWeeks
          changeValue(
            daysNumTooLarge ? inputDurationCapInWeeks : num,
            e.target.value as moment.unitOfTime.Base
          )
        }}
        style={isIntro ? {width: '100px'} : undefined}></SelectWithEnum>
      <IconButton
        className={classes.clear}
        onClick={_e => onChange({target: {value: undefined}})}>
        <ClearIcon />
      </IconButton>
    </div>
  )
}

export default Duration
