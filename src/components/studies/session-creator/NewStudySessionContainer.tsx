import React, { ChangeEvent, FunctionComponent } from 'react'

import clsx from 'clsx'
import {
  makeStyles,
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from '@material-ui/core'

import { StudySession } from '../../../types/types'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '12px',
    border: '1px solid #C4C4C4',
    width: '265px',
    marginRight: '26px',
  },
  label: {
    fontSize: 18,
    textTransform: 'uppercase',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    whiteSpace: 'nowrap',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

type NewStudySessionContainerProps = {
  onAddSession: Function
  sessions: StudySession[]
}

const NewStudySessionContainer: FunctionComponent<NewStudySessionContainerProps> = ({
  onAddSession,
  sessions,
}: NewStudySessionContainerProps) => {
  const classes = useStyles()

  const copySession = (event: React.ChangeEvent<{ value: unknown }>) => {
    const sessionId = event.target.value as string

    console.log('sessionId:', sessionId)
    const assessments =
      sessions.find(session => session.id === sessionId)?.assessments || []

    onAddSession(sessions, [...assessments])
  }

  return (
    <Box className={/*clsx(classes.root)*/ ''}>
      <Button variant="text" onClick={() => onAddSession(sessions, [])}>
        + Create new session
      </Button>

      <FormControl className={classes.formControl}>
        <Select
          value={''}
          onChange={copySession}
          displayEmpty
          className={classes.selectEmpty}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="" disabled>
            + DUPLICATE SESSION
          </MenuItem>
          {sessions.map(session => (
            <MenuItem value={session.id} key={session.id}>
              {session.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default NewStudySessionContainer
