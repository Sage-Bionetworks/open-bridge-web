import {Button, Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {RouteComponentProps} from 'react-router'
import confetti from '../../../assets/launch/confetti.svg'
import {
  StudyInfoData,
  useStudyInfoDataState,
} from '../../../helpers/StudyInfoContext'
import {
  poppinsFont,
  ThemeType,
  latoFont,
  playfairDisplayFont,
} from '../../../style/theme'
import {MTBHeadingH1} from '../../widgets/Headings'
import LiveIcon from '../../../assets/live_study_icon.svg'
import clsx from 'clsx'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
    backgroundImage: 'url(' + confetti + ')',
    backgroundColor: 'black',
    backgroundPosition: 'center',
    width: '1000px',
    height: '100%',
    minHeight: '650px',
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
    const builderInfo: StudyInfoData = useStudyInfoDataState()
    if (!builderInfo.study) {
      return <></>
    }
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <div className={classes.root}>
          <div style={{marginLeft: '-50px'}}>
            <MTBHeadingH1 className={classes.congratsText}>
              Congratulations!
            </MTBHeadingH1>
            <MTBHeadingH1
              className={clsx(classes.congratsText, classes.liveText)}>
              {builderInfo.study.name} officially live!
            </MTBHeadingH1>
            <img src={LiveIcon} className={classes.liveButton}></img>
            <p className={classes.enrollmentText}>
              You may now enroll <br />
              participants to this study.
            </p>
            <Button
              color="secondary"
              href={'/studies/:id/participant-manager'.replace(
                ':id',
                builderInfo.study.identifier
              )}
              className={classes.enrollButton}>
              Enroll Participants
            </Button>
          </div>
        </div>
      </Box>
    )
  }

export default Live
