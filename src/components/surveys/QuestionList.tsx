import {Box, Button, makeStyles} from '@material-ui/core'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {Step} from './types'

const useStyles = makeStyles(theme => ({
  root: {},
  active: {
    border: '1px solid blue',
  },
}))

type QuestionListOwnProps = {
  steps: Step[]
  currentStepIndex?: number
  onAdd: (a: string) => void
  onNavigate: (id: string) => void
}

type QuestionListProps = QuestionListOwnProps

const QuestionList: FunctionComponent<QuestionListProps> = ({
  steps,
  onAdd,
  currentStepIndex,
  onNavigate,
}) => {
  const classes = useStyles()
  console.log(currentStepIndex)
  const getNonEmptySteps = () => steps.filter(s => s.title)
  return (
    <Box bgcolor="#F8F8F8" px={5}>
      Question here
      <ul>
        {getNonEmptySteps().map((step, index) => (
          <li key={step.identifier}>
            <Button
              className={clsx(index === currentStepIndex && classes.active)}
              variant="text"
              onClick={() => {
                onNavigate(step.identifier)
              }}>
              {step.title}
            </Button>
          </li>
        ))}
        <Button
          onClick={() => onAdd('New Question')}
          disabled={getNonEmptySteps().length < steps.length}>
          +
        </Button>
      </ul>
    </Box>
  )
}
export default QuestionList
