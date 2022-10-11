import { cleanup, render } from '@testing-library/react'

import React from 'react'
import { QuestionTypeKey } from './QuestionConfigs'
import QuestionTypeDisplay from './QuestionTypeDisplay'

afterEach(cleanup)

function renderControl(name?: QuestionTypeKey, children?: React.ReactNode) {
  return name
    ? render(<QuestionTypeDisplay name={name} />)
    : render(<QuestionTypeDisplay>{children}</QuestionTypeDisplay>)
}

test('When  just the name is supplied render correct text and svg', () => {
  const render = renderControl('SINGLE_SELECT')
  expect(render.getByText('Single Select')).toBeInTheDocument()
})

test('When child element is supplied show wrapped supplied children', () => {
  const node = <button>Some Bytton</button>
  const render = renderControl(undefined, node)
  expect(render.getByRole('button')).toBeInTheDocument()
})
