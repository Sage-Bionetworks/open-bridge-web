import duration from '@assets/surveys/q_type_icons/duration.svg'
import free_text from '@assets/surveys/q_type_icons/free_text.svg'
import instruction from '@assets/surveys/q_type_icons/instruction.svg'
import likert from '@assets/surveys/q_type_icons/likert.svg'
import multi_select from '@assets/surveys/q_type_icons/multi_select.svg'
import numeric from '@assets/surveys/q_type_icons/numeric.svg'
import single_select from '@assets/surveys/q_type_icons/single_select.svg'
import slider from '@assets/surveys/q_type_icons/slider.svg'
import time from '@assets/surveys/q_type_icons/time.svg'
import {styled} from '@mui/material'
import {poppinsFont} from '@style/theme'
import React from 'react'

const DivContainer = styled('div')(({theme}) => ({
  height: theme.spacing(6),
  // padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',

  '> img': {
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
}))

export const QUESTION_TYPE_ICONS = new Map<
  string,
  {img: string; title: string}
>([
  ['DURATION', {img: duration, title: 'duration'}],
  ['FREE_TEXT', {img: free_text, title: 'free_text'}],
  ['INSTRUCTION', {img: instruction, title: 'instruction'}],
  ['LIKERT', {img: likert, title: 'likert'}],
  ['MULTISELECT', {img: multi_select, title: 'multi_select'}],
  ['NUMERIC', {img: numeric, title: 'numeric'}],
  ['SINGLE_SELECT', {img: single_select, title: 'single_select'}],
  ['SLIDER', {img: slider, title: 'slider'}],
  ['TIME', {img: time, title: 'time'}],
])

type QuestionTypeDisplayProps = {
  name: string
  isSelected?: boolean
  onSelected?: () => void
}

const QuestionTypeDisplay: React.FunctionComponent<QuestionTypeDisplayProps> =
  ({name, isSelected, onSelected}) => {
    return (
      <DivContainer>
        <img width="100%" src={QUESTION_TYPE_ICONS.get(name)?.img} />{' '}
        <div>{QUESTION_TYPE_ICONS.get(name)?.title}</div>
      </DivContainer>
    )
  }

export default QuestionTypeDisplay
