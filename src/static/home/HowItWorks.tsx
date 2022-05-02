import {ReactComponent as Step1} from '@assets/static/home_step1.svg'
import {ReactComponent as Step2} from '@assets/static/home_step2.svg'
import {ReactComponent as Step3} from '@assets/static/home_step3.svg'
import {ReactComponent as Step4} from '@assets/static/home_step4.svg'
import {ReactComponent as MoreArrow} from '@assets/static/more_arrow.svg'
import {Grid, Typography} from '@mui/material'
import Box from '@mui/material/Box'
import {styled} from '@mui/material/styles'
import {colors} from '@style/staticPagesTheme'
import {latoFont} from '@style/theme'
import * as React from 'react'
import {FunctionComponent} from 'react'
import {Link} from 'react-router-dom'
import Carousel from './Carousel'

const Item = styled('div')<{test?: number}>(({theme, test}) => ({
  //backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  //...theme.typography.body1,
  /*  ...theme.typography.body2,*/
  padding: theme.spacing(1),
  //border: '1px solid black',
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
  color: colors.accent,
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
          <Grid item xs={12} lg={3} key={`${index}`}>
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
          <Grid item xs={12} lg={7}>
            <Item sx={{textAlign: {xs: 'center', md: 'right'}}}>
              {item.image}
            </Item>
          </Grid>
        </>
      ))}
    </Grid>
  )
}

export const HowItWorksMobile: FunctionComponent = () => {
  const [activeStep, setActiveStep] = React.useState(0)

  const innerElements = info.map((item, index) => (
    <Box textAlign="left">
      <Typography variant="h2" mb={12}>
        {item.title}
      </Typography>
      <Intro>{item.intro}</Intro>
      <Body>{item.body}</Body>
      <LearnMoreLink to={item.link}>
        Learn More&nbsp;&nbsp;
        <MoreArrow />
      </LearnMoreLink>

      <div key={index}>{item.image}</div>
    </Box>
  ))

  return (
    <Grid container>
      <Grid item xs={12} textAlign="left" alignContent={'center'}>
        <Carousel
          elements={innerElements}
          activeStep={activeStep}
          onChangeStep={step => {
            setActiveStep(step)
          }}></Carousel>
      </Grid>
    </Grid>
  )
}
