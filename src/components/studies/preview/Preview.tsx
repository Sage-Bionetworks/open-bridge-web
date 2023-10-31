import appStoreBtn from '@assets/preview/appStoreBtn.png'
import googlePlayBtn from '@assets/preview/googlePlayBtn.png'
import PhoneImg from '@assets/preview/preview_phone.svg'
import {ReactComponent as PhoneImgAssmnt} from '@assets/preview/preview_phone_assessment.svg'
import AuthorizedIcon from '@assets/preview/reminder_of_use_authorization_icon.svg'
import MedicalIcon from '@assets/preview/reminder_of_use_medical_icon.svg'
import ProtectionIcon from '@assets/preview/reminder_of_use_protect_icon.svg'
import SampleAssessmentDataImg from '@assets/preview/sample_assessment_data.svg'
import ScheduleSessionsIcon from '@assets/preview/schedule_session_icon_no_padding.svg'
import QrCode from '@assets/qr_code.png'
import AssessmentSmall from '@components/assessments/AssessmentSmall'
import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import {ErrorFallback, ErrorHandler} from '@components/widgets/ErrorHandler'
import {SimpleTextInput, StyledLink} from '@components/widgets/StyledComponents'
import {useUserSessionDataState} from '@helpers/AuthContext'
import Utility from '@helpers/utility'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormLabel,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import ParticipantService from '@services/participants.service'
import {latoFont, playfairDisplayFont, poppinsFont, theme, ThemeType} from '@style/theme'
import {Assessment} from '@typedefs/types'
import clsx from 'clsx'
import React, {useEffect} from 'react'
import {ErrorBoundary, useErrorHandler} from 'react-error-boundary'
import {NavLink} from 'react-router-dom'
import {useSchedule} from '../../../services/scheduleHooks'
import {BuilderWrapper} from '../StudyBuilder'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    /*  padding: theme.spacing(0, 6, 7, 6),
    textAlign: 'left',
    position: 'relative',

    '&$assessmentDemo': {
      backgroundColor: 'inherit',
    },*/
  },

  phone: {
    width: '145px',
    height: '275px',
    marginRight: '64px',
    textAlign: 'left',
    flexShrink: 0,

    padding: '4px 12px 11px 0px',
  },
  mtbApp: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    fontFamily: poppinsFont,
    fontWeight: 600,
    fontSize: '12px',
    textAlign: 'center',
  },

  storeButtons: {
    display: 'flex',
    justifyContent: 'space-between',

    marginTop: theme.spacing(5),
    '& button:first-child': {
      padding: 0,
      marginRight: theme.spacing(2),
    },
    marginBottom: theme.spacing(1),
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
  },
  remindersOfUseContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(4),
    alignItems: 'flex-start',
    width: '100%',
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

  tosContainerAssessment: {
    position: 'absolute',
    top: '8px',
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

  idLabel: {
    fontWeight: 'bold',
  },
  assessmentDemo: {},
}))

export interface PreviewProps {
  id: string
  isAssessmentDemo?: boolean
  children?: React.ReactNode
}

const Reminder: React.FunctionComponent<{text: string; img: string}> = ({text, img}) => {
  const classes = useStyles()
  return (
    <Box textAlign="center" width="200px">
      <img className={classes.reminderOfUseIcon} src={img} alt="reminder of use"></img>
      <p className={classes.reminderOfUseText}>{text}</p>
    </Box>
  )
}

const PreviewAssessments: React.FunctionComponent<{
  studyId: string
}> = ({studyId}) => {
  const classes = useStyles()
  const {data: schedule} = useSchedule(studyId)

  const [uniqueAssessments, setUniqueAssessments] = React.useState<Assessment[]>([])

  useEffect(() => {
    let allAssessments: Assessment[] = []
    if (!schedule) {
      return
    }
    for (const session of schedule.sessions) {
      if (!session.assessments) continue
      allAssessments = allAssessments.concat(session.assessments)
    }
    const uniqueAssessments = allAssessments.reduce((arr, assessment) => {
      const assessmentExists = arr.find(el => el.title === assessment.title) !== undefined
      if (assessmentExists) return arr
      return [...arr, assessment]
    }, [] as Assessment[])
    setUniqueAssessments(uniqueAssessments)
  }, [schedule])

  return (
    <>
      <Divider className={classes.divider} />
      <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between">
        <Box display="flex" flexDirection="row" alignItems="flex-start">
          <img src={SampleAssessmentDataImg} className={classes.assessmentImg} alt="sample assessment data"></img>
          <Box className={classes.sampleAssessmentDataText}>Sample Assessment Data</Box>
        </Box>
        <Box width="300px">
          <p className={classes.assessmentsText}>
            There are no scores or data associated with this preview.
            <br />
            <br />
            To view sample data from the assessments in your study, click on the assessments below:{' '}
          </p>
          {uniqueAssessments.map((assessment, index) => {
            return (
              <Box onClick={() => {}} mb={2}>
                <AssessmentSmall isReadOnly={true} assessment={assessment} key={index} />
              </Box>
            )
          })}
        </Box>
      </Box>
    </>
  )
}

