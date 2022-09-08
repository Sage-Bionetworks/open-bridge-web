import {ReactComponent as Completion} from '@assets/surveys/iconcomplete.svg'
import {ReactComponent as Duration} from '@assets/surveys/q_type_icons/duration.svg'
import {ReactComponent as Free_text} from '@assets/surveys/q_type_icons/free_text.svg'
import {ReactComponent as Instruction} from '@assets/surveys/q_type_icons/instruction.svg'
import {ReactComponent as Likert} from '@assets/surveys/q_type_icons/likert.svg'
import {ReactComponent as MultiSelect} from '@assets/surveys/q_type_icons/multi_select.svg'
import {ReactComponent as Numeric} from '@assets/surveys/q_type_icons/numeric.svg'
import {ReactComponent as SingleSelect} from '@assets/surveys/q_type_icons/single_select.svg'
import {ReactComponent as Slider} from '@assets/surveys/q_type_icons/slider.svg'
import {ReactComponent as Time} from '@assets/surveys/q_type_icons/time.svg'
import {ReactComponent as Overview} from '@assets/surveys/q_type_icons/title.svg'
import {ReactComponent as Year} from '@assets/surveys/q_type_icons/year.svg'
import {ChoiceQuestion, Question, Step} from '@typedefs/surveys'
import React from 'react'

export type QuestionTypeKey =
  | 'DURATION'
  | 'FREE_TEXT'
  | 'INSTRUCTION'
  | 'LIKERT'
  | 'MULTI_SELECT'
  | 'NUMERIC'
  | 'SINGLE_SELECT'
  | 'SLIDER'
  | 'TIME'
  | 'YEAR'
  | 'COMPLETION'
  | 'OVERVIEW'

const QUESTIONS = new Map<
  QuestionTypeKey,
  {img: React.ReactNode; active?: React.ReactNode; title: string; default?: {}}
>([
  [
    'DURATION',
    {
      img: <Duration />,

      title: 'Duration input',
      default: {
        type: 'simpleQuestion',
        identifier: 'durationQ',
        title: 'New Question',
        inputItem: {
          type: 'duration',
        },
      },
    },
  ],
  [
    'OVERVIEW',
    {
      img: <Overview />,

      title: 'Title Page',

      default: {
        type: 'overview',
        identifier: 'overview',
        title: 'Survey Title',
        detail:
          'Summary to participants on what they should know about the survey, thanking them for their time, what type of environment they should be taking it in, etc.',
        image: {
          type: 'sageResource',
          imageName: 'default',
        },
      },
    },
  ],
  [
    'FREE_TEXT',
    {
      img: <Free_text />,

      title: 'Free Text',
      default: {
        type: 'simpleQuestion',
        identifier: 'textQ',
        title: 'New Question',
        detail: 'Maximum 250 characters',
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

      title: 'Instruction',
      default: {
        type: 'instruction',
        identifier: 'instruction',
        title: 'New Instruction',
      },
    },
  ],
  [
    'LIKERT',
    {
      img: <Likert />,

      title: 'Likert Scale',
      default: {
        type: 'simpleQuestion',
        identifier: 'likertQ',
        title: 'New Question',
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
    'MULTI_SELECT',
    {
      img: <MultiSelect />,

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

      title: 'Single Select',
      default: {
        type: 'choiceQuestion',
        identifier: 'singleChoiceQ',
        subtitle: 'Subtitle',
        title: 'New Question',
        detail: 'Detail',
        baseType: 'integer',
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

      title: 'Time input',
      default: {
        type: 'simpleQuestion',
        identifier: 'timeQ',
        title: 'New Question',
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

      title: 'Year input',
      default: {
        type: 'simpleQuestion',
        identifier: 'yearQ',
        title: 'New Question',
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
  [
    'COMPLETION',

    {
      img: <Completion />,

      title: 'COMPLETION',
      default: {
        type: 'completion',
        identifier: 'completion',
        title: 'Well Done!',
        detail: 'Thank you for being part of our survey',
        actions: {
          goForward: {
            buttonTitle: 'Exit Survey',
            type: 'default',
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
      : 'MULTI_SELECT'
  }
  if (step.type === 'completion') {
    return 'COMPLETION'
  }
  if (step.type === 'overview') {
    return 'OVERVIEW'
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
