import dayToDay from '@assets/surveys/survey_icons/day_to_day.svg'
import demographics from '@assets/surveys/survey_icons/demographics.svg'
import energy from '@assets/surveys/survey_icons/energy.svg'
import exercise from '@assets/surveys/survey_icons/exercise.svg'
import finances from '@assets/surveys/survey_icons/finances.svg'
import food from '@assets/surveys/survey_icons/food.svg'
import general from '@assets/surveys/survey_icons/general.svg'
import health from '@assets/surveys/survey_icons/health.svg'
import leisure from '@assets/surveys/survey_icons/leisure.svg'
import medicine from '@assets/surveys/survey_icons/medicine.svg'
import mood from '@assets/surveys/survey_icons/mood.svg'
import sleep from '@assets/surveys/survey_icons/sleep.svg'
import {styled} from '@mui/material'
import {latoFont} from '@style/theme'
import React from 'react'

export const SURVEY_ICONS = new Map<string, {img: string; title: string}>([
  ['GENERAL', {img: general, title: 'Default'}],
  ['FOOD', {img: food, title: 'Food'}],
  ['HEALTH', {img: health, title: 'Health'}],
  ['EXERCISE', {img: exercise, title: 'Exercise'}],
  ['SLEEP', {img: sleep, title: 'Sleep'}],
  ['MOOD', {img: mood, title: 'Mood'}],
  ['LEISURE', {img: leisure, title: 'Leisure'}],
  ['MEDICINE', {img: medicine, title: 'Medicine'}],
  ['ENERGY', {img: energy, title: 'Energy'}],
  ['DEMOGRAPHICS', {img: demographics, title: 'Demographics'}],
  ['FINANCE', {img: finances, title: 'Finance'}],
  ['DAY_TO_DAY', {img: dayToDay, title: 'Day to day'}],
])

const IconContainer = styled('div')(({theme}) => ({
  textAlign: 'center',
  ' >div': {
    //img container
    background: '#F8F8F8',
    boxShadow: '1px 2px 3px rgba(42, 42, 42, 0.1)',
    width: '64px',
    height: '64px',
    padding: '12px',
    display: 'flex',
    marginBottom: theme.spacing(1),
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
