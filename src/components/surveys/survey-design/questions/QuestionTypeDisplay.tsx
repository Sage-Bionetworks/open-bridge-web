import {styled} from '@mui/material'
import {poppinsFont} from '@style/theme'
import React from 'react'
import QUESTIONS, {QuestionTypeKey} from './QuestionConfigs'

export const DivContainer = styled('div')(({theme}) => ({
  height: theme.spacing(6),
  // padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  width: '100%',

  '> svg, img': {
    flexShrink: 0,
    flexGrow: 0,
    maxWidth: theme.spacing(6),
    maxHeight: theme.spacing(6),
  },
  '> div': {
    color: '#3A3A3A',
    fontFamily: poppinsFont,
    fontWeight: 500,
    fontSize: '14px',
  },
  '&> svg:nth-of-type(2)': {
    display: 'none',
  },
  '&:hover': {
    backgroundColor: '#565656',

    '& >div': {
      color: '#fff',
    },

    '& >svg, img ': {
      '-webkit-filter': 'invert(1)',
      filter: 'invert(1)',
    },
  },
}))

type QuestionTypeDisplayProps = {
  name: QuestionTypeKey
  isSelected?: boolean
  title?: string
  onSelected?: () => void
}

const QuestionTypeDisplay: React.FunctionComponent<QuestionTypeDisplayProps> =
  ({name, title, isSelected, onSelected}) => {
    return (
      <DivContainer>
        {QUESTIONS.get(name)?.img}
        {QUESTIONS.get(name)?.active}
        <div>{title || QUESTIONS.get(name)?.title}</div>
      </DivContainer>
    )
  }

export default QuestionTypeDisplay
