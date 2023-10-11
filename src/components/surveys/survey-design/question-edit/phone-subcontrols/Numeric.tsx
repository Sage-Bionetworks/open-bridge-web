import {DisappearingInput} from '@components/surveys/widgets/SharedStyled'
import {SimpleTextInput} from '@components/widgets/StyledComponents'
import {styled} from '@mui/material'
import {Theme} from '@mui/system'
import {latoFont} from '@style/theme'
import {InputItem, NumericQuestion, YearQuestion} from '@typedefs/surveys'

const labelStyles = (theme: Theme): React.CSSProperties => ({
  fontFamily: latoFont,
  fontWeight: 400,
  fontSize: '12px',
  color: '#2A2A2A',
  marginBottom: theme.spacing(0.5),
})

const StyledContainer = styled('div', {label: 'StyledContainer'})(() => ({
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
  ...labelStyles(theme),
  '& > input': {
    padding: theme.spacing(0.125, 1),
    textAlign: 'center',
    backgroundColor: '#fff',
  },
}))

const Numeric: React.FunctionComponent<{
  step: NumericQuestion | YearQuestion
  isReadOnly?: boolean
  onChange: (step: NumericQuestion | YearQuestion) => void
}> = ({step, isReadOnly, onChange}) => {
  const updateStep = (inputItem: InputItem) => {
    inputItem.type = step.inputItem.type
    // @ts-ignore
    onChange({...step, inputItem})
  }
  return (
    <StyledContainer>
      <StyledLabel
        aria-label="fieldLabel"
        sx={{fontWeight: 'bold'}}
        id="fieldLabel"
        value={step.inputItem.fieldLabel}
        placeholder="Field Label"
        readOnly={isReadOnly}
        onChange={e => updateStep({...step.inputItem, fieldLabel: e.target.value})}
      />
      <SimpleTextInput
        sx={{width: '80px'}}
        aria-label="min"
        disabled={step.inputItem.type === 'integer' || isReadOnly}
        placeholder={step.inputItem.placeholder}
        onChange={e => updateStep({...step.inputItem, placeholder: e.target.value})}></SimpleTextInput>
    </StyledContainer>
  )
}

export default Numeric
