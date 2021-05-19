import { Box, Button, FormControl, FormLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { ReactNode } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import appStoreBtn from '../../../assets/preview/appStoreBtn.png'
import googlePlayBtn from '../../../assets/preview/googlePlayBtn.png'
import ParticipantService from '../../../services/participants.service'
import { ThemeType } from '../../../style/theme'
import { ErrorFallback, ErrorHandler } from '../../widgets/ErrorHandler'
import { MTBHeadingH1, MTBHeadingH2 } from '../../widgets/Headings'
import { SimpleTextInput } from '../../widgets/StyledComponents'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    backgroundColor: '#fff',

    padding: theme.spacing(0, 6, 7, 6),
    textAlign: 'left',
  },
  inputs: {
    display: 'block',
    '& .MuiFormControl-root': {
      flexDirection: 'row',
      alignItems: 'center'
     
    },
    '& label': {
      marginTop: theme.spacing(2),
      width: theme.spacing(17),
      flexShrink: 0
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
  token: string,
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
  token

}: PreviewProps) => {
  const classes = useStyles()
  const [testParticipantId, setTestParticipantId] = React.useState('')

  const handleError = useErrorHandler()


  const getTestParticipantId = async() => {
  try{
    const testId = await ParticipantService.addTestParticipantForPreview(studyId, token)
    setTestParticipantId(testId)
  } catch(e){
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
              {[...Array(4)].map(i => (
                <Reminder></Reminder>
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
          <Box display="flex" width="528px" mx="auto">
            <div
              style={{ width: '140px', marginRight: '64px', textAlign: 'left' }}
            >
              PHONE
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
                <FormControl  component="div">
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
