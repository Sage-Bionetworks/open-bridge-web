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

type SessionActionButtonsProps = {
  onAddSession: Function
  sessions: StudySession[]
}

const SessionActionButtons: FunctionComponent<SessionActionButtonsProps> = ({
  onAddSession,
  sessions,
}: SessionActionButtonsProps) => {
  const classes = useStyles()
  const [selectedSession, setSelectedSession] = React.useState<
    StudySession | undefined
  >(sessions.length > 0 ? sessions[0] : undefined)


  return (
    <Box
      className={/*clsx(classes.root)*/ ''}
      display="flex"
      alignItems="flex-start"
      paddingTop="16px"
    >
      <Button
        variant="contained"
        color="secondary"
        style={{ marginRight: '16px' }}
        onClick={() => onAddSession(sessions, [])}
      >
        Create new session
      </Button>

      {selectedSession && [
        <Select
          style={{
            marginRight: '8px',
            marginLeft: '16px',
            padding: 0,
            marginTop: '0',
          }}
          value={selectedSession.id}
          onChange={e =>
            setSelectedSession(
              sessions.find(session => session.id === e.target.value)!,
            )
          }
          displayEmpty
          className={classes.selectEmpty}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {sessions.map(session => (
            <MenuItem value={session.id} key={session.id}>
              {session.name}
            </MenuItem>
          ))}
        </Select>,

        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            onAddSession(sessions, [...(selectedSession.assessments || [])])
          }
        >
          Duplicate
        </Button>,
      ]}
    </Box>
  )
}

export default SessionActionButtons
