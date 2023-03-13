import FileUploadTwoToneIcon from '@mui/icons-material/FileUploadTwoTone'
import MediationTwoToneIcon from '@mui/icons-material/MediationTwoTone'
import Alert from '@mui/icons-material/ReportProblemTwoTone'
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone'
import {Box, Button, Divider, Typography} from '@mui/material'
import {styled} from '@mui/material/styles'
import {latoFont, theme} from '@style/theme'
import {BaseStep} from '@typedefs/surveys'
import {useHistory, useParams} from 'react-router-dom'

const StyledText = styled('div')(({theme}) => ({
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '21px',
}))

const BranchingButton = styled('div')(({theme}) => ({
  display: 'flex',
  border: '1px solid black',
  backgroundColor: '#fff',
  padding: '10px',
  width: 'fit-content',
  cursor: 'pointer',
  '& a': {
    textDecoration: 'none',
    fontSize: '16px',
    fontFamily: latoFont,
    marginLeft: '6px',
  },
  marginBottom: '36px',
}))

const Completion: React.FunctionComponent<{
  step: BaseStep
  onChange: (step: BaseStep) => void
}> = () => {
  let {id: surveyGuid} = useParams<{
    id: string
  }>()
  const history = useHistory()
  return (
    <Box sx={{padding: theme.spacing(6, 6, 4, 6)}}>
      <StyledText>
        Customize the Completion Screen that participants will see after they've submitted their responses. <br />
        <br />
        Surveys will be submitted on the screen prior to this Completion screen.
      </StyledText>{' '}
      <Divider sx={{color: '#DFE2E6', margin: theme.spacing(4, -6, 4, -6)}} />
      <Typography sx={{fontSize: '20px'}}>Invite Others to Your Survey </Typography>
      <StyledText>Some content about inviting others to your survey to review it. </StyledText>
      <Button
        variant="outlined"
        startIcon={<SettingsTwoToneIcon />}
        sx={{padding: theme.spacing(1, 2.5), margin: theme.spacing(1.5, 0, 5, 0)}}>
        {' '}
        Survey Access Settings
      </Button>
      <Typography sx={{fontSize: '20px'}}> Ready to launch?</Typography>
      <StyledText> Before launching, please review any branching logic to your questions. </StyledText>
      <Button
        color="primary"
        variant="contained"
        startIcon={<MediationTwoToneIcon />}
        href={`/surveys/${surveyGuid}/branching`}
        sx={{padding: theme.spacing(1, 2.5), margin: theme.spacing(1.5, 0, 5, 0)}}>
        Preview Branching Logic
      </Button>
      <Typography sx={{fontSize: '20px'}}>Publish Survey</Typography>
      <Typography
        sx={{fontStyle: 'italic', fontWeight: 400, fontSize: '14px', display: 'flex', marginTop: theme.spacing(2)}}>
        <Alert sx={{color: '#ff4163'}} />
        Please note that once a survey is published, it cannot be deleted if it is used in any study on the platform.
      </Typography>
      <Button
        color="primary"
        variant="contained"
        startIcon={<FileUploadTwoToneIcon />}
        onClick={() => alert('TODO')}
        sx={{padding: theme.spacing(1, 2.5), margin: theme.spacing(1.5, 0, 5, 0)}}>
        Publish Survey
      </Button>
      <Button> </Button>
    </Box>
  )
}
export default Completion
