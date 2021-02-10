import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { FunctionComponent } from 'react'
import { EnrollmentType } from '../../../types/types'
import { BlueButton } from '../../widgets/StyledComponents'

const useStyles = makeStyles(theme => ({
  root: {},
}))

export type EnrollmentSelectorProps = {
  callbackFn: Function
}

const EnrollmentSelector: FunctionComponent<EnrollmentSelectorProps> = ({
  callbackFn,
}) => {
  const options: EnrollmentType[] = ['PHONE', 'ID']

  return (
    <Paper>
      <BlueButton onClick={() => callbackFn(options[0])}>
        Enroll with Phone Numbers
      </BlueButton>
      <BlueButton onClick={() => callbackFn(options[1])}>
        Enroll with Participant IDs
      </BlueButton>
    </Paper>
  )
}

export default EnrollmentSelector
