import {styled} from '@mui/material'
import {poppinsFont} from '@style/theme'
import React from 'react'
import QUESTIONS, {QuestionTypeKey} from './QuestionConfigs'

export const DivContainer = styled('div')<{hover?: boolean}>(
  ({theme, hover = true}) => ({
    height: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    width: '100%',

    '> svg, img': {
      flexShrink: 0,
      flexGrow: 0,
      maxWidth: theme.spacing(6),
      maxHeight: theme.spacing(6),
      // margin: theme.spacing(2),
    },
    '> div': {
      color: '#3A3A3A',
      fontFamily: poppinsFont,
      fontWeight: 500,
      fontSize: '14px',
    },
  })
)

// optionally use a custom type guard
function isPropsQuestionTypeDisplayProps(
  props: QuestionTypeDisplayProps | QuestionTypeWrappedDisplayProps
): props is QuestionTypeDisplayProps {
  return 'name' in props
}

type QuestionTypeDisplayProps = {
  name: QuestionTypeKey

  hover?: boolean
}
type QuestionTypeWrappedDisplayProps = {
  children: React.ReactNode
  hover?: boolean
}

const QuestionTypeDisplay: React.FunctionComponent<
  QuestionTypeDisplayProps | QuestionTypeWrappedDisplayProps
> = props => {
  return isPropsQuestionTypeDisplayProps(props) ? (
    <DivContainer hover={props.hover}>
      {QUESTIONS.get(props.name)?.img}
      <div>{QUESTIONS.get(props.name)?.title}</div>
    </DivContainer>
  ) : (
    <DivContainer hover={props.hover}>{props.children}</DivContainer>
  )
}

export default QuestionTypeDisplay
