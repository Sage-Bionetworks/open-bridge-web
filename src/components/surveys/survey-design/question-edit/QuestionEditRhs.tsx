import {ReactComponent as GenerateId} from '@assets/surveys/actions/generate_id.svg'
import {SimpleTextInput} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import {Box, Button, styled} from '@mui/material'
import {latoFont, theme} from '@style/theme'
import {
  BaseStep,
  ChoiceQuestion,
  ScaleQuestion,
  Step,
  TimeQuestion,
  YearQuestion,
} from '@typedefs/surveys'
import {FunctionComponent} from 'react'
import {StyledLabel14} from '../../widgets/SharedStyled'
import {getQuestionId, QuestionTypeKey} from '../left-panel/QuestionConfigs'
import Completion from './rhs-subcontrols/Completion'
import Numeric from './rhs-subcontrols/Numeric'
import Scale from './rhs-subcontrols/Scale'
import Select from './rhs-subcontrols/Select'
import SurveyTitle from './rhs-subcontrols/SurveyTitle'
import Time from './rhs-subcontrols/Time'
import Year from './rhs-subcontrols/Year'

const StyledContainer = styled('div')(({theme}) => ({
  width: '425px',
  height: '100%',
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
      return (
        <Select step={args.step as ChoiceQuestion} onChange={args.onChange} />
      )
    }

    case 'MULTI_SELECT':
      return (
        <Select step={args.step as ChoiceQuestion} onChange={args.onChange} />
      )

    case 'FREE_TEXT':
      return <></>
    case 'SLIDER':
    case 'LIKERT':
      return (
        <Scale step={args.step as ScaleQuestion} onChange={args.onChange} />
      )
    case 'NUMERIC':
      return (
        <Numeric step={args.step as ScaleQuestion} onChange={args.onChange} />
      )
    case 'DURATION':
      return (
        <Box
          sx={{
            fontFamily: latoFont,
            margin: theme.spacing(4),
            fontWeight: '400',
            fontSize: '16px',
            lineHeight: '19px',
          }}>
          *Hours and Minutes will be converted into seconds (SI unit) in the
          results data.{' '}
        </Box>
      )
    case 'TIME':
      return <Time step={args.step as TimeQuestion} onChange={args.onChange} />
    case 'YEAR':
      return <Year step={args.step as YearQuestion} onChange={args.onChange} />
    case 'OVERVIEW':
      return (
        <SurveyTitle step={args.step as BaseStep} onChange={args.onChange} />
      )
    case 'COMPLETION':
      return (
        <Completion step={args.step as BaseStep} onChange={args.onChange} />
      )
    default:
      return <>nothing</>
  }
}
/* 
deleting questions:
can't delete question if it is in the rules for another question.
changing quesiton id:
change the dependent quesitons
*/

type QuestionEditProps = {
  step: Step
  dependentQuestions: number[] | undefined
  onChange: (step: Step) => void
  isDynamic: boolean
}

const QuestionEditRhs: FunctionComponent<QuestionEditProps> = ({
  step,
  onChange,
  children,
  isDynamic,
}) => {
  const matchIdentifier = () => {
    const newId = `${step?.title
      .replaceAll(' ', '_')
      .toLowerCase()
      .replace('?', '')}_${Utility.generateNonambiguousCode(3, 'CONSONANTS')}`
    onChange({...step, identifier: newId})
  }
  if (!step) {
    return <></>
  }
  return (
    <StyledContainer>
      {isDynamic && (
        <Box
          id="identifier"
          sx={{
            backgroundColor: '#ECECEC;',
            padding: theme.spacing(3, 0, 3, 4),
          }}>
          <StyledLabel14 htmlFor="q_id">Question Identifier</StyledLabel14>
          <StyledSimpleTextInput
            onChange={e => onChange({...step, identifier: e.target.value})}
            id="q_id"
            value={step?.identifier}></StyledSimpleTextInput>
          <StyledButton variant="text" onClick={matchIdentifier}>
            <GenerateId /> Match Identifier to Question
          </StyledButton>
        </Box>
      )}
      <Box sx={{padding: isDynamic ? theme.spacing(3) : 0}}>
        <Factory
          {...{
            step: {...step},
            onChange: onChange,
            q_type: getQuestionId(step),
          }}></Factory>
      </Box>
      {children}
    </StyledContainer>
  )
}
export default QuestionEditRhs
