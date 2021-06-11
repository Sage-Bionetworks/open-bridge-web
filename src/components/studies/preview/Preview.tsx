import { Box, Button, FormControl, FormLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { ReactNode } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import appStoreBtn from '../../../assets/preview/appStoreBtn.png'
import googlePlayBtn from '../../../assets/preview/googlePlayBtn.png'
import PhoneImg from '../../../assets/preview/preview_phone.svg'
import { ReactComponent as PlayImg } from '../../../assets/preview/preview_play.svg'
import ParticipantService from '../../../services/participants.service'
import { poppinsFont, ThemeType } from '../../../style/theme'
import { ErrorFallback, ErrorHandler } from '../../widgets/ErrorHandler'
import { MTBHeadingH1, MTBHeadingH2 } from '../../widgets/Headings'
import { SimpleTextInput } from '../../widgets/StyledComponents'
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
}))

export interface PreviewProps {
  children?: ReactNode
  studyId: string
  token: string
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
}: PreviewProps) => {
  const classes = useStyles()
  const [testParticipantId, setTestParticipantId] = React.useState('')

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
          <Box display="flex" width="548px" mx="auto">
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
                This login is only for preview purposes. There are no scores or
                data associated with this preview.
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
        </div>
      )}
    </>
  )
}
export default Preview