const PreviewIdGenerated: React.FunctionComponent<{
  testParticipantId: string
  studyId: string
  isAssessmentDemo?: boolean
  children?: React.ReactNode
}> = ({testParticipantId, studyId, isAssessmentDemo, children}) => {
  const classes = useStyles()
  const studyDemoIntro = (
    <Box sx={{textAlign: 'left', mb: 4}}>
      <Typography variant="h2" sx={{mb: 3}}>
        Preview Your Study
      </Typography>
      <Typography variant="h5" paragraph>
        Your draft study has been generated.
      </Typography>
      <Typography variant="h5">
        Please download and/or open the <strong>Open Bridge App</strong> and login with the following credentials
        below.
      </Typography>
    </Box>
  )

  const assessmentDemoIntro = (
    <>
      <Typography variant="h3">Open Bridge Assessment Demo</Typography>
      <Typography variant="h5">
        To try out our assessments from our library, please download the <strong>Open Bridge App</strong> and enter
        your personalized codes below to log in.
      </Typography>{' '}
    </>
  )

  return (
    <div className={clsx(classes.root, isAssessmentDemo && classes.assessmentDemo)}>
      <Box sx={isAssessmentDemo ? {width: '548px'} : {}} mx="auto">
        {!isAssessmentDemo && <Box> {studyDemoIntro}</Box>}
        <Box sx={{display: 'flex', width: '100%'}}>
          {isAssessmentDemo ? (
            <div className={classes.phone}>
              <PhoneImgAssmnt />
            </div>
          ) : (
            <>
              <Box
                sx={{
                  backgroundImage: `url(${PhoneImg})`,
                  backgroundRepeat: 'no-repeat',
                  width: '220px',
                  height: '420px',
                  marginRight: theme.spacing(6),
                }}>
                <>
                  <Box sx={{my: 3, mx: 'auto', p: 2, textAlign: 'center'}}>
                    <img src={QrCode} width="120px" alt="qr code" />{' '}
                  </Box>

                  <a
                    href="https://apps.apple.com/us/app/mobile-toolbox-app/id1578358408"
                    target="_blank"
                    rel="noreferrer">
                    <img src={appStoreBtn} alt="app store" />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=org.sagebionetworks.research.mobiletoolbox.app"
                    target="_blank"
                    rel="noreferrer">
                    <img src={googlePlayBtn} alt="google play" />
                  </a>
                </>
              </Box>
            </>
          )}
          <Box sx={{textAlign: isAssessmentDemo ? 'center' : 'left'}}>
            {isAssessmentDemo && (
              <>
                {assessmentDemoIntro}
                <Box my={3} mx="auto" p={2} bgcolor="white" textAlign="center">
                  <img src={QrCode} width="95px" alt="qr code" />
                </Box>
                <div className={classes.storeButtons}>
                  <a
                    href="https://apps.apple.com/us/app/mobile-toolbox-app/id1578358408"
                    target="_blank"
                    rel="noreferrer">
                    <img src={appStoreBtn} alt="app store" />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=org.sagebionetworks.research.mobiletoolbox.app"
                    target="_blank"
                    rel="noreferrer">
                    <img src={googlePlayBtn} alt="google play" />
                  </a>
                </div>
              </>
            )}
            <Typography variant="h3" sx={{mt: isAssessmentDemo ? 2 : 9}}>
              App Login Information*
            </Typography>
            <Typography paragraph variant="subtitle2">
              *This login is only for preview purposes and allows you to view the study as a participant would.
            </Typography>
            <Box
              sx={{
                display: isAssessmentDemo ? 'block' : 'flex',
                textAlign: 'left',
                '& .MuiFormControl-root': {
                  flexDirection: isAssessmentDemo ? 'row' : 'column',
                  alignItems: isAssessmentDemo ? 'center' : 'flex-start',
                  marginTop: isAssessmentDemo ? 2 : 0.5,
                  '&:first-of-type': {
                    marginRight: theme.spacing(3),
                  },
                },
                '& label': {
                  marginTop: theme.spacing(2),
                  width: theme.spacing(17),
                  flexShrink: 0,
                },
                marginTop: theme.spacing(-1.5),
              }}>
              <FormControl component="div">
                <FormLabel component="label" className={classes.idLabel}>
                  Study ID:
                </FormLabel>
                <SimpleTextInput
                  multiline={false}
                  fullWidth={true}
                  value={Utility.formatStudyId(studyId)}
                  $readOnly></SimpleTextInput>
              </FormControl>

              <FormControl component="div">
                <FormLabel component="label" className={classes.idLabel}>
                  Participant ID:
                </FormLabel>
                <SimpleTextInput
                  multiline={false}
                  fullWidth={true}
                  $readOnly={true}
                  value={testParticipantId}></SimpleTextInput>
              </FormControl>
            </Box>
          </Box>
        </Box>
        {children && children}
      </Box>
    </div>
  )
}

