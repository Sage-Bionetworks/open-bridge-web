
import Alert from '@material-ui/lab/Alert/Alert'
  import * as React from 'react'
  
  export function ErrorFallback(props: any) {
    return (
 
        <Alert variant="outlined" color="error">
        <pre>{props.error.message}</pre>
        </Alert>
    )
  }

  export const ErrorHandler = (error: Error, info: {componentStack: string}) => {
    console.log('%cError Caught by Boundary: '+ error.message, 'color:red', info.componentStack)
  }