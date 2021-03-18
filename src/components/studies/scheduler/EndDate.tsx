import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import React from 'react'
import SmallTextBox from '../../widgets/SmallTextBox'
import SchedulingFormSection from './SchedulingFormSection'

export interface EndDateProps {
  occurances?: number
  onChange: Function
}
export type SessionScheduleEndType = 'END_STUDY' | 'N_OCCURENCES'

const EndDate: React.FunctionComponent<EndDateProps> = ({
  occurances,
  onChange,
}: EndDateProps) => {
  const [endType, setEndType] = React.useState<SessionScheduleEndType>(
    occurances ? 'N_OCCURENCES' : 'END_STUDY',
  )

  const changeEndDate = (type: SessionScheduleEndType) => {
    setEndType(type)
    if (type === 'END_STUDY') {
      onChange(undefined)
    } else {
      setEndType(type)
    }
  }

  return (
    <SchedulingFormSection label={'End after:'}>
      <RadioGroup
        aria-label="End Date"
        name="endDate"
        value={endType}
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
                onFocus={() => changeEndDate('N_OCCURENCES')}
                color="secondary"
                id="standard-basic"
                style={{ marginRight: '10px' }}
                onChange={e => onChange(e.target.value)}
                value={occurances || ''}
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
