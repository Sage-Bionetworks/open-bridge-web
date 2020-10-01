import React, { FunctionComponent } from 'react'


import clsx from 'clsx'
import { makeStyles, Box, Button } from '@material-ui/core'
import AssessmentSmall from '../../assessments/AssessmentSmall'

const useStyles = makeStyles({
  root: {
    padding: '12px',
    border: '1px solid #C4C4C4',
    width: '265px',
    marginRight: '26px',
  },

})

type NewStudySessionContainerProps = {
  onAddSession: Function
}



const NewStudySessionContainer: FunctionComponent<NewStudySessionContainerProps> = ({
  onAddSession,
}: NewStudySessionContainerProps) => {
  const classes = useStyles()

  return (
    <Box className={clsx(classes.root)}>
      <Button variant="text" onClick={() => onAddSession()}>
        + Create new session
      </Button>
    </Box>
  )
}

export default NewStudySessionContainer
