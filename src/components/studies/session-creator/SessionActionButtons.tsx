import { Box, Button, makeStyles, MenuItem, Select } from '@material-ui/core'
import React, { FunctionComponent, useEffect } from 'react'
import { StudySession } from '../../../types/scheduling'

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
    padding: 0,
    width: '175px',
    height: '40px',
    boxShadow: `0px 4px 4px rgba(0, 0, 0, 0.25)`,
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#F2F2F2',
    borderBottom: '0px',
    '&:hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error):before': {
      borderBottom: '0px',
    },
    '&:active': {
      borderBottom: '0px',
    },
    fontFamily: 'Lato',
  },
  createNewSession: {
    borderRadius: '0px',
    width: '192px',
    height: '40px',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    color: 'black',
    backgroundColor: '#BCD5E4',
    '&:hover': {
      backgroundColor: '#BCD5E4',
    },
    fontFamily: 'Lato',
  },
  duplicateStudyButton: {
    width: '93px',
    height: '40px',
    borderRadius: '0px',
    marginBottom: theme.spacing(1),
    color: 'black',
    backgroundColor: '#BCD5E4',
    '&:hover': {
      backgroundColor: '#BCD5E4',
    },
    fontFamily: 'Lato',
    boxShadow: `0px 4px 4px rgba(0, 0, 0, 0.25)`,
  },
  menuItem: {
    root: {
      backgroundColor: '#F2F2F2',
    },
    fontFamily: 'Lato',
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
        key="add_session"
        variant="contained"
        className={classes.createNewSession}
        onClick={() => onAddSession(sessions, [])}
      >
        + Create new session
      </Button>

      {selectedSessionId && (
        <>
          <Select
            key="session_select"
            value={selectedSessionId}
            onChange={e => setSelectedSessionId(e.target.value as string)}
            displayEmpty
            className={classes.selectEmpty}
            inputProps={{ 'aria-label': 'Without label' }}
            disableUnderline={true}
          >
            {sessions.map((session, index) => (
              <MenuItem
                value={session.id}
                key={`${session.id}menu${index}`}
                className={classes.menuItem}
              >
                {session.name}
              </MenuItem>
            ))}
          </Select>

          <Button
            key="duplicate_session"
            variant="contained"
            onClick={() => duplicateSession(selectedSessionId)}
            className={classes.duplicateStudyButton}
          >
            Duplicate
          </Button>
        </>
      )}
    </Box>
  )
}

export default SessionActionButtons
