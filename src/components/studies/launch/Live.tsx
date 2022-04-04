import {useStudy} from '@components/studies/studyHooks'
import {Button} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx'
import React from 'react'
import {RouteComponentProps} from 'react-router'
import {useParams} from 'react-router-dom'
import confetti from '../../../assets/launch/confetti.svg'
import LiveIcon from '../../../assets/live_study_icon.svg'
import {
  latoFont,
  playfairDisplayFont,
  poppinsFont,
  ThemeType,
} from '../../../style/theme'
import constants from '../../../types/constants'
import {MTBHeadingH1} from '../../widgets/Headings'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'black',
    minHeight: 'calc(100vh - 76px)',
  },
  inner: {
    padding: theme.spacing(3),
    backgroundImage: 'url(' + confetti + ')',
    backgroundColor: 'black',
    backgroundPosition: 'top center',
    width: '1000px',
    height: '100%',
    margin: theme.spacing(7.5, 0, 0, 0),
    backgroundRepeat: 'no-repeat',
    paddingTop: theme.spacing(29),
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  congratsText: {
    color: '#fff',
    marginBottom: theme.spacing(4),
    fontWeight: 'bold',
    fontSize: '22px',
    fontStyle: 'italic',
    fontFamily: playfairDisplayFont,
  },
  enrollmentText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: poppinsFont,
    fontStyle: '14px',
    wordWrap: 'break-word',
  },
  enrollButton: {
    backgroundColor: '#fff',
    color: '#000',
    marginTop: theme.spacing(3),
    borderRadius: '0',
    fontFamily: latoFont,
    fontSize: '14px',
    width: '145px',
    height: '48px',
    '&:hover': {
      backgroundColor: 'lightgray',
    },
  },
  liveButton: {
    height: '26px',
    width: '76px',
    marginBottom: theme.spacing(2),
  },
  liveText: {
    fontWeight: 'normal',
    marginBottom: theme.spacing(2.25),
    maxWidth: '400px',
  },
}))

const Live: React.FunctionComponent<RouteComponentProps> =
  ({}: RouteComponentProps) => {
    const classes = useStyles()
    let {id} = useParams<{
      id: string
    }>()

    const {data: study, error: studyError} = useStudy(id)
    if (!study) {
      return <></>
    }
    return (
      <div className={classes.root}>
        <div className={classes.inner}>
          <div style={{marginLeft: '-50px'}}>
            <MTBHeadingH1 className={classes.congratsText}>
              Congratulations!
            </MTBHeadingH1>
            <MTBHeadingH1
              className={clsx(classes.congratsText, classes.liveText)}>
              {study.name} officially live!
            </MTBHeadingH1>
            <img src={LiveIcon} className={classes.liveButton}></img>
            <p className={classes.enrollmentText}>
              You may now enroll <br />
              participants to this study.
            </p>
            <Button
              color="secondary"
              href={constants.restrictedPaths.PARTICIPANT_MANAGER.replace(
                ':id',
                study.identifier
              )}
              className={classes.enrollButton}>
              Enroll Participants
            </Button>
          </div>
        </div>
      </div>
    )
  }

export default Live
