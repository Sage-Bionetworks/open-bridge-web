export type SurveyRuleOperator = 'eq' | 'ne'
export type ChoiceSelectorType = 'all' | 'exclusive' | 'default'
export type QuestionDataType = 'string' | 'integer' | 'number' | 'boolean'

export type ActionButton = {
  type: string //'default',
  buttonTitle?: string //'Go, Dogs! Go!'
  iconName?: string //'fooIcon', ALINA TODO where is it coming from
}

export type ImageFetchable = {
  type: 'fetchable'
  imageName: string //'crf_seated'
}

export type ImageResource = {
  type: 'sageResource'
  imageName: string //'crf_seated'
}

export type ImageAnimated = {
  type: 'animated'
  compositeImageName: string //'crf_stair_step_start_animation',
  animationDuration: number //0.5,
  imageNames: string[]
}

export type FormatOptionsYear = {
  allowFuture?: boolean
  allowPast?: boolean
  minimumYear?: number
  maximumYear?: number
}

export type FormatOptionsInteger = {
  maximumLabel?: string
  maximumValue?: number
  minimumLabel?: string
  minimumValue?: number
}

export type FormatOptionsTime = {
  maximumValue?: string
  minimumValue?: string
  allowPast?: boolean
  allowFuture?: boolean
}

export type InputItem = {
  type: 'string' | 'year' | 'checkbox' | 'duration' | 'integer' | 'time'

  placeholder?: string
  fieldLabel?: string
  displayUnits?: string[]
  formatOptions?: FormatOptionsInteger | FormatOptionsYear | FormatOptionsTime
}

export type Skip = {
  type: 'skipCheckbox'
  fieldLabel: string
}

export type ChoiceQuestionChoice = {
  text: string
  value?: string | number | boolean

  selectorType?: ChoiceSelectorType
  icon?: string
}

export interface Instruction extends BaseStep {}
export type ControlType =
  | 'radio'
  | 'checkbox'
  | 'text'
  | 'likert'
  | 'time'
  | 'date'

export interface Question extends BaseStep {
  optional?: boolean //true,
  inputItem?: InputItem
  skipCheckbox?: Skip
  baseType?: QuestionDataType
  nextStepIdentifier?: string
  uiHint?: 'checkmark' | 'likert' | 'textfield' | 'slider'
}

export interface ChoiceQuestion extends Question {
  baseType: QuestionDataType

  surveyRules?: {
    matchingAnswer?: number | string | boolean
    skipToIdentifier: string
    ruleOperator?: SurveyRuleOperator
  }[]

  choices: ChoiceQuestionChoice[]
  singleChoice?: boolean
  other?: {
    type: 'string'
    fieldLabel?: string // no column
  }
}
export interface MultipleInputQuestion extends Question {
  optional: boolean
  inputItems: InputItem[]
  skipCheckbox?: Skip
}
export interface ScaleQuestion extends Question {
  uiHint: 'likert' | 'slider'
  inputItem: InputItem & {
    type: 'integer'
    formatOptions: FormatOptionsInteger
  }
}
export interface DurationQuestion extends Question {
  inputItem: InputItem & {
    type: 'duration'
    displayUnits: ['hour', 'minute']
  }
}

export interface TimeQuestion extends Question {
  inputItem: InputItem & {
    type: 'time'

    formatOptions?: FormatOptionsTime
  }
}

export interface NumericQuestion extends Question {
  inputItem: InputItem & {
    type: 'integer'
    formatOptions?: FormatOptionsInteger
  }
}

export interface YearQuestion extends Question {
  inputItem: InputItem & {
    type: 'year'
    formatOptions?: FormatOptionsYear
  }
}

export interface BaseStep {
  identifier: string //'step1',
  controlType?: ControlType
  type:
    | 'overview'
    | 'completion'
    | 'unkonwn'
    | 'instruction'
    | 'simpleQuestion'
    //| 'multipleInputQuestion'
    | 'choiceQuestion'
  //   | 'comboBoxQuestion' //otherInputItem
  title: string //Instruction Step 1',
  subtitle?: string
  detail?: string //Here are the details for this instruction.',
  comment?: string
  footnote?: string //'This is a footnote.',
  image?: /*ImageAnimated | ImageFetchable |*/ ImageResource
  shouldHideActions?: ActionButtonName[]
  actions?: {goForward?: ActionButton; cancel?: ActionButton}
}

export type Step = Question | Instruction

export type ActionButtonName =
  | 'goForward' /* Navigate to the next step.*/
  | 'goBackward' /* Navigate to the previous step.*/
  | 'skip' /*Skip the step and immediately go forward.*/
  | 'cancel' /*Exit the assessment.*/
  | 'pause'
  | 'reviewInstructions'

export type WebUISkipOptions = 'SKIP' | 'NO_SKIP' | 'CUSTOMIZE'
export type InterruptionHandlingType = {
  canResume: boolean
  reviewIdentifier?: 'beginning'
  canSkip: boolean
  canSaveForLater: boolean
}
export type SurveyConfig = {
  webConfig?: {skipOption?: WebUISkipOptions}
  type: string //'assessment',
  interruptionHandling?: InterruptionHandlingType
  identifier: string //'foo',

  versionString?: string //'1.2.3',
  schemaIdentifier?: string //'bar',
  title?: string //'Hello World!',
  subtitle?: string //Subtitle',
  detail?: string //'Some text. This is a test.',
  estimatedMinutes?: number //4,
  icon?: string //'fooIcon', ALINA TODO where is it coming from
  footnote?: string //This is a footnote.',
  actions?: {goForward: ActionButton; cancel: ActionButton}
  shouldHideActions?: ActionButtonName[] //['goBackward']
  progressMarkers?: string[] //['step1','step2'],
  steps: Step[]
}
export type Survey = {
  version?: number
  config: SurveyConfig
}
