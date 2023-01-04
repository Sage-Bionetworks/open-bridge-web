import {styled} from '@mui/material'
import React from 'react'
import QUESTIONS, {QuestionTypeKey} from './QuestionConfigs'

export const DivContainer = styled('div', {label: 'DivContainer'})<{hover?: boolean}>(({theme, hover = true}) => ({
  height: theme.spacing(6),
  display: 'flex',
  alignItems: 'center',
  width: '100%',

  '> svg': {
    flexShrink: 0,
    flexGrow: 0,
    maxWidth: theme.spacing(6),
    maxHeight: theme.spacing(6),
    color: '#DFE2E6',

    margin: theme.spacing(2),
    '&.question-type-icon': {
      color: '#878E95',
    },
  },
  '> div': {
    color: '#4A5056',

    fontWeight: 900,
    fontSize: '14px',
    '& svg': {
      color: '#878E95',
    },
  },
}))

// optionally use a custom type guard
function isPropsQuestionTypeDisplayProps(
  props: QuestionTypeDisplayProps | QuestionTypeWrappedDisplayProps
): props is QuestionTypeDisplayProps {
  return 'name' in props
}

type QuestionTypeDisplayProps = {
  name: QuestionTypeKey
}
type QuestionTypeWrappedDisplayProps = {
  children: React.ReactNode
}

const QuestionTypeDisplay: React.FunctionComponent<QuestionTypeDisplayProps | QuestionTypeWrappedDisplayProps> =
  props => {
    return isPropsQuestionTypeDisplayProps(props) ? (
      <DivContainer>
        {React.cloneElement(QUESTIONS.get(props.name)?.img || <></>, {className: 'question-type-icon'})}
        <div>{QUESTIONS.get(props.name)?.title}</div>
      </DivContainer>
    ) : (
      <DivContainer>{props.children}</DivContainer>
    )
  }

export default QuestionTypeDisplay
