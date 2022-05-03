import {default as bgExperiences} from '@assets/static/bg_home_experiences.svg'
import {default as bgSecurity} from '@assets/static/bg_home_security.svg'
import Utility from '@helpers/utility'
import {Box, Container, Grid, Hidden, Typography} from '@mui/material'
import {styled, ThemeProvider} from '@mui/material/styles'
import staticPagesTheme, {colors} from '@style/staticPagesTheme'
import * as React from 'react'
import {FunctionComponent} from 'react'
import TopNav from 'static/nav/TopNav'
import {routes} from '../../routes_public'
import About from './About'
import Contribute from './Contribute'
import Experiences from './Experiences'
import {HowItWorksDesktop, HowItWorksMobile} from './HowItWorks'
import Partners from './Partners'
import Project from './Project'
import Science from './Science'
import Security from './Security'

const Item = styled(Box)<{test?: number}>(({theme, test}) => ({
  //backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  //...theme.typography.body1,
  /*  ...theme.typography.body2,*/
  // padding: theme.spacing(1),
  /*[theme.breakpoints.down('lg')]: {
    padding: theme.spacing()
  },*/
  //border: '1px solid black',

  color: theme.palette.text.primary,
  background: test,
  borderRadius: 0,
}))

const Section = styled(Box)(({theme}) => ({
  padding: theme.spacing(10, 6),
  position: 'relative',
  maxWidth: '1180px',

  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(24),
    // minWidth: '1500px',
  },
}))

const Home: FunctionComponent = () => {
  return (
    <ThemeProvider theme={staticPagesTheme}>
      <div style={{backgroundColor: colors.primaryDarkBlue, color: '#FFF'}}>
        <Container
          maxWidth={'lg'}
          fixed={true}
          disableGutters={false}
          component={'div'}>
          <TopNav routes={routes} appId={Utility.getAppId()} />
          <Grid container rowSpacing={1} columnSpacing={{xs: 4, lg: 5}}>
            {/*header */}

            <Grid item xs={12} lg={6}>
              <Item my={32} mx={1}>
                <Typography variant="h1">Mobile Toolbox!</Typography>
                <Typography variant="h3" sx={{opacity: 0.6}}>
                  A comprehensive research and analytics platform to launch
                  fully remote, smartphone app-based cognitive assessment
                  studies.
                </Typography>
              </Item>
            </Grid>
          </Grid>
          {/*how it works */}
          <Hidden lgUp>
            <HowItWorksMobile />
          </Hidden>
          <Hidden lgDown>
            <HowItWorksDesktop />
          </Hidden>

          <Grid
            container

            // direction="row"
            // justifyContent="center"
          >
            <Grid item xs={12}>
              <Section
                sx={{
                  backgroundSize: '100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left bottom 80px',
                  backgroundImage: {lg: 'url(' + bgExperiences + ')'},
                }}>
                <Experiences />
              </Section>
              <Section
                bgcolor="#2E84F6"
                sx={{
                  backgroundSize: '100%',
                  backgroundRepeat: 'no-repeat',

                  backgroundImage: {lg: 'url(' + bgSecurity + ')'},
                }}>
                <>
                  <Security />
                </>
              </Section>
              <Section>
                <Science />
              </Section>
              <Section>
                <About />
              </Section>
              <Section>
                <Partners />
              </Section>
              <Section>
                <Project />
              </Section>
              <Section>
                <Contribute />
              </Section>
            </Grid>
          </Grid>
        </Container>
      </div>
      <Box height={600}></Box>
    </ThemeProvider>
  )
}
export default Home
