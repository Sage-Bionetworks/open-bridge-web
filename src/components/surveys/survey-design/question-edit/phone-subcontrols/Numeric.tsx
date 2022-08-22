import {
  DisappearingInput,
  FakeInput,
} from '@components/surveys/widgets/SharedStyled'
import {styled} from '@mui/material'
import {latoFont} from '@style/theme'
import {NumericQuestion} from '@typedefs/surveys'

const StyledContainer = styled('div', {label: 'StyledContainer'})(({}) => ({
  height: '100%',
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledLabel = styled(DisappearingInput, {
  label: 'StyledLabel',
})(({theme}) => ({
  fontFamily: latoFont,
  fontWeight: 400,
  fontSize: '12px',
  color: '#2A2A2A',
  marginBottom: theme.spacing(0.5),
  '& > input': {
    padding: theme.spacing(0.125, 1),
    textAlign: 'center',
  },
}))

const Label: React.FunctionComponent<{
  step: NumericQuestion

  onChange: (iItem: NumericQuestion) => void
}> = ({step, onChange}) => {
  const label = step.inputItem.fieldLabel

  const onUpdate = (value: string) => {
    const inputItem = {
      ...step.inputItem,

      fieldLabel: value,
    }
    onChange({...step, inputItem})
  }

  return (
    <StyledLabel
      area-label={label}
      sx={{fontWeight: 'bold'}}
      id={label}
      value={label}
      placeholder="FieldLabel"
      onChange={e => onUpdate(e.target.value)}
    />
  )
}

const Numeric: React.FunctionComponent<{
  step: NumericQuestion
  onChange: (step: NumericQuestion) => void
}> = ({step, onChange}) => {
  return (
    <StyledContainer>
      <Label step={step} onChange={onChange} />
      <FakeInput />
    </StyledContainer>
  )
}

export default Numeric