const PreviewIntroScreen: React.FunctionComponent<{
  isAssessmentDemo?: boolean
  onGetParticipantId: Function
}> = ({onGetParticipantId, isAssessmentDemo}) => {
  const classes = useStyles()
  const {token} = useUserSessionDataState()

  const text = [
    'Only use the Open Bridge for authorized purposes.',
    'Respect and protect data, participant’s privacy and data confidentiality.',
    'Not attempt to use or represent the use of Open Bridge for medical care.',
  ]

  const icons = [AuthorizedIcon, ProtectionIcon, MedicalIcon]

  return (
    <Dialog open={true} maxWidth="md" fullWidth={true}>
      <DialogTitleWithClose onCancel={() => onGetParticipantId()} title={'Reminder of Use'}></DialogTitleWithClose>
      <DialogContent>
        <Box textAlign="center" display="flex" flexDirection="column" alignItems="center">
          <Box className={classes.remindersOfUseContainer}>
            {text.map((text, index) => (
              <Reminder key={index} text={text} img={icons[index]}></Reminder>
            ))}
          </Box>
          {!isAssessmentDemo && (
            <Box className={clsx(classes.scheduleSessionReminderContainer, classes.reminderOfUseText)}>
              <Box>
                Please remember to customize your study schedule on&nbsp;
                <img className={classes.scheduleSessionsIcon} src={ScheduleSessionsIcon} alt="schedule session"></img>
                &nbsp;
                <NavLink to={'scheduler'} className={classes.scheduleSessionsButton}>
                  Schedule Sessions
                </NavLink>
                &nbsp; page before previewing your app.
              </Box>
            </Box>
          )}
        </Box>
        <Box>
          <StyledLink
            to="/terms_of_service.pdf"
            target="_blank"
            sx={{fontSize: '16px', display: 'block', textAlign: 'center', fontWeight: 700}}>
            View Full Terms of Service
          </StyledLink>
        </Box>
      </DialogContent>
      <DialogActions>
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={ErrorHandler}>
          <Button color="primary" variant="contained" onClick={() => onGetParticipantId()}>
            Got It!
          </Button>
        </ErrorBoundary>
      </DialogActions>
    </Dialog>
  )
}

const Preview: React.FunctionComponent<PreviewProps> = ({id, isAssessmentDemo, children}: PreviewProps) => {
  const {token, demoExternalId} = useUserSessionDataState()

  const [testParticipantId, setTestParticipantId] = React.useState('')

  const handleError = useErrorHandler()

  const getTestParticipantId = async () => {
    let newId = ''
    try {
      let testExternalId = ''
      if (isAssessmentDemo) {
        if (!demoExternalId) {
          newId = await ParticipantService.signUpForAssessmentDemoStudy(token!)
          /*throw Error(
            'The logged in user is not enrolled in demo study. \n You might need to have your administrator remove and re-add them '
          )*/
        }
        testExternalId = (demoExternalId || newId).split(':')[0]
      } else {
        testExternalId = await ParticipantService.addPreviewTestParticipant(id, token!)
      }
      setTestParticipantId(testExternalId)
    } catch (e) {
      handleError(e!)
    }
  }

  return (
    <>
      {!testParticipantId && (
        <PreviewIntroScreen isAssessmentDemo={isAssessmentDemo} onGetParticipantId={() => getTestParticipantId()} />
      )}

      {testParticipantId &&
        (!isAssessmentDemo ? (
          <>
            <BuilderWrapper sectionName="Preview Your  Study">
              <PreviewIdGenerated isAssessmentDemo={false} testParticipantId={testParticipantId} studyId={id}>
                {/* agendel: we are hiding this for now
            !isAssessmentDemo && false  <PreviewAssessments studyId={id} />*/}
              </PreviewIdGenerated>
            </BuilderWrapper>
            {children}
          </>
        ) : (
          <PreviewIdGenerated
            isAssessmentDemo={true}
            testParticipantId={testParticipantId}
            studyId={id}></PreviewIdGenerated>
        ))}
    </>
  )
}
export default Preview
