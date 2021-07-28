import React from 'react'
import {Box, makeStyles} from '@material-ui/core'
import {latoFont} from '../../../../style/theme'
import ClockIcon from '../../../../assets/clock.svg'
import moment from 'moment'
import {HDWMEnum} from '../../../../types/scheduling'
import {getTimeExpiredAfter} from '../utility'

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
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))

type ReadOnlyAssessmentWindowProps = {
  index: number
  startTime: string
  expireAfter: string
}

const ReadOnlyAssessmentWindow: React.FunctionComponent<ReadOnlyAssessmentWindowProps> = ({
  index,
  startTime,
  expireAfter,
}) => {
  const classes = useStyles()
  const start = moment(startTime, 'HH:mm').format('h:mm a')
  const numTime = getTimeExpiredAfter(expireAfter)
  const expireAfterTimeUnit = expireAfter[
    expireAfter.length - 1
  ] as keyof typeof HDWMEnum
  return (
    <Box className={classes.container}>
      <Box className={classes.topLevel}>
        <Box alignSelf="flex-start">{index}.</Box>
        <img src={ClockIcon} style={{height: '22px', width: '22px'}}></img>
      </Box>
      <Box className={classes.timesContainer}>
        <Box className={classes.row} mb={2}>
          <Box>Start:</Box> <strong>{start}</strong>
        </Box>
        <Box className={classes.row}>
          <Box>Expire After:</Box>{' '}
          <strong>{`${numTime} ${HDWMEnum[expireAfterTimeUnit]}`}</strong>
        </Box>
      </Box>
    </Box>
  )
}

export default ReadOnlyAssessmentWindow
