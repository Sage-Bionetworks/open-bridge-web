import {Box, makeStyles} from '@material-ui/core'
import {latoFont} from '@style/theme'
import {AdherenceWindowState} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import AdherenceSessionIcon from './AdherenceSessionIcon'

const useStyles = makeStyles(theme => ({
  sessionLegend: {
    width: theme.spacing(17.5),
    padding: theme.spacing(1, 2),
    fontStyle: latoFont,
    fontSize: '12px',
    border: '1px solid black',
    marginRight: theme.spacing(1),
    '& strong': {
      marginLeft: '15px',
      display: 'block',
    },
  },
}))

const SessionLegend: FunctionComponent<{
  symbolKey: string
  sessionName: string
}> = ({symbolKey, sessionName}) => {
  const classes = useStyles()
  const arr: {label: string; state: AdherenceWindowState}[] = [
    {label: 'Upcoming', state: 'not_yet_available'},
    {label: 'Incomplete', state: 'expired'},
    {label: 'Partial Complete', state: 'started'},
    {label: 'Completed', state: 'completed'},
  ]
  return (
    <Box className={classes.sessionLegend}>
      <strong>{sessionName}</strong>{' '}
      {arr.map(e => (
        <div>
          <AdherenceSessionIcon sessionSymbol={symbolKey} windowState={e.state}>
            {e.label}
          </AdherenceSessionIcon>
        </div>
      ))}
    </Box>
  )
}

export default SessionLegend
