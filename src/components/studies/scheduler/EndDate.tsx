import {
  createStyles,
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import {
  EndDate as EndDateType,
  SessionScheduleEndType
} from '../../../types/scheduling'
import SmallTextBox from '../../widgets/SmallTextBox'
import SchedulingFormSection from './SchedulingFormSection'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
)

export interface EndDateProps {
  endDate: EndDateType
  onChange: Function
}

const EndDate: React.FunctionComponent<EndDateProps> = ({
  endDate,
  onChange,
}: EndDateProps) => {
  const classes = useStyles()

  const changeEndDate = (type: SessionScheduleEndType) => {
    onChange({ ...endDate, type })
  }

  const changeEndDateDays = (days: string) => {
    /* if (isNaN(Number.parseInt(days))) {
      throw new Error('Number!')
    }*/

    const endDate: EndDateType = {
      type: 'N_OCCURENCES',
      days: Number(days),
    }
    onChange(endDate)
  }

  return (
    <SchedulingFormSection label={'End after:'}>
      <RadioGroup
        aria-label="End Date"
        name="endDate"
        value={endDate.type}
        onChange={e => changeEndDate(e.target.value as SessionScheduleEndType)}
      >
        <FormControlLabel
          value={'END_STUDY'}
          control={<Radio />}
          label="End of study "
        />

        <FormControlLabel
          control={
            <>
              <Radio value={'N_OCCURENCES'} />{' '}
              <SmallTextBox
                id="standard-basic"
                style={{ marginRight: '10px' }}
                onChange={e => changeEndDateDays(e.target.value)}
                value={endDate.days || ''}
                onFocus={e => changeEndDate('N_OCCURENCES')}
              />
            </>
          }
          label="times"
        />
      </RadioGroup>
    </SchedulingFormSection>
  )
}

export default EndDate
