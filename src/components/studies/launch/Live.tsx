import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { ThemeType } from '../../../style/theme'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
  },
}))



const Live: React.FunctionComponent<RouteComponentProps> = ({
  
}: RouteComponentProps) => {
  const classes = useStyles()

  return (
    <>
      {' '}
      <h3>Live </h3>

      { <Button>Live</Button>}
    </>
  )
}

export default Live
