import {
  Box,
  createStyles,
  FormControlLabel,
  makeStyles,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import clsx from 'clsx'
import React, {ReactNode} from 'react'
import {poppinsFont} from '../../../style/theme'
import {StartEventId} from '../../../types/scheduling'
import SchedulingFormSection from './SchedulingFormSection'

export interface StudyStartDateProps {
  isIntro?: boolean
  startEventId?: StartEventId
  onChange: (n: StartEventId) => void
  style?: React.CSSProperties
  children?: ReactNode
  isReadOnly?: boolean
}

const useStyles = makeStyles(theme =>
  createStyles({
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
      marginRight: '0',
    },
    notInIntroRadioGroup: {
      maxWidth: '60%',
    },
    inIntroRadioGroup: {
      width: '280px',
    },
  })
)

const StudyStartDate: React.FunctionComponent<StudyStartDateProps> = ({
  startEventId,
  onChange,
  isIntro,
  style,
  children,
  isReadOnly,
}: StudyStartDateProps) => {
  const options: StartEventId[] = ['timeline_retrieved', 'study_start_date']
  const classes = useStyles()
  const label = isIntro && children ? children : 'Define Day 1 of the study'

  return (
    <SchedulingFormSection
      label={label}
      altLabel={'Study Start Date'}
      border={false}
      justifyContent={isIntro ? 'space-between' : 'flex-start'}
      style={{...style}}>
      <RadioGroup
        aria-label="Day 1"
        name="day1"
        value={startEventId}
        onChange={e => onChange(e.target.value as StartEventId)}
        className={clsx(
          isIntro && classes.inIntroRadioGroup,
          !isIntro && classes.notInIntroRadioGroup
        )}>
        <FormControlLabel
          value={options[0]}
          style={{minWidth: '400px'}}
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
