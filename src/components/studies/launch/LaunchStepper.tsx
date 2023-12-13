import {Container, Step, StepButton, StepLabel, stepLabelClasses} from '@mui/material'
import StepConnector, {stepConnectorClasses} from '@mui/material/StepConnector'
import {StepIconProps} from '@mui/material/StepIcon'
import Stepper from '@mui/material/Stepper'
import {styled} from '@mui/material/styles'
import React from 'react'

import AssignmentLateTwoToneIcon from '@mui/icons-material/AssignmentLateTwoTone'
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone'
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone'
import PrivacyTipTwoToneIcon from '@mui/icons-material/PrivacyTipTwoTone'

const StyledStepConnector = styled(StepConnector)(({theme}) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 18,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#C22E49',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#C22E49',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 4,
    border: 0,
    backgroundColor: '#DFE2E6',
    borderRadius: 0,
  },
}))

const ColorlibStepIconRoot = styled('div')<{
  ownerState: {completed?: boolean; active?: boolean}
}>(({theme, ownerState}) => ({
  backgroundColor: '#DFE2E6;',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',

  ...(ownerState.active && {
    backgroundColor: '#C22E49',

    // boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#C22E49',
  }),
}))

function ColorlibStepIcon(props: StepIconProps) {
  const {active, completed, className} = props

  const icons: {[index: string]: React.ReactElement} = {
    1: <AssignmentLateTwoToneIcon />,
    2: <PrivacyTipTwoToneIcon />,
    3: <PeopleAltTwoToneIcon />,
    4: <DescriptionTwoToneIcon />,
  }

  return (
    <ColorlibStepIconRoot ownerState={{completed, active}} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

type LaunchStepperProps = {
  activeStep: number
  setActiveStepFn: Function
  steps: {label: string; isComplete?: boolean}[]
}

const LaunchStepper: React.FunctionComponent<LaunchStepperProps> = ({
  activeStep,
  setActiveStepFn,
  steps,
}: LaunchStepperProps) => {
  return (
    <Container maxWidth="md" sx={{position: 'relative', height: '130px'}}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<StyledStepConnector />}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton onClick={() => setActiveStepFn(index)} disabled={!step.isComplete}>
              <StepLabel
                sx={{
                  [`& .${stepLabelClasses.alternativeLabel}`]: {
                    color: '#AEB5BC',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '14px',
                  },
                  [`& .${stepLabelClasses.alternativeLabel}.${stepLabelClasses.active},
                  .${stepLabelClasses.alternativeLabel}.${stepLabelClasses.completed}
                   `]: {
                    color: '#22252A',
                  },
                }}
                StepIconComponent={ColorlibStepIcon}>
                {step.label}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Container>
  )
}

export default LaunchStepper
