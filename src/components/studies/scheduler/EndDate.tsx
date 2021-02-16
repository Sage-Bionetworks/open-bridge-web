import {
  FormControlLabel,
  Radio,
  RadioGroup
} from '@material-ui/core'
import React from 'react'
import {
  EndDate as EndDateType,
  SessionScheduleEndType
} from '../../../types/scheduling'
import SmallTextBox from '../../widgets/SmallTextBox'
import SchedulingFormSection from './SchedulingFormSection'

export interface EndDateProps {
  endDate: EndDateType
  onChange: Function
}

const EndDate: React.FunctionComponent<EndDateProps> = ({
  endDate,
  onChange,
}: EndDateProps) => {
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
                color="secondary"
                id="standard-basic"
                style={{ marginRight: '10px' }}
                onChange={e => changeEndDateDays(e.target.value)}
                value={endDate.days || ''}
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
