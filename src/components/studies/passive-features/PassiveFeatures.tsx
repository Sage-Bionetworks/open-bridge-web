import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { ThemeType } from '../../../style/theme'
import { StudyBuilderComponentProps } from '../../../types/types'


const useStyles = makeStyles((theme: ThemeType) => ({
  root: {},
}))

export interface PassiveFeaturesProps {
  id: string
}

const PassiveFeatures: React.FunctionComponent<
  PassiveFeaturesProps & StudyBuilderComponentProps
> = ({
  id,
  onUpdate,
  hasObjectChanged,
  saveLoader,
  children,
}: PassiveFeaturesProps & StudyBuilderComponentProps) => {
  const handleError = useErrorHandler()

  const classes = useStyles()


  const [activeStep, setActiveStep] = React.useState(0)

  return (
    <>
      {' '}
      <h3>Passive Features</h3>
    </>
  )
}

export default PassiveFeatures
