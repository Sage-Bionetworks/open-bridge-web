import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { createStyles, StandardTextFieldProps, Theme } from '@material-ui/core'

import SelectWithEnum from '../../widgets/SelectWithEnum'

import SmallTextBox from './SmallTextBox'
import moment from 'moment'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

export interface DurationProps {
  onChange: Function

  durationString: string | undefined
  unitData: any
  unitLabel: string
  numberLabel: string
}

const Duration: React.FunctionComponent<DurationProps & StandardTextFieldProps> = ({
  durationString,
  unitData,
  onChange,
  unitLabel,
  numberLabel,
  ...props
}: DurationProps) => {
  const classes = useStyles()

  const units: { [key: string]: moment.unitOfTime.Base } = {
    Y: 'y',
    M: 'M',
    W: 'w',
    D: 'd',
    H: 'h',
    TM: 'm',
    S: 's',
  }

  const [unt, setUnit] = React.useState<moment.unitOfTime.Base | undefined>(
    undefined,
  )
  const [num, setNum] = React.useState<number | undefined>(undefined)

  React.useEffect(() => {
    try {
      if (!durationString /*|| !durationString.includes('P')*/) {
        throw 'no value'
      }
      console.log('duration', durationString)
      const hasTime = durationString.includes('T')
      console.log(hasTime)
      let unit = durationString[durationString.length - 1]
      unit = unit === 'M' && hasTime ? 'TM' : unit
      console.log('unit is', unit)
      console.log('unitdata', unitData)
      const parsedDuration = moment.duration(durationString)
      console.log('parsedD', parsedDuration)

      const n = parsedDuration.as(units[unit] as moment.unitOfTime.Base)

      console.log('unittype:', typeof unit)
      console.log('n', n)

      setUnit(units[unit])
      setNum(n)
    } catch (e) {
      console.log(e)
      setUnit(undefined)
      setNum(undefined)
    }
  }, [durationString])

  const changeValue = (value?: number, unit?: moment.unitOfTime.Base) => {
    if (unit) {
      setUnit(unit)
    }
    if (value) {
      setNum(value)
    }
    if (!unit || !value) {
      return
    }
    //dont' use that since it will change the units
    //const convertedDuraion = moment.duration({ [unit]: value }).toISOString()
    //compose a perdio
    const durationUnit = Object.keys(units).find(key => units[key] === unit)!
    const p = `P${value}${durationUnit}`

    onChange(p)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <SmallTextBox
        value={num || ''}
        aria-label={numberLabel}
        type="number"
        {...props}
        id={numberLabel.replace(' ', '')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          changeValue(Number(e.target.value as string), unt)
        }}
      ></SmallTextBox>

      <SelectWithEnum
        aria-label={unitLabel}
        {...props}
        value={unt}
        sourceData={unitData}
        id={unitLabel.replace(' ', '')}
        onChange={e =>
          changeValue(num, e.target.value as moment.unitOfTime.Base)
        }
      ></SelectWithEnum>
    </div>
  )
}

export default Duration
