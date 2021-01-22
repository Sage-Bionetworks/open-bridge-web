import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { useNavigate, useStudy } from '../../../helpers/hooks'
import { ThemeType } from '../../../style/theme'
import { StudySection } from '../sections'


const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
  
  },
 
}))

export interface PassiveFeaturesProps {
  id: string
  section: StudySection
  nextSection: StudySection
  onNavigate: Function

  children?: React.ReactNode
}


const PassiveFeatures: React.FunctionComponent<PassiveFeaturesProps> = ({ id, section, nextSection, onNavigate }: PassiveFeaturesProps) => {
  const handleError = useErrorHandler()

  const classes = useStyles()

  const { data, status, error } = useStudy(id)
  const [isLoading, setIsLoading] = useState(false)

  const [activeStep, setActiveStep] = React.useState(0)
  
  
  const {hasObjectChanged, setHasObjectChanged, saveLoader,  save} = useNavigate(section, nextSection, async()=>{
  
  }, ()=> onNavigate(nextSection, data))

 
  return (
    <>
      {' '}
      <h3>Passive Features</h3>
   
    </>
  )
}

export default PassiveFeatures
