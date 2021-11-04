import {FormGroup} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {poppinsFont} from '../../../../style/theme'

const useStyles = makeStyles(theme => ({
  formFields: {
    fontFamily: poppinsFont,
    fontSize: '14px',
    marginBottom: theme.spacing(3),
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
}))

const FormGroupWrapper: React.FunctionComponent = props => {
  const classes = useStyles()
  return <FormGroup className={classes.formFields}>{props.children}</FormGroup>
}

export default FormGroupWrapper
