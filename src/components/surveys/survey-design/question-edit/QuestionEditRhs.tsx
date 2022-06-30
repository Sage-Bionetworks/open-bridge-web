import {SimpleTextInput} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import {Box, Button, styled} from '@mui/material'
import {theme} from '@style/theme'
import {ChoiceQuestion, Step} from '@typedefs/surveys'
import {FunctionComponent} from 'react'
import {StyledLabel14} from '../../widgets/SharedStyled'
import {getQuestionId, QuestionTypeKey} from '../left-panel/QuestionConfigs'
import FreeText from './rhs-subcontrols/FreeText'
import Select from './rhs-subcontrols/Select'

const StyledContainer = styled('div')(({theme}) => ({
  border: '1px solid black',
  width: '425px',
  height: '100%',
  '& > div': {},
}))

const StyledButton = styled(Button)(({theme}) => ({
  width: '150px',
  fontSize: '12px',
  textAlign: 'left',
  lineHeight: '14px',
  textDecoration: 'underline',
}))

const StyledSimpleTextInput = styled(SimpleTextInput)(({theme}) => ({
  margin: '0!important',
  width: '220px',
  '& input': {width: '100%'},
}))

function Factory(args: {
  step: Step
  onChange: (step: Step) => void
  q_type: QuestionTypeKey
}) {
  switch (args.q_type) {
    case 'SINGLE_SELECT': {
      let _step = args.step as ChoiceQuestion
      /*  return (
        <RadioQuestion
          {...{
            ...props,
            onChange: updateStepWithChoices,
            choices: _step.choices || [],
          }}
        />
      )*/
      return (
        <Select step={args.step as ChoiceQuestion} onChange={args.onChange} />
      )
    }

    case 'MULTI_SELECT':
      return (
        <Select
          step={args.step as ChoiceQuestion}
          onChange={args.onChange}
          isMulti={true}
        />
      )
      return <>CHECKBOX</>
    case 'FREE_TEXT':
      return <FreeText step={args.step} onChange={args.onChange} />
    // return <TextQuestion {...props} />
    /* case 'time':
      return <>TIME</>
    // return <TimeQuestion {...props} />

    case 'date':
      return <>DATE</>
    // return <DateQuestion {...props} />
    case 'likert':
      return <>LIKERT</>
    // return <LikertQuestion {...props} />*/
    default:
      return <>nothing</>
  }
}

type QuestionEditProps = {
  step: Step
  onChange: (step: Step) => void
}

const QuestionEditRhs: FunctionComponent<QuestionEditProps> = ({
  step,
  onChange,
  children,
}) => {
  const matchIdentifier = () => {
    const newId = `${step?.title.replaceAll(
      ' ',
      '_'
    )}_${Utility.generateNonambiguousCode(3, 'CONSONANTS')}`
    onChange({...step, identifier: newId})
  }
  if (!step) {
    return <></>
  }
  return (
    <StyledContainer>
      <Box
        id="identifier"
        sx={{backgroundColor: '#ECECEC;', padding: theme.spacing(3, 0, 3, 4)}}>
        <StyledLabel14 htmlFor="q_id">Question Identifier</StyledLabel14>
        <StyledSimpleTextInput
          id="q_id"
          value={step?.identifier}></StyledSimpleTextInput>
        <StyledButton variant="text" onClick={matchIdentifier}>
          Match Identifier to Question
        </StyledButton>
      </Box>
      {
        <Factory
          {...{
            step: {...step},
            onChange: onChange,
            q_type: getQuestionId(step),
          }}></Factory>
      }
      {children}
    </StyledContainer>
  )
}
export default QuestionEditRhs
