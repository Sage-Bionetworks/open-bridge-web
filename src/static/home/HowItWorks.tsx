import {ReactComponent as Step1} from '@assets/static/home_step1.svg'
import {ReactComponent as Step2} from '@assets/static/home_step2.svg'
import {ReactComponent as Step3} from '@assets/static/home_step3.svg'
import {ReactComponent as Step4} from '@assets/static/home_step4.svg'
import {ReactComponent as MoreArrow} from '@assets/static/more_arrow.svg'
import {ReactComponent as StepperArrow} from '@assets/static/stepper_arrow.svg'
import {Grid, Typography} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MobileStepper from '@mui/material/MobileStepper'
import {styled, useTheme} from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import * as React from 'react'
import {FunctionComponent} from 'react'
import {Link} from 'react-router-dom'
import SwipeableViews from 'react-swipeable-views'
import {autoPlay} from 'react-swipeable-views-utils'

const useStyles = makeStyles(theme => ({
  stepper: {backgroundColor: 'transparent'},
  dot: {
    backgroundColor: theme.palette.common.white,
    width: theme.spacing(4),
    height: theme.spacing(4),
    opacity: 0.3,
  },
  dotActive: {
    opacity: 1,
  },
}))

const Stepper = styled(MobileStepper)(({theme}) => ({
  '&.MuiPaper-root': {
    backgroundColor: 'transparent',
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

const Item = styled('div')<{test?: number}>(({theme, test}) => ({
  //backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  //...theme.typography.body1,
  /*  ...theme.typography.body2,*/
  padding: theme.spacing(1),
  border: '1px solid black',
  textAlign: 'left',
  color: theme.palette.text.primary,
  background: test,
  borderRadius: 0,
}))

const Intro = styled('p')(({theme}) => ({
  py: 7,
  fontSize: '24px',
  lineHeight: '29px',
  opacity: 0.6,
}))

const LearnMoreLink = styled(Link)(({theme}) => ({
  color: '#37E7E7',
  fontSize: '14px',
  textDecoration: 'none',

  display: 'flex',
  lineHeight: '14px',
  flexDirection: 'row',
  alignItems: 'center',
}))

const Body = styled('p')(({theme}) => ({
  fontFamily: latoFont,
  fontStyle: 'normal',
  fontWeight: 300,
  fontSize: '14px',
  // fontSize: '14px',
  lineHeight: '17px',
  marginBottom: theme.spacing(4),
}))

const info = [
  {
    title: 'How it works',
    intro:
      'A Study Designer selects the assessments and designs the schedule for a study.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis bibendum senectus amet diam dui felis est dolor tincidunt. Blandit penatibus odio viverra est nisl ut velit feugiat donec. Pulvinar nullam amet suspendisse faucibus auctor ac tellus. Sed cras dictum at volutpat. Scelerisque sem pharetra ac turpis ipsum condimentum a mattis amet.',
    link: 'www.google.com',
    image: <Step1 width="100%" />,
  },
  {
    title: 'How it works',
    intro:
      ' A Study Coordinator recruits participants to the study and auto-distributes the study to the App Store',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis bibendum senectus amet diam dui felis est dolor tincidunt. Blandit penatibus odio viverra est nisl ut velit feugiat donec. Pulvinar nullam amet suspendisse faucibus auctor ac tellus. Sed cras dictum at volutpat. Scelerisque sem pharetra ac turpis ipsum condimentum a mattis amet.',
    link: 'www.google.com',
    image: <Step2 width="100%" />,
  },
  {
    title: 'How it works',
    intro:
      'Study participants download the App and perform remote cognitive assessments using their own smartphone.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis bibendum senectus amet diam dui felis est dolor tincidunt. Blandit penatibus odio viverra est nisl ut velit feugiat donec. Pulvinar nullam amet suspendisse faucibus auctor ac tellus. Sed cras dictum at volutpat. Scelerisque sem pharetra ac turpis ipsum condimentum a mattis amet.',
    link: 'www.google.com',
    image: <Step3 width="100%" />,
  },
  {
    title: 'How it works',
    intro: 'Data is uploaded to the Sage platform and made ready for analysis.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis bibendum senectus amet diam dui felis est dolor tincidunt. Blandit penatibus odio viverra est nisl ut velit feugiat donec. Pulvinar nullam amet suspendisse faucibus auctor ac tellus. Sed cras dictum at volutpat. Scelerisque sem pharetra ac turpis ipsum condimentum a mattis amet.',
    link: 'www.google.com',
    image: <Step4 width="100%" />,
  },
]

export const HowItWorksDesktop: FunctionComponent = () => {
  return (
    <Grid
      container
      rowSpacing={{xs: 2, md: 59}}
      justifyContent="space-between"
      alignItems="center">
      {info.map((item, index) => (
        <>
          <Grid item xs={12} md={3}>
            <Item>
              <Typography variant="h2" mb={12}>
                {item.title}
              </Typography>
              <Typography variant="h1" sx={{color: '#37E7E7'}}>
                0{index + 1}
              </Typography>
              <Intro>{item.intro}</Intro>
              <Body>{item.body}</Body>
              <LearnMoreLink to={item.link}>
                Learn More&nbsp;&nbsp;
                <MoreArrow />
              </LearnMoreLink>
            </Item>
          </Grid>
          <Grid item xs={12} md={7}>
            <Item sx={{textAlign: {xs: 'center', md: 'right'}}}>
              {item.image}
            </Item>
          </Grid>
        </>
      ))}
    </Grid>
  )
}

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

export const HowItWorksMobile: FunctionComponent = () => {
  const classes = useStyles()
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState(0)
  const maxSteps = info.length

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleStepChange = (step: number) => {
    setActiveStep(step)
  }

  return (
    <Box textAlign="left" alignContent={'center'}>
      <Box textAlign="left">
        <Typography variant="h2" mb={12}>
          {info[activeStep].title}
        </Typography>
        <Intro>{info[activeStep].intro}</Intro>
        <Body>{info[activeStep].body}</Body>
        <LearnMoreLink to={info[activeStep].link}>
          Learn More&nbsp;&nbsp;
          <MoreArrow />
        </LearnMoreLink>
      </Box>
      <AutoPlaySwipeableViews
        interval={10000}
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents>
        {info.map((item, index) => (
          <div key={index}>{item.image}</div>
        ))}
      </AutoPlaySwipeableViews>
      <Stepper
        steps={maxSteps}
        position="static"
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
