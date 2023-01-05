import {DisappearingInput} from '@components/surveys/widgets/SharedStyled'
import DoneCheck from '@mui/icons-material/CheckCircleTwoTone'
import {Box, FormControl, styled} from '@mui/material'
import {latoFont} from '@style/theme'
import {BaseStep} from '@typedefs/surveys'

const StyledContainer = styled(Box, {label: 'StyledContainer'})(({theme}) => ({
  position: 'relative',
  marginTop: '120px',
  marginLeft: '-10px',
  marginRight: '-10px',
  backgroundColor: 'red', //'#F7FBF6',
  padding: theme.spacing(theme.spacing(7), theme.spacing(2), theme.spacing(2), theme.spacing(2)),

  //background: '#FFFFFF',

  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '& > input': {
    textAlign: 'center',
    backgroundColor: '#fff',
  },
}))

const StyledP2 = styled(DisappearingInput, {label: 'StyledP2'})(({theme}) => ({
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

const StyledH1 = styled(DisappearingInput, {label: 'StyledH1'})(({theme}) => ({
  fontFamily: latoFont,

  fontWeight: 400,
  fontSize: '24px',
  textAlign: 'center',
  marginBottom: theme.spacing(0),

  color: '#2A2A2A',
  '& > input': {
    padding: theme.spacing(0.125, 1),
    textAlign: 'center',
  },
}))

const Completion: React.FunctionComponent<{
  step: BaseStep
  onChange: (step: BaseStep) => void
}> = ({step, onChange}) => {
  return (
    <>
      <StyledContainer>
        <DoneCheck sx={{color: '#63A650', top: '-16px', fontSize: '64px', position: 'absolute'}} />

        <FormControl variant="standard" fullWidth sx={{mb: 1}}>
          <StyledH1
            area-label="title"
            id="title"
            data-testid="title"
            value={step.title}
            placeholder="Title"
            onChange={e => onChange({...step, title: e.target.value})}
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
            onChange={e => onChange({...step, detail: e.target.value})}
          />
        </FormControl>
      </StyledContainer>
    </>
  )
}

export default Completion
