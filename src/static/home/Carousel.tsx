import {ReactComponent as StepperArrow} from '@assets/static/stepper_arrow.svg'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MobileStepper from '@mui/material/MobileStepper'
import {styled, useTheme} from '@mui/material/styles'
import * as React from 'react'
import {FunctionComponent} from 'react'
import SwipeableViews from 'react-swipeable-views'

const Stepper = styled(MobileStepper, {
  shouldForwardProp: prop => prop !== 'vPosition',
})<{vPosition?: 'top' | 'bottom'}>(({theme, vPosition}) => ({
  '&.MuiPaper-root': {
    backgroundColor: 'transparent',
    color: 'transparent', //aling to do: 'remove text
    position: vPosition == 'top' ? 'absolute' : 'static',
    top: vPosition === 'top' ? theme.spacing(0) : 'auto',
    left: vPosition === 'top' ? theme.spacing(-10) : 'auto',
    right: vPosition === 'top' ? theme.spacing(-10) : 'auto',
  },
  '& .MuiMobileStepper-dot': {
    backgroundColor: theme.palette.common.white,
    width: theme.spacing(4),
    height: theme.spacing(4),
    opacity: 0.3,
    margin: theme.spacing(0, 2),
  },
  '& .MuiMobileStepper-dotActive': {
    opacity: 1,
  },
}))
const AutoPlaySwipeableViews = SwipeableViews //autoPlay(SwipeableViews)

type CarouselProps = {
  elements: React.ReactNode[]
  activeStep: number

  onChangeStep: (n: number) => void
  variant?: 'dots' | 'text'
  position?: 'top' | 'bottom'
}

const Carousel: FunctionComponent<CarouselProps> = ({
  elements,
  onChangeStep,
  activeStep,
  variant = 'dots',
  position = 'bottom',
}) => {
  const theme = useTheme()
  const maxSteps = elements.length
  const handleNext = () => {
    onChangeStep(++activeStep)
  }

  const handleBack = () => {
    onChangeStep(--activeStep)
  }

  const handleStepChange = (step: number) => {
    onChangeStep(step)
  }
  console.log(position)

  return (
    <Box
      id="alina"
      alignContent={'center'}
      position={position === 'bottom' ? 'static' : 'relative'}>
      <AutoPlaySwipeableViews
        // interval={/*10000*/ undefined}
        axis={'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents>
        {elements.map((element, index) => (
          <Box key={index}>{element}</Box>
        ))}
      </AutoPlaySwipeableViews>
      <Stepper
        steps={maxSteps}
        position="static"
        vPosition={position}
        variant={variant}
        activeStep={activeStep}
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <StepperArrow />
          </Button>
        }
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}>
            <StepperArrow style={{transform: 'rotate(180deg)'}} />
          </Button>
        }
      />
    </Box>
  )
}
export default Carousel
