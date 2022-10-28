import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React from 'react'
import LiveCard from '../../../assets/participants/participant_manager_live_card_draft_icon.svg'
import RocketIcon from '../../../assets/participants/participant_manager_rocket_icon.svg'
import DraftCard from '../../../assets/participants/participant_manager_study_card_draft_icon.svg'
import RightArrow from '../../../assets/participants/right_arrow.svg'
import {latoFont} from '../../../style/theme'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    height: '100vh',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4, 8),
  },
  rocketIcon: {
    width: '160px',
    height: '140px',
  },
  text: {
    fontFamily: latoFont,
    fontSize: '15px',
    lineHeight: '21px',
  },
  bottomText: {
    marginTop: theme.spacing(3.75),
    maxWidth: '250px',
    textAlign: 'center',
  },
  imageCardContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginTop: theme.spacing(4.5),
  },
}))

const ParticipantManagerPlaceholder: React.FunctionComponent = () => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <Box className={classes.innerContainer}>
        <img className={classes.rocketIcon} src={RocketIcon} alt=" Please check back after your study launches"></img>
        <Box className={classes.text}>Please check back after your study launches.</Box>
        <Box className={clsx(classes.text, classes.bottomText)}>
          This tab will be available once your study is officially live.
        </Box>
        <Box className={classes.imageCardContainer}>
          <img src={DraftCard} style={{marginRight: '25px'}} alt="draft"></img>
          <img src={RightArrow} alt="arrow"></img>
          <img src={LiveCard} style={{marginLeft: '25px'}} alt="live"></img>
        </Box>
      </Box>
    </Box>
  )
}

export default ParticipantManagerPlaceholder
