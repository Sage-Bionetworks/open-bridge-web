import {ReactComponent as Duration} from '@assets/surveys/q_type_icons/duration.svg'
import {ReactComponent as Free_text} from '@assets/surveys/q_type_icons/free_text.svg'
import {ReactComponent as Instruction} from '@assets/surveys/q_type_icons/instruction.svg'
import {ReactComponent as Likert} from '@assets/surveys/q_type_icons/likert.svg'
import {ReactComponent as MultiSelect} from '@assets/surveys/q_type_icons/multi_select.svg'
import {ReactComponent as MultiSelectActive} from '@assets/surveys/q_type_icons/multi_select_active.svg'
import {ReactComponent as Numeric} from '@assets/surveys/q_type_icons/numeric.svg'
import {ReactComponent as SingleSelect} from '@assets/surveys/q_type_icons/single_select.svg'
import {ReactComponent as Slider} from '@assets/surveys/q_type_icons/slider.svg'
import {ReactComponent as Time} from '@assets/surveys/q_type_icons/time.svg'
import {ReactComponent as Year} from '@assets/surveys/q_type_icons/year.svg'
import {ChoiceQuestion, Question, Step} from '@typedefs/surveys'
import React from 'react'

export type QuestionTypeKey =
  | 'DURATION'
  | 'FREE_TEXT'
  | 'INSTRUCTION'
  | 'LIKERT'
  | 'MULTISELECT'
  | 'NUMERIC'
  | 'SINGLE_SELECT'
  | 'SLIDER'
  | 'TIME'
  | 'YEAR'

const QUESTIONS = new Map<
  QuestionTypeKey,
  {img: React.ReactNode; active?: React.ReactNode; title: string; default?: {}}
>([
  [
    'DURATION',
    {
      img: <Duration />,
      active: <MultiSelectActive />,
      title: 'Duration input',
      default: {
        type: 'simpleQuestion',
        identifier: 'durationQ',

        inputItem: {
          type: 'duration',
        },
      },
    },
  ],
  [
    'FREE_TEXT',
    {
      img: <Free_text />,
      active: <MultiSelectActive />,
      title: 'Free Text',
      default: {
        type: 'simpleQuestion',
        identifier: 'textQ',

        inputItem: {
          type: 'string',
        },
      },
    },
  ],
  [
    'INSTRUCTION',
    {
      img: <Instruction />,
      active: <MultiSelectActive />,
      title: 'Instruction',
      default: {
        type: 'instruction',
        identifier: 'instruction',
      },
    },
  ],
  [
    'LIKERT',
    {
      img: <Likert />,
      active: <MultiSelectActive />,
      title: 'Likert Scale',
      default: {
        type: 'simpleQuestion',
        identifier: 'likertQ',
        title: 'Title',
        uiHint: 'likert',
        inputItem: {
          type: 'integer',
          formatOptions: {
            minimumLabel: 'Never',
            minimumValue: 1,
            maximumLabel: 'Always',
            maximumValue: 5,
          },
        },
      },
    },
  ],
  [
    'MULTISELECT',
    {
      img: <MultiSelect />,
      active: <MultiSelectActive />,
      title: 'Multi-select',
      default: {
        type: 'choiceQuestion',
        identifier: 'multiChoiceQ',
        subtitle: 'Subtitle',
        title: 'New Question',
        detail: 'Detail',
        baseType: 'string',
        singleChoice: false,
        choices: [
          {value: 'Choice A', text: 'Choice A'},
          {value: 'Choice B', text: 'Choice B'},
        ],
      },
    },
  ],
  [
    'NUMERIC',
    {
      img: <Numeric />,
      active: <MultiSelectActive />,
      title: 'Integer input',
      default: {
        type: 'simpleQuestion',
        identifier: 'numericQ',
        title: 'How many times did you wake up for 5 minutes or longer?',
        uiHint: 'textfield',
        inputItem: {
          type: 'integer',
        },
      },
    },
  ],
  [
    'SINGLE_SELECT',
    {
      img: <SingleSelect />,
      active: <MultiSelectActive />,
      title: 'Single Select',
      default: {
        type: 'choiceQuestion',
        identifier: 'singleChoiceQ',
        subtitle: 'Subtitle',
        title: 'New Question',
        detail: 'Detail',
        baseType: 'string',
        singleChoice: true,
        choices: [
          {value: 'Choice A', text: 'Choice A'},
          {value: 'Choice B', text: 'Choice B'},
        ],
      },
    },
  ],
  [
    'SLIDER',
    {
      img: <Slider />,
      active: <MultiSelectActive />,
      title: 'Slide Scale',
      default: {
        type: 'simpleQuestion',
        identifier: 'sliderQ',
        title: 'New Question',
        uiHint: 'slider',
        inputItem: {
          type: 'integer',
          formatOptions: {
            maximumLabel: 'Very',
            maximumValue: 100,
            minimumLabel: 'None',
            minimumValue: 0,
          },
        },
      },
    },
  ],
  [
    'TIME',
    {
      img: <Time />,
      active: <MultiSelectActive />,
      title: 'Time input',
      default: {
        type: 'simpleQuestion',
        identifier: 'timeQ',

        inputItem: {
          type: 'time',
          formatOptions: {
            allowFuture: false,
          },
        },
      },
    },
  ],
  [
    'YEAR',
    {
      img: <Year />,
      active: <MultiSelectActive />,
      title: 'Year input',
      default: {
        type: 'simpleQuestion',
        identifier: 'yearQ',

        inputItem: {
          type: 'year',
          formatOptions: {
            minimumYear: 1900,
            allowFuture: false,
          },
        },
      },
    },
  ],
])
type QuestionConfigFields = {type: string; inputItemType?: string}

export const getQuestionId = (step: Step): QuestionTypeKey => {
  if (step.type === 'instruction') {
    return 'INSTRUCTION'
  }
  if (step.type === 'choiceQuestion') {
    return (step as ChoiceQuestion).singleChoice
      ? 'SINGLE_SELECT'
      : 'MULTISELECT'
  }
  const uiHint = (step as Question).uiHint
  const inputItemType = (step as Question).inputItem?.type

  switch (inputItemType) {
    case 'integer':
      switch (uiHint) {
        case 'likert':
          return 'LIKERT'
        case 'slider':
          return 'SLIDER'
        default:
          return 'NUMERIC'
      }
      break
    case 'time':
      return 'TIME'
    case 'duration':
      return 'DURATION'
    case 'year':
      return 'YEAR'
    case 'string':
      return 'FREE_TEXT'
    default:
      return 'INSTRUCTION'
  }
}

export default QUESTIONS
