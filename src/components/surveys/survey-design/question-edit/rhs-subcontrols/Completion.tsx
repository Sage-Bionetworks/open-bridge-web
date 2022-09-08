import {ReactComponent as Alert} from '@assets/surveys/alert.svg'
import {ReactComponent as Branching} from '@assets/surveys/branching.svg'
import {ReactComponent as Rocket} from '@assets/surveys/rocket.svg'
import {Box, Typography} from '@mui/material'
import {styled} from '@mui/material/styles'
import {latoFont, poppinsFont, theme} from '@style/theme'
import {BaseStep} from '@typedefs/surveys'
import {NavLink, useParams} from 'react-router-dom'

const StyledText = styled('div')(({theme}) => ({
  fontFamily: poppinsFont,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '21px',
  marginBottom: theme.spacing(3),
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

  return (
    <Box sx={{padding: theme.spacing(8, 4, 4, 4)}}>
      <StyledText>
        Customize the Completion Screen that participants will see after they've
        submitted their responses.{' '}
      </StyledText>
      <StyledText>
        Surveys will be submitted on the screen prior to this Completion screen.
      </StyledText>{' '}
      <Box marginBottom="8px" marginTop="12px">
        <Rocket />
        <Typography component="span" fontWeight={800} fontFamily={poppinsFont}>
          Ready to launch?
        </Typography>
      </Box>
      <StyledText>
        Before launching, please review any branching logic to your questions.
      </StyledText>
      <BranchingButton>
        <Branching />
        <NavLink to={`/surveys/${surveyGuid}/branching`}>
          {' '}
          Preview Branching Logic
        </NavLink>
      </BranchingButton>
      <StyledText>
        <Alert /> Please note that once a survey is published, it cannot be
        deleted if it is used in any study on the platform.{' '}
      </StyledText>
    </Box>
  )
}
export default Completion
