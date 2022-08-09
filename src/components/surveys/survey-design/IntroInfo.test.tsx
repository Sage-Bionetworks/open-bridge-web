import {act, cleanup, fireEvent, render, screen} from '@testing-library/react'
import SurveyAssessment from '__test_utils/mocks/surveyAssessment'

import {loggedInSessionData} from '__test_utils/mocks/user'
import {ProvideTheme} from '__test_utils/utils'
import IntroInfo from './IntroInfo'

import * as useUserSessionDataState from '@helpers/AuthContext'
import userEvent from '@testing-library/user-event'
import {SurveyConfig} from '@typedefs/surveys'

jest.mock('@helpers/AuthContext')
jest.mock('@services/studyHooks')
jest.mock('@services/assessmentHooks')

const surveyConfig: SurveyConfig = {
  type: 'assessment',
  identifier: 'surveyA',

  versionString: '1.0.0',
  estimatedMinutes: 3,
  shouldHideActions: ['skip', 'goBackward'],
  title: 'Example Survey A',
  detail: 'This is intended as an example of a survey with a list of questions',
  interruptionHandling: {
    canResume: false,

    canSkip: false,
    canSaveForLater: false,
  },
  steps: [],
}

const mockedAuth = useUserSessionDataState as jest.Mocked<
  typeof useUserSessionDataState
>

const onUpdateFn = jest.fn()

afterEach(cleanup)

function renderComponent(survey: SurveyConfig | undefined) {
  mockedAuth.useUserSessionDataState.mockImplementation(
    () => loggedInSessionData
  )
  const surv = survey ? {config: survey} : undefined
  return render(
    <ProvideTheme>
      <IntroInfo
        survey={surv}
        surveyAssessment={SurveyAssessment}
        onUpdate={(asmnt, survey, action) =>
          onUpdateFn(asmnt, survey, action)
        }></IntroInfo>
    </ProvideTheme>
  )
}
describe('<IntroInfo/>', () => {
  test('should display and set correct assessment information', () => {
    const component = renderComponent(surveyConfig)

    const surveyName = screen.getByRole('textbox', {name: /survey name/i})
    const minutes = screen.getByRole('textbox', {
      name: /how long will this survey take/i,
    })
    const saveBtn = component.getByRole('button', {name: /save/i})
    userEvent.click(saveBtn)
    expect(saveBtn).not.toBeDisabled()

    for (var tag of SurveyAssessment.tags) {
      let tagVal = screen.getByText(tag, {exact: false})
      expect(tagVal).toBeInTheDocument()
    }

    expect(surveyName).toHaveValue(SurveyAssessment.title)
    expect(minutes).toHaveValue(SurveyAssessment.minutesToComplete?.toString())
    fireEvent.change(surveyName, {target: {value: 'Mock Name'}})
    fireEvent.change(minutes, {target: {value: '1'}})

    act(() => {
      saveBtn.focus()
      saveBtn.click()
    })
    expect(onUpdateFn).toHaveBeenCalledWith(
      expect.objectContaining({title: 'Mock Name', minutesToComplete: 1}),
      expect.any(Object),
      'UPDATE'
    )
  })

  test('should allow to skip and cusomize each quesiton by default ', () => {
    //default is:
    // shouldHideActions: [],
    // webConfig: {
    //   skipOption: 'CUSTOMIZE',
    // }
    //
    const component = renderComponent(undefined)
    const radios = [
      screen.getByRole('radio', {name: /allow partcipants to skip/i}),
      screen.getByRole('radio', {name: /make all survey questions required/i}),
      screen.getByRole('radio', {name: /customize each/i}),
    ]

    const navigateBackCheck = screen.getByRole('checkbox', {
      name: /allow participants to navigate/i,
    })
    expect(radios[0]).not.toBeChecked()
    expect(radios[1]).not.toBeChecked()
    expect(radios[2]).toBeChecked()
    expect(navigateBackCheck).toBeChecked()
  })

  test('should display and  set Survey Question Settings', () => {
    const component = renderComponent(surveyConfig)
    const radios = [
      screen.getByRole('radio', {name: /allow partcipants to skip/i}),
      screen.getByRole('radio', {name: /make all survey questions required/i}),
      screen.getByRole('radio', {name: /customize each/i}),
    ]

    const navigateBackCheck = screen.getByRole('checkbox', {
      name: /allow participants to navigate/i,
    })
    expect(radios[0]).not.toBeChecked()
    expect(radios[1]).toBeChecked()
    expect(radios[2]).not.toBeChecked()
    expect(navigateBackCheck).not.toBeChecked()
  })

  /* 
  default for interruptionHandling: {
      canResume: true,
      reviewInstructions: 'beginning',
      canSkip: true,
      canSaveForLater: true,
    },*/

  test('should display default "Pause Menu" settings if survey is not provided ', () => {
    const component = renderComponent(undefined)

    //pauseMenuSettings
    const review = screen.getByRole('checkbox', {name: /review instructions/i})
    const skip = screen.getByRole('checkbox', {name: /skip this activity/i})

    //save continue
    const save = screen.getByRole('radio', {name: /save & continue later /i})
    const exit = screen.getByRole('radio', {name: /exit without saving /i})
    expect(review).toBeChecked()
    expect(skip).toBeChecked()
    expect(save).toBeChecked()
    expect(exit).not.toBeChecked()
  })
  test('should display and set "Pause Menu" settings ', () => {
    const component = renderComponent(surveyConfig)

    //pauseMenuSettings
    const review = screen.getByRole('checkbox', {name: /review instructions/i})
    const skip = screen.getByRole('checkbox', {name: /skip this activity/i})

    //save continue
    const save = screen.getByRole('radio', {name: /save & continue later /i})
    const exit = screen.getByRole('radio', {name: /exit without saving /i})
    expect(review).not.toBeChecked()
    expect(skip).not.toBeChecked()
    expect(save).not.toBeChecked()
    expect(exit).toBeChecked()
  })
})
