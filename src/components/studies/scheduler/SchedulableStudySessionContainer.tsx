import React, { FunctionComponent, useRef } from 'react'

import { Assessment, StudySession } from '../../../types/types'

import clsx from 'clsx'
import {
  makeStyles,
  Box,
  Button,
  Grid,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core'
import AssessmentSmall from '../../assessments/AssessmentSmall'
import DeleteIcon from '@material-ui/icons/Delete'

import EditableTextbox from '../../widgets/EditableTextbox'

const useStyles = makeStyles({
  root: {
    padding: '12px',
    border: '1px solid #C4C4C4',

    '&.active': {
      border: '1px solid blue',
    },
  },
  inner: {
    width: '265px',
    border: '1px solid #C4C4C4',
    padding: '12px',
    minHeight: '240px',
  },
})

type SchedulableStudySessionContainerProps = {
  studySession: StudySession

  onSetActiveSession: Function
}

const SchedulableStudySessionContainer: FunctionComponent<SchedulableStudySessionContainerProps> = ({
  studySession,

  onSetActiveSession,
}: SchedulableStudySessionContainerProps) => {
  const classes = useStyles()
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date('2014-08-18T21:11:54'),
  )
  const [startDate, setStartDate] = React.useState("")

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }

  const getTotalSessionTime = (assessments: Assessment[]): number => {
    const result = assessments.reduce((prev, curr, ndx) => {
      return prev + Number(curr.duration)
    }, 0)
    return result
  }

  const Study = ({
    studySession,
  }: {
    studySession: StudySession
  }): JSX.Element => {
    return (
      <>
        <span>{studySession.name}</span>-{' '}
        {getTotalSessionTime(studySession.assessments)} min.
        <div
          className={clsx({
            [classes.inner]: true,
          })}
        >
          {studySession.assessments.map((assessment, index) => (
            <div key={assessment.id}>
              <AssessmentSmall
                assessment={assessment}
                isDragging={false}
              ></AssessmentSmall>
            </div>
          ))}
        </div>
      </>
    )
  }
  return (
    <Box
      className={clsx(classes.root, studySession?.active && 'active')}
      onClick={() => onSetActiveSession(studySession.id)}
    >
      <Grid container item xs={12}>
        <Grid item xs={4}>
          <Study studySession={studySession} />
        </Grid>
        <Grid item xs={4}>
          <Box display="flex">
            `
            <Box>
              {' '}
              <FormLabel component="legend">Start Date</FormLabel>
            </Box>
            <Box>
              {' '}
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="Start Date"
                  name="openApp"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                  }}
                >
                  <FormControlLabel
                    value="openAp"
                    control={<Radio />}
                    label="When participant opens app"
                  />

                  <FormControlLabel
                    value="baseline"
                    control={<Radio />}
                    label="Baseline date defined in participant manager"
                  />
                  <Box>
                    <Radio value={'days_since_baseline'}  inputProps={{ 'aria-label': 'Days Since Baseline '}}
/>

                    <TextField
                      id="standard-basic"
                      label="days since baseline"
                    />
                  </Box>
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
          <Box display="flex">
            `<Box>Reoccurence: </Box>
            <Box> valuesrow2</Box>
          </Box>
          <Box display="flex">
            `<Box>Assessment Window:</Box>
            <Box> valuesrow2</Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          col3
        </Grid>
      </Grid>
    </Box>
  )
}

export default SchedulableStudySessionContainer
