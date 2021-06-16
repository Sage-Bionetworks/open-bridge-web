import { Box, Button, FormControl, FormLabel, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { ReactNode, useEffect } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import appStoreBtn from '../../../assets/preview/appStoreBtn.png'
import googlePlayBtn from '../../../assets/preview/googlePlayBtn.png'
import PhoneImg from '../../../assets/preview/preview_phone.svg'
import SampleAssessmentDataImg from '../../../assets/preview/sample_assessment_data.svg'
import { ReactComponent as PlayImg } from '../../../assets/preview/preview_play.svg'
import ParticipantService from '../../../services/participants.service'
import { poppinsFont, ThemeType, latoFont } from '../../../style/theme'
import { ErrorFallback, ErrorHandler } from '../../widgets/ErrorHandler'
import { MTBHeadingH1, MTBHeadingH2 } from '../../widgets/Headings'
import { SimpleTextInput } from '../../widgets/StyledComponents'
import { Assessment } from '../../../types/types'
import { StudySession } from '../../../types/scheduling'
import AssessmentSmall from '../../assessments/AssessmentSmall'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    backgroundColor: '#fff',

    padding: theme.spacing(0, 6, 7, 6),
    textAlign: 'left',
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
}))

export interface PreviewProps {
  children?: ReactNode
  studyId: string
  token: string
  scheduleSessions: StudySession[]
}

const Reminder: React.FunctionComponent = ({}) => {
  return (
    <Box textAlign="center" width="154px">
      <Box
        width="154px"
        height="154px"
        borderRadius="50%"
        bgcolor="#ccc"
        mb={2}
      ></Box>
      <p>Key terms of agreemment summary goes here</p>
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
      const testId = await ParticipantService.addTestParticipantForPreview(
        studyId,
        token,
      )
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

  return (
    <>
      {!testParticipantId ? (
        <div className={classes.root}>
          <Box textAlign="center">
            <MTBHeadingH2> Preview your study on a mobile device</MTBHeadingH2>
            <MTBHeadingH1>Reminder of use:</MTBHeadingH1>
            <Box display="flex" justifyContent="space-between" mt={10} mb={8}>
              {[...Array(4)].map((_i, index) => (
                <Reminder key={index}></Reminder>
              ))}
            </Box>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={ErrorHandler}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={() => getTestParticipantId()}
              >
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
                      value={studyId}
                      readOnly
                    ></SimpleTextInput>
                  </FormControl>

                  <FormControl component="div">
                    <FormLabel component="label">Temporary ID:</FormLabel>
                    <SimpleTextInput
                      multiline={false}
                      fullWidth={true}
                      readOnly={true}
                      value={testParticipantId}
                    ></SimpleTextInput>
                  </FormControl>
                </div>
              </div>
            </Box>
            <Divider className={classes.divider} />
            <Box
              width="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box display="flex" flexDirection="row" alignItems="flex-start">
                <img
                  src={SampleAssessmentDataImg}
                  className={classes.assessmentImg}
                ></img>
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
