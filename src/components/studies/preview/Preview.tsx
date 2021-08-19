import {Box, Button, Divider, FormControl, FormLabel} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React, {ReactNode, useEffect} from 'react'
import {ErrorBoundary, useErrorHandler} from 'react-error-boundary'
import appStoreBtn from '../../../assets/preview/appStoreBtn.png'
import googlePlayBtn from '../../../assets/preview/googlePlayBtn.png'
import PhoneImg from '../../../assets/preview/preview_phone.svg'
import {ReactComponent as PlayImg} from '../../../assets/preview/preview_play.svg'
import SampleAssessmentDataImg from '../../../assets/preview/sample_assessment_data.svg'
import ParticipantService from '../../../services/participants.service'
import {
  latoFont,
  poppinsFont,
  ThemeType,
  playfairDisplayFont,
} from '../../../style/theme'
import {StudySession} from '../../../types/scheduling'
import {Assessment} from '../../../types/types'
import AssessmentSmall from '../../assessments/AssessmentSmall'
import {ErrorFallback, ErrorHandler} from '../../widgets/ErrorHandler'
import {MTBHeadingH1, MTBHeadingH2} from '../../widgets/Headings'
import {SimpleTextInput, PrevButton} from '../../widgets/StyledComponents'
import Utility from '../../../helpers/utility'
import MedicalIcon from '../../../assets/preview/reminder_of_use_medical_icon.svg'
import AuthorizedIcon from '../../../assets/preview/reminder_of_use_authorization_icon.svg'
import ProtectionIcon from '../../../assets/preview/reminder_of_use_protect_icon.svg'
import ScheduleSessionsIcon from '../../../assets/preview/schedule_session_icon_no_padding.svg'
import LinkIcon from '../../../assets/link_icon.svg'
import clsx from 'clsx'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    backgroundColor: '#f7f7f7',
    padding: theme.spacing(0, 6, 7, 6),
    textAlign: 'left',
    position: 'relative',
  },
  phone: {
    width: '145px',
    height: '275px',
    marginRight: '64px',
    textAlign: 'left',
    flexShrink: 0,
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#fff',
    padding: '4px 12px 11px 10px',
    backgroundImage: 'url(' + PhoneImg + ')',
    '& > div:first-child': {
      backgroundColor: '#fff',
      borderRadius: '16px',
      display: 'flex',
      width: '100%',
      height: '261px',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& > div:first-child >  div': {
      borderRadius: '50%',
      border: '3px solid black',
      backgroundColor: '#FDE93D',
      width: '70px',
      height: '70px',
      paddingTop: '17px',
      paddingLeft: '22px',
    },
  },
  mtbApp: {
    marginTop: theme.spacing(3),
    fontFamily: poppinsFont,
    fontWeight: 600,
    fontSize: '12px',
    textAlign: 'center',
  },
  inputs: {
    display: 'block',
    '& .MuiFormControl-root': {
      flexDirection: 'row',
      alignItems: 'center',
    },
    '& label': {
      marginTop: theme.spacing(2),
      width: theme.spacing(17),
      flexShrink: 0,
    },
  },
  storeButtons: {
    display: 'flex',
    marginTop: theme.spacing(5),
    '& button:first-child': {
      padding: 0,
      marginRight: theme.spacing(2),
    },
  },
  divider: {
    width: '100%',
    marginTop: theme.spacing(7.5),
    marginBottom: theme.spacing(2.5),
  },
  sampleAssessmentDataText: {
    fontFamily: poppinsFont,
    fontSize: '18px',
    lineHeight: '27px',
    width: '110px',
    marginLeft: theme.spacing(1.5),
  },
  assessmentsText: {
    marginTop: theme.spacing(-0.25),
    fontFamily: latoFont,
    fontSize: '15px',
    marginBottom: theme.spacing(5),
  },
  assessmentImg: {
    height: '19px',
    width: '24px',
    marginTop: theme.spacing(0.75),
  },
  reminderOfUseIcon: {
    marginBottom: theme.spacing(2),
    height: '100px',
    width: '80px',
  },
  reminderOfUseText: {
    fontFamily: latoFont,
    fontSize: '15px',
    lineHeight: '18px',
  },
  reminderOfUseHeader: {
    fontFamily: playfairDisplayFont,
    fontSize: '21px',
    fontStyle: 'italic',
  },
  scheduleSessionReminderContainer: {
    width: '450px',
    height: '82px',
    border: '2px solid black',
    display: 'flex',
    marginBottom: theme.spacing(4.5),
    padding: theme.spacing(3, 4.25, 3, 4.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleSessionsButton: {
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '0px',
    textDecoration: 'underline',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    fontSize: '15px',
    fontFamily: latoFont,
    marginTop: theme.spacing(-0.5),
  },
  scheduleSessionsIcon: {
    height: '16px',
    width: '16px',
    marginBottom: theme.spacing(-0.25),
  },
  tosContainer: {
    position: 'absolute',
    top: '-60px',
    right: '100px',
  },
  tosButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
  },
  linkIcon: {
    marginRight: theme.spacing(1.5),
    color: 'black',
    height: '22px',
  },
  tosText: {
    fontFamily: latoFont,
    fontSize: '16px',
    marginTop: theme.spacing(-0.25),
    fontWeight: 'bold',
  },
}))

export interface PreviewProps {
  children?: ReactNode
  studyId: string
  token: string
  scheduleSessions: StudySession[]
}

const Reminder: React.FunctionComponent<{text: string; img: string}> = ({
  text,
  img,
}) => {
  const classes = useStyles()
  return (
    <Box textAlign="center" width="200px">
      <img className={classes.reminderOfUseIcon} src={img}></img>
      <p className={classes.reminderOfUseText}>{text}</p>
    </Box>
  )
}

