import ClockIcon from '@assets/clock.svg'
import {Box, makeStyles} from '@material-ui/core'
import {latoFont} from '@style/theme'
import moment from 'moment'
import React from 'react'
import {useStyles as SharedSchedulerStyles} from '../Scheduler'
import {getFormattedTimeDateFromPeriodString} from '../utility'

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'white',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '164px',
  },
  topLevel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing(3),
    fontFamily: latoFont,
    fontSize: '16px',
  },
  timesContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '190px',
    fontSize: '16px',
  },
}))

type ReadOnlyAssessmentWindowProps = {
  index: number
  startTime: string
  expireAfter: string
}

const ReadOnlyAssessmentWindow: React.FunctionComponent<ReadOnlyAssessmentWindowProps> =
  ({index, startTime, expireAfter}) => {
    const classes = useStyles()
    const sharedSchedulerStyles = SharedSchedulerStyles()
    const start = moment(startTime, 'HH:mm').format('h:mm a')
    return (
      <Box className={classes.container}>
        <Box className={classes.topLevel}>
          <Box alignSelf="flex-start">{index}.</Box>
          <img src={ClockIcon} style={{height: '22px', width: '22px'}}></img>
        </Box>
        <Box className={classes.timesContainer}>
          <Box className={sharedSchedulerStyles.row} mb={2}>
            <Box>Start:</Box> <strong>{start}</strong>
          </Box>
          <Box className={sharedSchedulerStyles.row}>
            <Box>Expire After:</Box>{' '}
            <strong>{getFormattedTimeDateFromPeriodString(expireAfter)}</strong>
          </Box>
        </Box>
      </Box>
    )
  }

export default ReadOnlyAssessmentWindow
