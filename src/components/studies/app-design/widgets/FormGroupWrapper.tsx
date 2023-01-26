import {FormGroup} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React from 'react'

const useStyles = makeStyles(theme => ({
  formFields: {
    '&:not(:last-of-type)': {
      marginBottom: theme.spacing(3),
    },
    '& .MuiFormControl-root:not(:last-of-type)': {
      marginBottom: theme.spacing(2),
    },
  },
}))

const FormGroupWrapper: React.FunctionComponent = props => {
  const classes = useStyles()
  return <FormGroup className={classes.formFields}>{props.children}</FormGroup>
}

export default FormGroupWrapper
