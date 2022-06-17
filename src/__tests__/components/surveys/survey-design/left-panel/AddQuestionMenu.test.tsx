import AddQuestionMenu from '@components/surveys/survey-design/left-panel/AddQuestionMenu'
import {render} from '@testing-library/react'

test('renders the landing page', () => {
  const {debug, container} = render(
    <AddQuestionMenu onSelectQuestion={qType => console.log(qType)} />
  )
  //CHECK DIV CONTAINER
  let vatSelectTextField = container.querySelector(
    '#select-survey-question'
  ) as HTMLDivElement
  expect(vatSelectTextField).toBeInTheDocument()
})
