export enum SurveyRuleOperator {
  /**
   * The answer value is equal to the matching answer.
   */

  Equal = 'eq',

  /**
   * The answer value is *not* equal to the matching answer.
   */
  NotEqual = 'ne',
  /// The answer value is less than the matching answer.

  LessThan = 'lt',

  /// The answer value is greater than the matching answer.

  GreaterThan = 'gt',

  /// The answer value is less than or equal to the matching answer.

  LessThanEqual = 'le',

  /// The answer value is greater than or equal to the matching answer.

  GreaterThanEqual = 'ge',

  /**
   * The rule should always evaluate to true.
   */

  Always = 'always',

  /**
   * Survey rule for checking if the answer was skipped.
   */

  Skip = 'de',
}

export type ActionButton = {
  type: string //"default",
  buttonTitle?: string //"Go, Dogs! Go!"
  iconName?: string //"fooIcon", ALINA TODO where is it coming from
}

export type ImageFetchable = {
  type: 'fetchable'
  imageName: string //"crf_seated"
}
export type ImageAnimated = {
  type: 'animated'
  compositeImageName: string //"crf_stair_step_start_animation",
  animationDuration: number //0.5,
  imageNames: string[]
}

export type InputItem = {
  type: 'string' | 'year' | 'checkbox'
  placeholder: string
  fieldLabel: string
}

export type Skip = {
  type: 'skipCheckbox'
  fieldLabel: string
}

export type ChoiceQuestion = Question & {
  choices?: {
    text: string
    value: string | number
    exclusive?: boolean
    icon?: string
  }[]

  singleChoice?: boolean
}

export type Question = BaseStep & {
  optional: boolean //true,
  inputItem: InputItem
  skipCheckbox?: Skip
  baseType?: 'integer'
  uiHint?: 'checkmark'
}

export type Instruction = BaseStep & {}

export type BaseStep = {
  identifier: string //"step1",
  type:
    | 'instruction'
    | 'simpleQuestion'
    | 'multipleInputQuestion'
    | 'choiceQuestion'
  title: string //Instruction Step 1",
  subtitle?: string
  detail?: string //Here are the details for this instruction.",
  footnote?: string //"This is a footnote.",
  image: ImageAnimated | ImageFetchable
}

export type Step = Question | Instruction

export type Survey = {
  type: string //"assessment",
  identifier: string //"foo",
  versionString: string //"1.2.3",
  schemaIdentifier: string //"bar",
  title: string //"Hello World!",
  subtitle?: string //Subtitle",
  detail: string //"Some text. This is a test.",
  estimatedMinutes: number //4,
  icon: string //"fooIcon", ALINA TODO where is it coming from
  footnote?: string //This is a footnote.",
  actions: {goForward: ActionButton; cancel: ActionButton}
  houldHideActions: string[] //["goBackward"]
  progressMarkers: string[] //["step1","step2"],
}
