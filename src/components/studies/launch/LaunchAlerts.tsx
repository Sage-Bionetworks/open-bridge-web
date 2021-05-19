import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ThemeType } from '../../../style/theme'
import { Study } from '../../../types/types'


const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
  },
 
}))

export interface LaunchAlertsProps {
  study: Study
}



const LaunchAlerts: React.FunctionComponent<
  LaunchAlertsProps
> = ({
  study,
  
}: LaunchAlertsProps) => {

  const classes = useStyles()



  return (
    <>
      {' '}
      <h3>LaunchAlerts </h3>
    
   
            <Button >
             Button
            </Button>
         
   
    </>
  )
}

export default LaunchAlerts
