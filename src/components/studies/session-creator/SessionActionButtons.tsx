import {Box, Button, MenuItem, Select, styled} from '@mui/material'
import {theme} from '@style/theme'
import {StudySession} from '@typedefs/scheduling'
import React, {FunctionComponent, useEffect} from 'react'

const StyledActionButtons = styled(Box, {label: 'StyledActionButtons'})(({theme}) => ({
  display: 'flex',
  alignItems: 'center',

  flexShrink: 0,
  paddingTop: theme.spacing(2),
}))

type SessionActionButtonsProps = {
  onAddSession: Function
  sessions: StudySession[]
  disabled?: boolean
}

const SessionActionButtons: FunctionComponent<SessionActionButtonsProps> = ({
  onAddSession,
  sessions,
  disabled,
}: SessionActionButtonsProps) => {
  const [selectedSessionId, setSelectedSessionId] = React.useState<string | undefined>(
    sessions.length > 0 ? sessions[0].guid : undefined
  )

  useEffect(() => {
    setSelectedSessionId(sessions.length > 0 ? sessions[0].guid : undefined)
  }, [sessions.length, sessions])

  const duplicateSession = (selectedId?: string) => {
    const session = sessions.find(s => s.guid === selectedId)
    const name = session?.name ? session.name + ' (copy)' : undefined

    if (!selectedId || !session?.assessments || session.assessments.length === 0) {
      onAddSession(sessions, [], name)
    } else {
      onAddSession(sessions, [...session.assessments], name)
    }
  }

  return (
    <StyledActionButtons>
      <Button disabled={disabled} key="add_session" variant="contained" onClick={() => onAddSession(sessions, [])}>
        Create new session
      </Button>

      {selectedSessionId && (
        <>
          <Select
            sx={{margin: theme.spacing(0, 2)}}
            key="session_select"
            value={selectedSessionId}
            onChange={e => setSelectedSessionId(e.target.value as string)}
            displayEmpty
            inputProps={{'aria-label': 'Select Sessions'}}
            disableUnderline={true}>
            {sessions.map((session, index) => (
              <MenuItem value={session.guid} key={`${session.guid}menu${index}`}>
                {session.name}
              </MenuItem>
            ))}
          </Select>

          <Button
            disabled={disabled}
            key="duplicate_session"
            variant="text"
            onClick={() => duplicateSession(selectedSessionId)}>
            Duplicate
          </Button>
        </>
      )}
    </StyledActionButtons>
  )
}

export default SessionActionButtons
