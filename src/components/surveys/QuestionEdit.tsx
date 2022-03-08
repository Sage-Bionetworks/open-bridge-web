import EditableTextbox from '@components/widgets/EditableTextbox'
import {Box, makeStyles} from '@material-ui/core'
import {latoFont} from '@style/theme'
import React, {FunctionComponent} from 'react'
import {Step} from './types'

const useStyles = makeStyles(theme => ({
  root: {},
  phone: {
    height: '590px',
    width: '307px',
    border: '1px solid black',
    borderRadius: '25px',
    padding: theme.spacing(5, 2),
  },
  title: {
    fontFamily: latoFont,

    fontWeight: 'bold',
    fontSize: '24px',
    lineHeight: '1.1',
    textAlign: 'center',

    /* Black: Dark Font */

    color: theme.palette.text.secondary,
  },
}))

type QuestionEditOwnProps = {
  step?: Step
  onChange: (step: Step) => void
  //  onAdd: (a: string) => void
  // onNavigate: (id: string) => void
}

type QuestionEditProps = QuestionEditOwnProps

const QuestionEdit: FunctionComponent<QuestionEditProps> = ({
  step,
  onChange,
}) => {
  const classes = useStyles()
  console.log('step changed')

  return (
    <Box bgcolor="#F8F8F8" px={5}>
      <Box className={classes.phone}>
        {step ? (
          <div className={classes.title}>
            <EditableTextbox
              initValue={step.title}
              onTriggerUpdate={(newText: string) =>
                onChange({...step, title: newText})
              }></EditableTextbox>
          </div>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
}
export default QuestionEdit
