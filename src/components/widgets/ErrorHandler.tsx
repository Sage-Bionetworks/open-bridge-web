import {Box, Container} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert/Alert'
import * as React from 'react'
import {NavLink} from 'react-router-dom'
import AccountLogin from '../account/AccountLogin'

export function ErrorFallback(props: any) {
  console.log(props)
  if (props.error.statusCode === 401) {
    console.log(props.error)
  }

  return (
    <Container maxWidth="md">
      <Alert variant="outlined" color="error" style={{marginBottom: '40px'}}>
        <pre>
          {props.error.statusCode}:&nbsp;
          {props.error.message}
        </pre>
      </Alert>
      {props.error.statusCode === 401 && (
        <Box mx="auto" bgcolor="white" p={5} textAlign="center">
          <AccountLogin
            {...props}
            callbackFn={() => {
              window.location.replace('/')
            }}></AccountLogin>
        </Box>
      )}
      {props.error.statusCode === 403 && (
        <Box mx="auto" bgcolor="white" p={5} textAlign="center">
          <Alert
            variant="outlined"
            color="error"
            style={{marginBottom: '40px'}}>
            You do not have the permission to access this feature. Please
            contact your study administrator
          </Alert>
          <NavLink to={'/Studies'} key="home">
            Back to study listings
          </NavLink>
        </Box>
      )}
    </Container>
  )
}

export const ErrorHandler = (error: Error, info: {componentStack: string}) => {
  console.log(
    '%cError Caught by Boundary:' + error.message,
    'color:red',
    info.componentStack
  )
}
