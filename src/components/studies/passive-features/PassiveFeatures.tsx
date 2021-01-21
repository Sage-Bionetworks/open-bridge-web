import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { useStudy } from '../../../helpers/hooks'
import { navigateAndSave } from '../../../helpers/utility'
import { ThemeType } from '../../../style/theme'
import { StudySection } from '../sections'


const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
  
  },
 
}))

export interface PassiveFeaturesProps {
  id: string
  section: StudySection
  nextSection?: StudySection
}


const PassiveFeatures: React.FunctionComponent<PassiveFeaturesProps> = ({ id, section, nextSection }: PassiveFeaturesProps) => {
  const handleError = useErrorHandler()
  const classes = useStyles()

  const { data, status, error } = useStudy(id)
  const [isLoading, setIsLoading] = useState(false)

  const [activeStep, setActiveStep] = React.useState(0)
  
  const [hasObjectChanged, setHasObjectChanged] = useState(false)
  const [saveLoader, setSaveLoader] = useState(false)
  const save = async (url?: string) => {

    setSaveLoader(true)
    setHasObjectChanged(false)
    setSaveLoader(false)
    if (url) {
      window.location.replace(url)
    }
  }

  React.useEffect(() => {
    navigateAndSave(id, nextSection, section, hasObjectChanged, save)
  }, [nextSection, section])

 
  return (
    <>
      {' '}
      <h3>Passive Features</h3>
   
    </>
  )
}

export default PassiveFeatures
