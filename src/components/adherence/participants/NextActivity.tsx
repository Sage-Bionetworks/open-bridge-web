import {ReactComponent as Celebration} from '@assets/adherence/celebration_row.svg'
import {ReactComponent as Arrow} from '@assets/arrow_long.svg'
import {Box, makeStyles} from '@material-ui/core'
import {theme} from '@style/theme'
import {AdherenceSessionInfo, ProgressionStatus} from '@typedefs/types'
import moment from 'moment'
import React, {FunctionComponent} from 'react'
import {useCommonStyles} from '../styles'

export const useStyles = makeStyles(theme => ({
  nextActivity: {
    textAlign: 'center',
    // marginRight: theme.spacing(1),
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

type NoRowsProps = {
  dayPxWidth: number
  completionStatus: ProgressionStatus
  nextActivity?: AdherenceSessionInfo
}

const NoActivities: FunctionComponent<{
  rowStyle: React.CSSProperties
  isCompleted: boolean
}> = ({rowStyle, isCompleted}) => {
  const classes = {...useCommonStyles(), ...useStyles()}
  return (
    <div
      className={isCompleted ? classes.completed : classes.nextActivity}
      style={rowStyle}>
      {isCompleted ? (
        <Celebration />
      ) : (
        <span>
          <i>continued from previous week</i>
        </span>
      )}
    </div>
  )
}

const NoRows: FunctionComponent<NoRowsProps> = ({
  dayPxWidth,
  nextActivity,
  completionStatus,
}) => {
  const classes = {...useCommonStyles(), ...useStyles()}
  const leftMargin = 8
  const rowStyle: React.CSSProperties = {
    width: `${dayPxWidth * 7 + leftMargin}px`,
    height: '20px',
  }

  let upNext = ''
  if (nextActivity) {
    upNext = nextActivity.studyBurstNum
      ? `Week ${nextActivity.weekInStudy}/Burst ${nextActivity.studyBurstNum}`
      : `Week ${nextActivity.weekInStudy}/Burst ${nextActivity.sessionName}`
    upNext = `${upNext} on ${moment(nextActivity.startDate).format(
      'MM/DD/YYYY'
    )}`
  }

  return (
    <div key={`next_activity`} className={classes.sessionRow}>
      <Box key="label" width={theme.spacing(17 - leftMargin / 8)}>
        {completionStatus === 'in_progress' ? (
          <Arrow style={{transform: 'scaleX(-1)'}} />
        ) : completionStatus === 'done' ? (
          'Completed'
        ) : (
          ''
        )}
      </Box>
      {nextActivity ? (
        <div className={classes.nextActivity} style={rowStyle}>
          <span>Up Next: {upNext}</span>
        </div>
      ) : (
        <NoActivities
          isCompleted={completionStatus === 'done'}
          rowStyle={rowStyle}
        />
      )}
    </div>
  )
}

export default NoRows
