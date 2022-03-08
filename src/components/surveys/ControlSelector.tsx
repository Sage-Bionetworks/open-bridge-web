import {Box, Button, makeStyles} from '@material-ui/core'
import {latoFont} from '@style/theme'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#464646',
    padding: theme.spacing(5),
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  control: {
    backgroundColor: '#3A3939',
    color: '#fff',
    padding: theme.spacing(2),
    fontFamily: latoFont,
    textAlign: 'center',
    fontSize: '21px',
    lineHeight: '27px',
    width: '137px',
    display: 'block',
    height: '128px',
    '&:hover': {
      backgroundColor: '#252525',
    },
    '&.selected': {
      border: '1px solid white',
    },
    '&.Mui-disabled': {
      opacity: 0.3,
    },
  },
  icon: {
    width: '23px',
    height: '23px',
    margin: 'auto',
    marginBottom: theme.spacing(1),
    border: '1px solid white',
    '&.disabled': {
      borderColor: '#ddd',
    },
  },
}))

type ControlSelectorOwnProps = {
  studyId?: string
}

type ControlType = 'radio' | 'checkbox' | 'text' | 'likert' | 'time' | 'date'

type Control = {
  title: string
  type: ControlType
  replace: ControlType[]
}

const controls: Control[] = [
  {
    title: 'Select One',
    type: 'radio',
    replace: ['likert', 'checkbox', 'radio'],
  },
  {
    title: 'Checkbox',
    type: 'checkbox',
    replace: ['likert', 'checkbox', 'radio'],
  },
  {title: 'Text input', type: 'text', replace: []},
  {
    title: 'Likert Scale',
    type: 'likert',
    replace: ['likert', 'checkbox', 'radio'],
  },
  {title: 'Date', type: 'date', replace: ['time']},
  {title: 'Time', type: 'time', replace: ['date']},
]

type ControlSelectorProps = ControlSelectorOwnProps

const ControlSelector: FunctionComponent<ControlSelectorProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const classes = useStyles()
  const [selectedControl, setSelectedControl] = React.useState<
    Control | undefined
  >()

  const clickControl = (control: Control) => {
    selectedControl?.type === control.type
      ? setSelectedControl(undefined)
      : setSelectedControl(control)
  }

  return (
    <Box className={classes.root} px={5}>
      {controls.map(x => (
        <Button
          key={x.type}
          className={clsx(
            classes.control,
            x.type === selectedControl?.type && 'selected'
          )}
          onClick={() => clickControl(x)}
          disabled={
            selectedControl &&
            !selectedControl.replace.includes(x.type) &&
            selectedControl.type !== x.type
          }>
          <Box
            width={23}
            height={23}
            margin="auto"
            mb={1}
            borderColor="#fff"
            border={'1px solid white'}></Box>
          {x.title}
        </Button>
      ))}
    </Box>
  )
}
export default ControlSelector
