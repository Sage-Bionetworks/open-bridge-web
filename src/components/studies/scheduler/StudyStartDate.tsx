import {
  Box,
  createStyles,
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { StartEventId } from '../../../types/scheduling'
import SchedulingFormSection from './SchedulingFormSection'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

export interface StudyStartDateProps {
  isIntro?: boolean
  startEventId?: StartEventId
  onChange: (n: StartEventId) => void
  style?: React.CSSProperties
}

const StudyStartDate: React.FunctionComponent<StudyStartDateProps> = ({
  startEventId,
  onChange,
  isIntro,
  style,
}: StudyStartDateProps) => {
  const classes = useStyles()
  const options: StartEventId[] = ['ONBOARDING', 'START_DATE']

  const label = isIntro ? (
    <Box marginTop="20px">
      <strong>How would you define Day 1 of your study ?</strong>
      <br /> <br />
      Day 1: official start date of when participant will begin remote
      assessments.{' '}
    </Box>
  ) : (
    'Define Day 1 of the study'
  )

  return (
    <SchedulingFormSection
      label={label}
      border={false}
      style={{ ...style, marginLeft: '324px' }}
    >
      <RadioGroup
        aria-label="Day 1"
        name="day1"
        value={startEventId}
        onChange={e => onChange(e.target.value as StartEventId)}
      >
        <FormControlLabel
          value={options[0]}
          control={<Radio />}
          label="Right after completion of onboarding session"
        />

        <FormControlLabel
          value={options[1]}
          control={<Radio />}
          label="Start Date (usually clinic visit) to be defined in Participant Manager"
        />
      </RadioGroup>
    </SchedulingFormSection>
  )
}

export default StudyStartDate
