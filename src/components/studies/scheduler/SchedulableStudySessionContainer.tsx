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
  Select,
  MenuItem,
} from '@material-ui/core'
import AssessmentSmall from '../../assessments/AssessmentSmall'
import DeleteIcon from '@material-ui/icons/Delete'

import EditableTextbox from '../../widgets/EditableTextbox'
import { Label } from '@material-ui/icons'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback, ErrorHandler } from '../../widgets/ErrorHandler'

const useStyles = makeStyles({
  root: {
    padding: '12px',
    border: '1px solid #C4C4C4',

    '&.active': {
      border: '1px solid blue',
    },
  },
  inner: {
    border: '1px solid #C4C4C4',
    padding: '12px',
    minHeight: '240px',
  },
})

type StartDateType = 'OPEN_APP' | 'BASELINE_DATE' | 'NDAYS_BASELINE' | 'DATE'

enum ReoccuranceEnum {
  'DAILY' = 'Every Day',
  'WEEKLY' = 'Every Week',
}

type SessionSchedule = {
  startDate: {
    type: StartDateType
    valueDays?: number
    valueDate?: Date
  }
  reoccurance: { unit: keyof typeof ReoccuranceEnum; frequency: number }
  window: { start: number; end: number }[]
}

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

  const defaultSchedule: SessionSchedule = {
    startDate: {
      type: 'OPEN_APP',
    },
    reoccurance: { unit: 'DAILY', frequency: 1 },
    window: [{ start: 5, end: 24 }],
  }
  const [schedulableSession, setSchedulableSession] = React.useState<
    SessionSchedule
  >(defaultSchedule)

  const getTotalSessionTime = (assessments: Assessment[]): number => {
    const result = assessments.reduce((prev, curr, ndx) => {
      return prev + Number(curr.duration)
    }, 0)
    return result
  }

  const changeStartDateType = (type: StartDateType) => {
    const startDate = { ...schedulableSession.startDate, type }
    setSchedulableSession({ ...schedulableSession, startDate })
  }

  const changeStartDateDays = (valueDays: string) => {
    if (isNaN(Number.parseInt(valueDays))) {
      throw new Error('Number!')
    }
    const startDate = {
      ...schedulableSession.startDate,
      valueDays: Number(valueDays),
    }
    setSchedulableSession({ ...schedulableSession, startDate })
  }

  const changeReoccuranceUnits = (unit: keyof typeof ReoccuranceEnum) => {
    const reoccurance = {
      ...schedulableSession.reoccurance,
      unit: unit,
    }
    console.log('reoccurance', reoccurance)
    setSchedulableSession({ ...schedulableSession, reoccurance })
  }
  console.log('rerender')
  console.log(schedulableSession)

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

  const getReoccurance = (): (keyof typeof ReoccuranceEnum)[] => {
    const keys = Object.keys(
      ReoccuranceEnum,
    ) as (keyof typeof ReoccuranceEnum)[]
    return keys
  }

  return (
    <Box
      className={clsx(classes.root, studySession?.active && 'active')}
      onClick={() => onSetActiveSession(studySession.id)}
    >
      <form noValidate autoComplete="off">
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={ErrorHandler}>
          <Grid container item xs={12}>
            <Grid item xs={3}>
              <Study studySession={studySession} />
            </Grid>

            <Grid item xs={5}>
              <Box display="flex" width="100%">
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
                      name="startDate"
                      value={schedulableSession.startDate.type}
                      onChange={e =>
                        changeStartDateType(e.target.value as StartDateType)
                      }
                    >
                      <FormControlLabel
                        value={'OPEN_APP'}
                        control={<Radio />}
                        label="When participant opens app"
                      />

                      <FormControlLabel
                        value={'BASELINE_DATE'}
                        control={<Radio />}
                        label="Baseline date defined in participant manager"
                      />
                      <FormControlLabel
                        control={
                          <>
                            <Radio value={'NDAYS_BASELINE'} />{' '}
                            <TextField
                              id="standard-basic"
                              label="n"
                              onChange={e =>
                                changeStartDateDays(e.target.value)
                              }
                              value={schedulableSession.startDate.valueDays}
                            />
                          </>
                        }
                        
                        label="days Since Baseline"
                      />

                      <Box>
                        <Radio
                          value={'DATE'}
                          inputProps={{ 'aria-label': 'Set Date' }}
                        />

                        <TextField
                          id="standard-basic"
                          type="date"
                          label="Date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={schedulableSession.startDate.valueDate}
                        />
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>
              <Box display="flex">
                `<Box>Reoccurence: </Box>
                <Box>
                  {' '}
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={schedulableSession.reoccurance.unit}
                    onChange={e =>
                      changeReoccuranceUnits(
                        e.target.value as keyof typeof ReoccuranceEnum,
                      )
                    }
                  >
                    {getReoccurance().map(item => (
                      <MenuItem value={item} key={item}>
                        {ReoccuranceEnum[item]}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
              <Box display="flex">
                `<Box>Assessment Window:</Box>
                <Box> valuesrow2</Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>col3</Box>
            </Grid>
          </Grid>
        </ErrorBoundary>
      </form>
    </Box>
  )
}

export default SchedulableStudySessionContainer
