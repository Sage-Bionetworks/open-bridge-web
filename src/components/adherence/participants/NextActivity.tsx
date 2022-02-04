import {ReactComponent as Celebration} from '@assets/adherence/celebration_row.svg'
import {ReactComponent as Arrow} from '@assets/arrow_long.svg'
import {Box, makeStyles} from '@material-ui/core'
import {theme} from '@style/theme'
import {AdherenceSessionInfo, ProgressionStatus} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {useCommonStyles} from '../styles'

export const useStyles = makeStyles(theme => ({
  nextActivity: {
    textAlign: 'center',
    marginRight: theme.spacing(1),
    background:
      'linear-gradient(to bottom, #fff 10px, #333 10px 11px, #fff 11px )',
    '& span': {
      backgroundColor: '#fff',
      padding: theme.spacing(0, 3),
    },
  },
  completed: {
    textAlign: 'center',
    marginRight: theme.spacing(1),
    '& span': {
      backgroundColor: '#fff',
      padding: theme.spacing(0, 3),
    },
  },
}))

type NextActivityProps = {
  dayPxWidth: number
  completionStatus: ProgressionStatus
  info?: AdherenceSessionInfo
}

const NextActivity: FunctionComponent<NextActivityProps> = ({
  dayPxWidth,
  info,
  completionStatus,
}) => {
  const classes = {...useCommonStyles(), ...useStyles()}
  return (
    <div key={`next_activity`} className={classes.sessionRow}>
      <Box key="label" width={theme.spacing(11)}>
        {info ? (
          <Arrow style={{transform: 'scaleX(-1)'}} />
        ) : completionStatus === 'done' ? (
          'Completed'
        ) : (
          ''
        )}
      </Box>
      <div
        className={clsx(
          info || completionStatus !== 'done'
            ? classes.nextActivity
            : classes.completed
        )}
        style={{
          width: `${dayPxWidth * 7}px`,
          height: '20px',
        }}>
        {info ? (
          <span>
            Up Next: {info.sessionName} on{' '}
            {new Date(info.startDate).toLocaleDateString()}
          </span>
        ) : completionStatus === 'done' ? (
          <Celebration />
        ) : (
          <span>Not started</span>
        )}
      </div>
      <Box
        key="adherence"
        style={{borderRight: 'none'}}
        className={classes.dayCell}>
        {' '}
        -
      </Box>
    </div>
  )
}

export default NextActivity
