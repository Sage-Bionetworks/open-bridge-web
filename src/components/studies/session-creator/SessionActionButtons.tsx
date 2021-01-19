import { Box, Button, makeStyles, MenuItem, Select } from '@material-ui/core'
import React, { FunctionComponent, useEffect } from 'react'
import { StudySession } from '../../../types/types'



const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    flexShrink: 0,
    paddingTop: theme.spacing(2),
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
    marginTop: 0,

    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(2),
    padding: 0,
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
  const [selectedSessionId, setSelectedSessionId] = React.useState<
    string | undefined
  >(sessions.length > 0 ? sessions[0].id : undefined)

  useEffect(() => {
    setSelectedSessionId(sessions.length > 0 ? sessions[0].id : undefined)
  }, [sessions.length])

  const duplicateSession = (selectedId?: string) => {
    const session = sessions.find(s => s.id === selectedId)
    if (!selectedId || !session || session.assessments.length === 0) {
      onAddSession(sessions, [])
    } else {
      onAddSession(sessions, [...session.assessments])
    }
  }

  return (
    <Box className={classes.root}>
      <Button
        variant="contained"
        color="secondary"
        style={{ marginRight: '16px' }}
        onClick={() => onAddSession(sessions, [])}
      >
        Create new session
      </Button>

      {selectedSessionId && [
        <Select
          value={selectedSessionId}
          onChange={e => setSelectedSessionId(e.target.value as string)}
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
          onClick={() => duplicateSession(selectedSessionId)}
        >
          Duplicate
        </Button>,
      ]}
   
    </Box>
  )
}

export default SessionActionButtons
