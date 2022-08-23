import {
  DisappearingInput,
  FakeInput,
} from '@components/surveys/widgets/SharedStyled'
import {styled, Typography} from '@mui/material'
import {Theme} from '@mui/system'
import {latoFont, theme} from '@style/theme'
import {NumericQuestion, YearQuestion} from '@typedefs/surveys'

const labelStyles = (theme: Theme): React.CSSProperties => ({
  fontFamily: latoFont,
  fontWeight: 400,
  fontSize: '12px',
  color: '#2A2A2A',
  marginBottom: theme.spacing(0.5),
})

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
  ...labelStyles(theme),
  '& > input': {
    padding: theme.spacing(0.125, 1),
    textAlign: 'center',
  },
}))

const Label: React.FunctionComponent<{
  step: NumericQuestion | YearQuestion
  onChange?: (iItem: NumericQuestion) => void
}> = ({step, onChange}) => {
  if (step.inputItem.type === 'year') {
    return <Typography sx={{...labelStyles(theme)}}>Year</Typography>
  }
  const label = step.inputItem.fieldLabel

  const onUpdate = (value: string) => {
    if (step.inputItem.type === 'integer' && onChange) {
      const inputItem = {
        ...step.inputItem,

        fieldLabel: value,
      }
      onChange({...step, inputItem})
    }
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
      <FakeInput>{step.inputItem.type === 'integer' ? '' : 'YYYY'}</FakeInput>
    </StyledContainer>
  )
}

export default Numeric
