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
    if (value) {
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
    if (!unit || !value) {
      return
    }
    //dont' use that since it will change the units
    //const convertedDuraion = moment.duration({ [unit]: value }).toISOString()
    //compose a perdio
    // const durationUnit = Object.keys(units).find(key => units[key] === unit)!
    const time = unit === 'H' || unit === 'M' ? 'T' : ''
    const p = `P${time}${value}${unit}`
    //console.log(p, 'set p')

    onChange({target: {value: p}})
  }

  return (
    <div className={classes.root}>
      <SmallTextBox
        disabled={!!disabled}
        style={{width: '60px'}}
        value={num || ''}
        aria-label={numberLabel}
        type="number"
        {...props}
        id={numberLabel.replace(' ', '')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
        onChange={e =>
          changeValue(num, e.target.value as moment.unitOfTime.Base)
        }
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
