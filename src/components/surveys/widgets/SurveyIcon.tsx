import cognition from '@assets/surveys/survey_icons/cognition.svg'
import dayToDay from '@assets/surveys/survey_icons/day_to_day.svg'
import demographics from '@assets/surveys/survey_icons/demographics.svg'
import energy from '@assets/surveys/survey_icons/energy.svg'
import environment from '@assets/surveys/survey_icons/environment.svg'
import exercise from '@assets/surveys/survey_icons/exercise.svg'
import exit from '@assets/surveys/survey_icons/exit.svg'
import finances from '@assets/surveys/survey_icons/finances.svg'
import food from '@assets/surveys/survey_icons/food.svg'
import general from '@assets/surveys/survey_icons/general.svg'
import health from '@assets/surveys/survey_icons/health.svg'
import leisure from '@assets/surveys/survey_icons/leisure.svg'
import medicine from '@assets/surveys/survey_icons/medicine.svg'
import mental_health from '@assets/surveys/survey_icons/mental_health.svg'
import mood from '@assets/surveys/survey_icons/mood.svg'
import pain from '@assets/surveys/survey_icons/pain.svg'
import quality_of_life from '@assets/surveys/survey_icons/quality_of_life.svg'
import screening from '@assets/surveys/survey_icons/screening.svg'
import sleep from '@assets/surveys/survey_icons/sleep.svg'
import social from '@assets/surveys/survey_icons/social.svg'
import {styled} from '@mui/material'
import {latoFont} from '@style/theme'
import React from 'react'

export const SURVEY_ICONS = new Map<string, {img: string; title: string}>([
  ['default', {img: general, title: 'Default'}],
  ['cognition', {img: cognition, title: 'Cognition'}],

  ['day_to_day', {img: dayToDay, title: 'Day to day'}],
  ['demographics', {img: demographics, title: 'Demographics'}],
  ['energy', {img: energy, title: 'Energy'}],
  ['environment', {img: environment, title: 'Environment'}],

  ['excercise', {img: exercise, title: 'Exercise'}],
  ['exit', {img: exit, title: 'Exit'}],

  ['finance', {img: finances, title: 'Finance'}],
  ['food', {img: food, title: 'Food'}],

  ['health', {img: health, title: 'Health'}],

  ['leisure', {img: leisure, title: 'Leisure'}],

  ['medicine', {img: medicine, title: 'Medicine'}],
  ['mental_health', {img: mental_health, title: 'Mental Health'}],
  ['mood', {img: mood, title: 'Mood'}],
  ['pain', {img: pain, title: 'Pain'}],
  ['quality_of_life', {img: quality_of_life, title: 'Quality of Life'}],
  ['social', {img: social, title: 'Social'}],
  ['screening', {img: screening, title: 'Screening'}],
  ['sleep', {img: sleep, title: 'Sleep'}],
])
/*
GOES in assessment
2	'type': 'ImageResource',
3	'name': 'default',
4	'module': 'sage_survey',
5	'label': 'Foo'
*/

const IconContainer = styled('div')(({theme}) => ({
  textAlign: 'center',
  ' >div': {
    boxShadow: '1px 2px 3px rgba(42, 42, 42, 0.1)',
    width: '64px',
    height: '64px',

    margin: theme.spacing(0, 'auto', 1, 'auto'),
    '&:hover': {border: '1px solid black'},
    '&.selected': {
      border: '4px solid black',
      '&:hover': {border: '4px solid black'},
    },

    '> img': {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  },

  ' > span': {
    fontFamily: latoFont,
    fontWeight: 400,
    fontSize: '12px',
  },
}))

type SurveyIconProps = {
  name: string
  isSelected?: boolean
  onSelected: () => void
}

const SurveyIcon: React.FunctionComponent<SurveyIconProps> = ({
  name,
  isSelected,
  onSelected,
}) => {
  return SURVEY_ICONS.has(name) ? (
    <IconContainer>
      <div className={isSelected ? 'selected' : ''} onClick={onSelected}>
        <img width="100%" src={SURVEY_ICONS.get(name)?.img} />
      </div>
      <span>{SURVEY_ICONS.get(name)?.title}</span>
    </IconContainer>
  ) : (
    <>NOT FOUND</>
  )
}

export default SurveyIcon
