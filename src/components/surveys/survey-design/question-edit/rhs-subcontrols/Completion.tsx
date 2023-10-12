import FileUploadTwoToneIcon from '@mui/icons-material/FileUploadTwoTone'
import MediationTwoToneIcon from '@mui/icons-material/MediationTwoTone'
import Alert from '@mui/icons-material/ReportProblemTwoTone'
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone'
import {Box, Button, Divider, Typography} from '@mui/material'
import {styled} from '@mui/material/styles'
import {theme} from '@style/theme'
import {BaseStep} from '@typedefs/surveys'
import {useParams} from 'react-router-dom'

const StyledText = styled('div')(({theme}) => ({
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '21px',
}))

const Completion: React.FunctionComponent<{
  step: BaseStep
  onChange: (step: BaseStep) => void
}> = () => {
  let {id: surveyGuid} = useParams<{
    id: string
  }>()

  return (
    <Box sx={{padding: theme.spacing(6, 6, 4, 6)}}>
      {/* <Button color="primary" variant="contained" onClick={() => onAction('save')}>
          Save Completion Screen
        </Button>
        <Divider sx={{color: '#DFE2E6', margin: theme.spacing(4, -6, 4, -6)}} /> */}

      {/* <StyledText>
        Customize the Completion Screen that participants will see after they've submitted their responses. <br />
        <br />
        Surveys will be submitted on the screen prior to this Completion Screen.
      </StyledText>{' '}*/}

      {/*   */}
      {/* TODO: syoung 10/11/2023 Figure out the copy for survey access settings and that this means to design.
      <Typography sx={{fontSize: '20px'}}>Invite Others to Your Survey </Typography>
      <StyledText>Some content about inviting others to your survey to review it. </StyledText>
      <Button
        variant="outlined"
        startIcon={<SettingsTwoToneIcon />}
        sx={{padding: theme.spacing(1, 2.5), margin: theme.spacing(1.5, 0, 5, 0)}}>
        {' '}
        Survey Access Settings
      </Button> */}
      <Typography sx={{fontSize: '20px', margin: theme.spacing(0, 0, 1, 0)}}> Ready to use?</Typography>
      <StyledText> Before adding your survey to a study under design, please review any branching logic used by your questions. </StyledText>
      <Button
        color="primary"
        variant="contained"
        startIcon={<MediationTwoToneIcon />}
        href={`/surveys/${surveyGuid}/branching`}
        sx={{padding: theme.spacing(1, 2.5), margin: theme.spacing(1.5, 0, 5, 0)}}>
        Preview Branching Logic
      </Button>
      <Typography sx={{fontSize: '20px', margin: theme.spacing(0, 0, 1, 0)}}>Publish Survey</Typography>
      <Typography
        sx={{fontStyle: 'italic', fontWeight: 400, fontSize: '14px', display: 'flex', marginTop: theme.spacing(2), marginBottom: theme.spacing(1)}}>
        <Alert sx={{color: '#ff4163', margin: theme.spacing(0, 1, 0, 0)}} />
        Please note that once a survey is published, it cannot be edited or deleted.
      </Typography>
      <StyledText> 
        A survey is published when it is used in a live study. 
        Once published, it is locked and cannot be changed.
      </StyledText>

    </Box>
  )
}
export default Completion
