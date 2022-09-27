import { ReactComponent as DoneCheck } from '@assets/surveys/done_check.svg'
import { DisappearingInput } from '@components/surveys/widgets/SharedStyled'
import { Box, FormControl, Paper, styled } from '@mui/material'
import { latoFont } from '@style/theme'
import { BaseStep } from '@typedefs/surveys'

const StyledContainer = styled(Paper, { label: 'StyledContainer' })(
  ({ theme }) => ({
    position: 'relative',
    marginTop: '150px',
    marginLeft: '-10px',
    marginRight: '-10px',
    padding: theme.spacing(
      theme.spacing(7),
      theme.spacing(2),
      theme.spacing(2),
      theme.spacing(2)
    ),

    background: '#FFFFFF',
    boxShadow: '1px 2px 3px rgba(42, 42, 42, 0.1)',
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& > input': {
      textAlign: 'center',
    },
  })
)

const StyledP2 = styled(DisappearingInput, { label: 'StyledP2' })(({ theme }) => ({
  fontFamily: latoFont,
  fontWeight: 500,
  fontSize: '16px',
  color: '#2A2A2A',
  width: '100%',
  '& > input, textarea': {
    padding: theme.spacing(0.125, 1),
    textAlign: 'center',
  },
}))

const StyledH1 = styled(DisappearingInput, { label: 'StyledH1' })(({ theme }) => ({
  fontFamily: latoFont,

  fontWeight: 'bold',
  fontSize: '24px',
  textAlign: 'center',
  marginBottom: theme.spacing(1.5),

  color: '#2A2A2A',
  '& > input': {
    padding: theme.spacing(0.125, 1),
    textAlign: 'center',
  },
}))

const Completion: React.FunctionComponent<{
  step: BaseStep
  onChange: (step: BaseStep) => void
}> = ({ step, onChange }) => {
  return (
    <>
      <StyledContainer>
        <Box
          sx={{
            width: '80px',
            height: '80px',
            backgroundColor: '#2a2a2a',
            position: 'absolute',
            borderRadius: '50%',
            paddingTop: '23px',
            top: '-46px',
          }}>
          <DoneCheck />
        </Box>
        <FormControl variant="standard" fullWidth sx={{ mb: 1 }}>
          <StyledH1
            area-label="title"
            id="title"
            data-testid="title"
            value={step.title}
            placeholder="Title"
            onChange={e => onChange({ ...step, title: e.target.value })}
          />
        </FormControl>
        <FormControl variant="standard" fullWidth>
          <StyledP2
            id="summary"
            area-label="summary"
            multiline={true}
            minRows={2}
            data-testid="summary"
            placeholder={step.detail}
            value={step.detail}
            onChange={e => onChange({ ...step, detail: e.target.value })}
          />
        </FormControl>
      </StyledContainer>
    </>
  )
}

export default Completion