const Preview: React.FunctionComponent<PreviewProps> = ({
  children,
  studyId,
  token,
  scheduleSessions,
}: PreviewProps) => {
  const classes = useStyles()
  const [testParticipantId, setTestParticipantId] = React.useState('')

  const [uniqueAssessments, setUniqueAssessments] = React.useState<
    Assessment[]
  >([])

  const handleError = useErrorHandler()

  const getTestParticipantId = async () => {
    try {
      const testId = await ParticipantService.addTestParticipant(studyId, token)
      setTestParticipantId(testId)
    } catch (e) {
      handleError(e!)
    }
  }

  useEffect(() => {
    let allAssessments: Assessment[] = []
    for (const session of scheduleSessions) {
      if (!session.assessments) continue
      allAssessments = allAssessments.concat(session.assessments)
    }
    const uniqueAssessments = allAssessments.reduce((arr, assessment) => {
      const assessmentExists =
        arr.find(el => el.title === assessment.title) !== undefined
      if (assessmentExists) return arr
      return [...arr, assessment]
    }, [] as Assessment[])
    setUniqueAssessments(uniqueAssessments)
  }, [])

  const text = [
    'Only use the Mobile Toolbox for authorized purposes.',
    'Respect and protect data, participant’s privacy and data confidentiality.',
    'Not attempt to use or represent the use of Mobile Toolbox for medical care.',
  ]

  const icons = [AuthorizedIcon, ProtectionIcon, MedicalIcon]

  return (
    <>
      <Box className={classes.tosContainer}>
        {!testParticipantId && (
          <PrevButton
            className={classes.tosButton}
            variant="outlined"
            color="primary"
            onClick={() => {}}>
            <img className={classes.linkIcon} src={LinkIcon}></img>
            <Box className={classes.tosText}>Full terms of service</Box>
          </PrevButton>
        )}
      </Box>
      {!testParticipantId ? (
        <div className={classes.root}>
          <Box
            textAlign="center"
            display="flex"
            flexDirection="column"
            alignItems="center">
            <MTBHeadingH1 className={classes.reminderOfUseHeader}>
              Reminder of use:
            </MTBHeadingH1>
            <Box
              display="flex"
              justifyContent="space-between"
              mt={10}
              mb={4}
              alignItems="center"
              width="100%">
              {text.map((text, index) => (
                <Reminder key={index} text={text} img={icons[index]}></Reminder>
              ))}
            </Box>
            <Box
              className={clsx(
                classes.scheduleSessionReminderContainer,
                classes.reminderOfUseText
              )}>
              <Box>
                Please remember to customize your study schedule on&nbsp;
                <img
                  className={classes.scheduleSessionsIcon}
                  src={ScheduleSessionsIcon}></img>
                &nbsp;
                <Button
                  href="scheduler"
                  className={classes.scheduleSessionsButton}>
                  Schedule Sessions
                </Button>
                &nbsp; page before previewing your app.
              </Box>
            </Box>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={ErrorHandler}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => getTestParticipantId()}>
                Generate Preview
              </Button>
            </ErrorBoundary>
          </Box>
        </div>
      ) : (
        <div className={classes.root}>
          <Box width="548px" mx="auto">
            <Box display="flex" width="100%">
              <div className={classes.phone}>
                <div>
                  <div>
                    <PlayImg />
                  </div>
                </div>
                <div className={classes.mtbApp}> Mobile Toolbox App</div>
              </div>
              <div>
                <MTBHeadingH2>
                  {' '}
                  Preview your study on a mobile device
                </MTBHeadingH2>
                <p>Your draft study has been generated.</p>
                <p>
                  Please download and/or open the Mobile Toolbox App and login
                  with the following credentials below.
                </p>
                <p>
                  This login is only for preview purposes. There are no scores
                  or data associated with this preview.
                </p>
                <p>
                  To view a sample scoring for each assessment please view the
                  Assessment Library.
                </p>
                <div className={classes.storeButtons}>
                  <Button>
                    <img src={appStoreBtn} />
                  </Button>
                  <Button>
                    <img src={googlePlayBtn} />
                  </Button>
                </div>
                <div className={classes.inputs}>
                  <FormControl component="div">
                    <FormLabel component="label">Study ID:</FormLabel>
                    <SimpleTextInput
                      multiline={false}
                      fullWidth={true}
                      value={Utility.formatStudyId(studyId)}
                      readOnly></SimpleTextInput>
                  </FormControl>

                  <FormControl component="div">
                    <FormLabel component="label">Temporary ID:</FormLabel>
                    <SimpleTextInput
                      multiline={false}
                      fullWidth={true}
                      readOnly={true}
                      value={testParticipantId}></SimpleTextInput>
                  </FormControl>
                </div>
              </div>
            </Box>
            <Divider className={classes.divider} />
            <Box
              width="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-between">
              <Box display="flex" flexDirection="row" alignItems="flex-start">
                <img
                  src={SampleAssessmentDataImg}
                  className={classes.assessmentImg}></img>
                <Box className={classes.sampleAssessmentDataText}>
                  Sample Assessment Data
                </Box>
              </Box>
              <Box width="300px">
                <p className={classes.assessmentsText}>
                  There are no scores or data associated with this preview.
                  <br />
                  <br />
                  To view sample data from the assessments in your study, click
                  on the assessments below:{' '}
                </p>
                {uniqueAssessments.map((assessment, index) => {
                  return (
                    <Box onClick={() => {}} mb={2}>
                      <AssessmentSmall assessment={assessment} key={index} />
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
        </div>
      )}
    </>
  )
}
export default Preview
