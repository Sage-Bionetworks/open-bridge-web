import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  makeStyles,
  createStyles,
} from '@material-ui/core'
import React from 'react'
import { StartEventId } from '../../../types/scheduling'
import SchedulingFormSection from './SchedulingFormSection'

export interface StudyStartDateProps {
  isIntro?: boolean
  startEventId?: StartEventId
  onChange: (n: StartEventId) => void
  style?: React.CSSProperties
}

const useStyles = makeStyles(theme =>
  createStyles({
    headerText: {
      fontSize: '18px',
      fontFamily: 'Poppins',
      lineHeight: '27px',
    },
    description: {
      fontFamily: 'Lato',
      fontStyle: 'italic',
      fontSize: '15px',
      fontWeight: 'lighter',
      lineHeight: '18px',
    },
    descriptionText: {
      marginTop: theme.spacing(0.75),
      fontStyle: 'Lato',
      lineHeight: '18px',
      fontSize: '14px',
    },
    radioButtonAlignment: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  }),
)

const StudyStartDate: React.FunctionComponent<StudyStartDateProps> = ({
  startEventId,
  onChange,
  isIntro,
  style,
}: StudyStartDateProps) => {
  const options: StartEventId[] = ['activities_retrieved', 'study_start_date']
  const classes = useStyles()
  const label = isIntro ? (
    <Box marginRight="24px" maxWidth="225px">
      <strong className={classes.headerText}>
        How would you define Day 1 of your study ?
      </strong>
      <br /> <br />
      <div className={classes.description}>
        Day 1 is when you want your participants to start taking the remote
        assessments.
      </div>{' '}
    </Box>
  ) : (
    'Define Day 1 of the study'
  )

  return (
    <SchedulingFormSection
      label={label}
      altLabel={'Study Start Date'}
      border={false}
      style={{ ...style }}
    >
      <RadioGroup
        aria-label="Day 1"
        name="day1"
        value={startEventId}
        onChange={e => onChange(e.target.value as StartEventId)}
        style={{ maxWidth: '60%' }}
      >
        <FormControlLabel
          value={options[0]}
          control={<Radio />}
          label={
            isIntro
              ? 'After participant signs into the app'
              : 'Right after completion of onboarding session'
          }
        />

        <FormControlLabel
          value={options[1]}
          control={<Radio />}
          className={classes.radioButtonAlignment}
          label={
            isIntro ? (
              <Box marginTop="10px">
                <div>Clinic Visit 1</div>
                <Box className={classes.descriptionText}>
                  <i>
                    By choosing this option, you can define a unique start date
                    for each participant in the Participant Manager tab after
                    your study has launched.
                  </i>
                </Box>
              </Box>
            ) : (
              'Start Date (usually clinic visit) to be defined in Participant Manager'
            )
          }
        />
      </RadioGroup>
    </SchedulingFormSection>
  )
}

export default StudyStartDate
