import {makeStyles} from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning'
import React, {FunctionComponent, ReactNode} from 'react'
import {ThemeType} from '../../style/theme'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    color: theme.palette.error.main,
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),

    '& span': {
      fontSize: '12px',
      paddingLeft: theme.spacing(1),
      paddingTop: theme.spacing(0.5),
    },
  },
}))

export type ErrorDisplayType = {
  children: ReactNode
}

const ErrorDisplay: FunctionComponent<
  ErrorDisplayType & React.HTMLAttributes<HTMLElement>
> = ({children, ...rest}) => {
  const classes = useStyles()
  return (
    <div className={classes.root} style={rest.style}>
      <WarningIcon></WarningIcon>
      <span>{children}</span>
    </div>
  )
}

export default ErrorDisplay
