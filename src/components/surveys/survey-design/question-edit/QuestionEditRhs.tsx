import {SimpleTextInput} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import GenerateId from '@mui/icons-material/JoinInnerTwoTone'
import {Box, Button, styled} from '@mui/material'
import {latoFont, theme} from '@style/theme'
import {BaseStep, ChoiceQuestion, ScaleQuestion, Step, TimeQuestion, YearQuestion} from '@typedefs/surveys'
import {FunctionComponent} from 'react'
import {StyledLabel14} from '../../widgets/SharedStyled'
import {QuestionTypeKey, getQuestionId} from '../left-panel/QuestionConfigs'
import Completion from './rhs-subcontrols/Completion'
import Numeric from './rhs-subcontrols/Numeric'
import Scale from './rhs-subcontrols/Scale'
import Select from './rhs-subcontrols/Select'
import SurveyTitle from './rhs-subcontrols/SurveyTitle'
import Time from './rhs-subcontrols/Time'
import Year from './rhs-subcontrols/Year'

const StyledContainer = styled('div')(({theme}) => ({
  width: '516px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}))

const StyledButton = styled(Button)(({theme}) => ({
  width: '300px',
  fontSize: '14px',
  fontWeight: 900,
  justifyContent: 'left',
  lineHeight: '14px',
}))

const StyledSimpleTextInput = styled(SimpleTextInput)(({theme}) => ({
  margin: '0!important',
  width: '220px',
  '& input': {width: '100%'},
}))

function Factory(args: {step: Step; onChange: (step: Step) => void; q_type: QuestionTypeKey}) {
  switch (args.q_type) {
    case 'SINGLE_SELECT': {
      return <Select step={args.step as ChoiceQuestion} onChange={args.onChange} />
    }

    case 'MULTI_SELECT':
      return <Select step={args.step as ChoiceQuestion} onChange={args.onChange} />

    case 'FREE_TEXT':
      return <></>
    case 'SLIDER':
    case 'LIKERT':
      return <Scale step={args.step as ScaleQuestion} onChange={args.onChange} />
    case 'NUMERIC':
      return <Numeric step={args.step as ScaleQuestion} onChange={args.onChange} />
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
          *Hours and Minutes will be converted into seconds (SI unit) in the results data.{' '}
        </Box>
      )
    case 'TIME':
      return <Time step={args.step as TimeQuestion} onChange={args.onChange} />
    case 'YEAR':
      return <Year step={args.step as YearQuestion} onChange={args.onChange} />
    case 'OVERVIEW':
      return <SurveyTitle step={args.step as BaseStep} onChange={args.onChange} />
    case 'COMPLETION':
      return <Completion step={args.step as BaseStep} onChange={args.onChange} />
    case 'INSTRUCTION': {
      return <></>
    }
    default:
      return <>TODO: {args.q_type} not supported</>
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

const QuestionEditRhs: FunctionComponent<QuestionEditProps> = ({step, onChange, children, isDynamic}) => {
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
      <div>
        {isDynamic && (
          <Box
            id="identifier"
            sx={{
              borderBottom: '1px solid #F1F3F5',
              padding: theme.spacing(3, 0, 1, 5),
            }}>
            <StyledLabel14 htmlFor="q_id">Question Identifier</StyledLabel14>
            <StyledSimpleTextInput
              sx={{display: 'block', width: '200px'}}
              disabled={true}
              id="q_id"
              value={step?.identifier}></StyledSimpleTextInput>
            <StyledButton variant="text" onClick={matchIdentifier} startIcon={<GenerateId />}>
              Match Identifier to Question
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
      </div>
      {children}
    </StyledContainer>
  )
}
export default QuestionEditRhs
