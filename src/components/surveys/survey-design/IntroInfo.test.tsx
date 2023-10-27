import {cleanup, fireEvent, render, RenderResult, screen, waitFor} from '@testing-library/react'
import SurveyAssessment from '__test_utils/mocks/surveyAssessment'

import {loggedInSessionData} from '__test_utils/mocks/user'
import {ProvideTheme} from '__test_utils/utils'
import IntroInfo from './IntroInfo'

import * as useUserSessionDataState from '@helpers/AuthContext'
import {SurveyConfig} from '@typedefs/surveys'
import {MemoryRouter} from 'react-router-dom'

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

const mockedAuth = useUserSessionDataState as jest.Mocked<typeof useUserSessionDataState>

let component: RenderResult | undefined
const onUpdateFn = jest.fn()

afterEach(() => {
  component = undefined
  cleanup()
})

function renderComponent(survey: SurveyConfig | undefined, isNew?: boolean) {
  mockedAuth.useUserSessionDataState.mockImplementation(() => loggedInSessionData)
  const surv = survey ? {config: survey} : undefined
  component = render(
    <MemoryRouter initialEntries={['/surveys']}>
      <ProvideTheme>
        <IntroInfo
          survey={surv}
          surveyAssessment={isNew ? undefined : SurveyAssessment}
          onHasChanged={() => {}} // TODO: syoung 10/23/2023 Figure out how to add a test for marking assessment as "changed"
          onUpdate={(asmnt, survey, action) => onUpdateFn(asmnt, survey, action)}></IntroInfo>
      </ProvideTheme>
    </MemoryRouter>
  )
}

async function triggerSave(isNew?: boolean) {
  const matchObj = isNew ? {name: /title page/i} : {name: /save/i}
  const saveBtn = component!.getByRole('button', matchObj)
  await waitFor(() => {
    saveBtn.focus()
    saveBtn.click()
  })
}

function getPauseMenuSettings() {
  // const review = screen.getByRole('checkbox', {name: /review instructions/i})
  const skip = screen.getByRole('checkbox', {name: /skip this activity/i})

  //save continue
  const save = screen.getByRole('radio', {name: /save & continue later /i})
  const exit = screen.getByRole('radio', {name: /exit without saving /i})
  return {skip, save, exit}
}

describe('<IntroInfo/>', () => {
  test('should display and set correct assessment information', async () => {
    renderComponent(surveyConfig)

    const surveyName = screen.getByRole('textbox', {name: /survey name/i})
    const minutes = screen.getByRole('textbox', {
      name: /how long will this survey take/i,
    })

    for (var tag of SurveyAssessment.tags) {
      let tagVal = screen.getByText(tag, {exact: false})
      expect(tagVal).toBeInTheDocument()
    }

    expect(surveyName).toHaveValue(SurveyAssessment.title)
    expect(minutes).toHaveValue(SurveyAssessment.minutesToComplete?.toString())
    fireEvent.change(surveyName, {target: {value: 'Mock Name'}})
    fireEvent.change(minutes, {target: {value: '1'}})

    await triggerSave()
    expect(onUpdateFn).toHaveBeenCalledWith(
      expect.objectContaining({title: 'Mock Name', minutesToComplete: 1}),
      expect.any(Object),
      'UPDATE'
    )
  })

  describe('for the new survey', () => {
    test('should allow to skip and cusomize each quesiton by default', () => {
      //default is:
      // shouldHideActions: [],
      //
      renderComponent(undefined, true)

      const navigateSkipCheck = screen.getByRole('checkbox', {
        name: /make all survey questions required/i,
      })
      const navigateBackCheck = screen.getByRole('checkbox', {
        name: /allow participants to navigate/i,
      })
      expect(navigateSkipCheck).not.toBeChecked()
      expect(navigateBackCheck).toBeChecked()
    })

    test('save button should have "title page" text and be disabled if there is no survey name or duration', () => {
      renderComponent(undefined, true)

      const surveyName = screen.getByRole('textbox', {name: /survey name/i})
      const minutes = screen.getByRole('textbox', {
        name: /how long will this survey take/i,
      })

      const saveForNewBtn = component!.queryByRole('button', {
        name: /title page/i,
      })
      const saveBtn = component!.queryByRole('button', {name: /save/i})
      expect(saveForNewBtn).toBeInTheDocument()
      expect(saveBtn).not.toBeInTheDocument()
      expect(saveForNewBtn).toBeDisabled()

      fireEvent.change(surveyName, {target: {value: 'Mock Name'}})
      fireEvent.change(minutes, {target: {value: '1'}})

      expect(saveForNewBtn).not.toBeDisabled()
    })

    test(' and call update with "CREATE" action', async () => {
      renderComponent(undefined, true)

      const surveyName = screen.getByRole('textbox', {name: /survey name/i})
      const minutes = screen.getByRole('textbox', {
        name: /how long will this survey take/i,
      })
      fireEvent.change(surveyName, {target: {value: 'Mock Name'}})
      fireEvent.change(minutes, {target: {value: '1'}})

      await triggerSave(true)
      expect(onUpdateFn).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), 'CREATE')
    })
  })

  test('should display and set Survey Question Settings', async () => {
    renderComponent(surveyConfig)
    const navigateSkipCheck = screen.getByRole('checkbox', {
      name: /make all survey questions required/i,
    })
    const navigateBackCheck = screen.getByRole('checkbox', {
      name: /allow participants to navigate/i,
    })
    expect(navigateSkipCheck).toBeChecked()
    expect(navigateBackCheck).not.toBeChecked()
    await waitFor(() => {
      navigateSkipCheck.focus()
      navigateSkipCheck.click()
      navigateBackCheck.focus()
      navigateBackCheck.click()
    })
    await triggerSave()
    const expectation = {
      ...surveyConfig,
      shouldHideActions: [],
    }
    expect(onUpdateFn).toHaveBeenCalledWith(expect.any(Object), {config: expectation}, 'UPDATE')
  })

  /* 
  default for interruptionHandling: {
      canResume: true,
      reviewIdentifier: undefined,
      canSkip: false,
      canSaveForLater: true,
    },*/

  test('should display default "Pause Menu" settings if info is not provided ', () => {
    renderComponent(undefined)

    const {skip, save, exit} = getPauseMenuSettings()
    expect(skip).not.toBeChecked()
    expect(save).toBeChecked()
    expect(exit).not.toBeChecked()
  })

  test('should display and set "Pause Menu" settings ', () => {
    renderComponent(surveyConfig)

    const {skip, save, exit} = getPauseMenuSettings()
    expect(skip).not.toBeChecked()
    expect(save).not.toBeChecked()
    expect(exit).toBeChecked()
  })
})
