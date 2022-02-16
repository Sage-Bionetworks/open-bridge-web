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

export type InputString = {
  type: 'string'
  placeholder: string
}
export type Skip = {
  type: 'skipCheckbox'
  fieldLabel: string
}

export type Question = Step & {
  subtitle: string //"Subtitle goes here",

  footnote: string //"This is a footnote.",

  optional: boolean //true,
  inputItem: InputString
  skipCheckbox?: Skip
}

export type Step = {
  identifier: string //"step1",
  type: 'instruction' | 'question'
  title: string //Instruction Step 1",
  detail: string //Here are the details for this instruction.",
  image: ImageAnimated | ImageFetchable
}

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
