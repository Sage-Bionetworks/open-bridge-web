import {Box} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert/Alert'
import * as React from 'react'
import AccountLogin from '../account/AccountLogin'

export function ErrorFallback(props: any) {
  console.log(props)
  if (props.error.statusCode === 401) {
    console.log(props.error)
  }
  return (
    <>
      <Alert variant="outlined" color="error">
        <pre>
          {props.error.statusCode}
          {props.error.message}
        </pre>
      </Alert>
      {props.error.statusCode === 401 && (
        <Box mx="auto" bgcolor="white">
          <AccountLogin
            {...props}
            callbackFn={() => {
              window.location.replace('/')
            }}></AccountLogin>
        </Box>
      )}
    </>
  )
}

export const ErrorHandler = (error: Error, info: {componentStack: string}) => {
  console.log(
    '%cError Caught by Boundary:' + error.message,
    'color:red',
    info.componentStack
  )
}
