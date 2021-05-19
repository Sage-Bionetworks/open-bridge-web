import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormGroup } from '@material-ui/core'
import { poppinsFont } from '../../../style/theme'

const useStyles = makeStyles(theme => ({
  formFields: {
    fontFamily: poppinsFont,
    fontSize: '14px',
    marginBottom: '24px',
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: '16px',
    },
  },
}))

const FormGroupWrapper: React.FunctionComponent = props => {
  const classes = useStyles()
  return <FormGroup className={classes.formFields}>{props.children}</FormGroup>
}

export default FormGroupWrapper
