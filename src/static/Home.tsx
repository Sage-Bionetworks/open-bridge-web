import Utility from '@helpers/utility'
import {Box, Container, Grid, Typography} from '@mui/material'
import {styled, ThemeProvider} from '@mui/material/styles'
import staticPagesTheme, {colors} from '@style/staticPagesTheme'
import * as React from 'react'
import {FunctionComponent} from 'react'
import {routes} from '../routes_public'
import HowItWorks from './HowItWorks'
import TopNav from './nav/TopNav'

const Item = styled(Box)<{test?: number}>(({theme, test}) => ({
  //backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  //...theme.typography.body1,
  /*  ...theme.typography.body2,*/
  padding: theme.spacing(1),
  //border: '1px solid black',

  color: theme.palette.text.primary,
  background: test,
  borderRadius: 0,
}))

const Home: FunctionComponent = () => {
  return (
    <ThemeProvider theme={staticPagesTheme}>
      <div style={{backgroundColor: colors.primaryDarkBlue, color: '#FFF'}}>
        <Container maxWidth={'lg'} component={'div'}>
          <TopNav routes={routes} appId={Utility.getAppId()} />
          <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            {/*header */}
            <Grid item xs={12} md={12}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Item my={32}>
                    <Typography variant="h1">Mobile Toolbox</Typography>
                    <Typography variant="h3" sx={{opacity: 0.6}}>
                      A comprehensive research and analytics platform to launch
                      fully remote, smartphone app-based cognitive assessment
                      studies.
                    </Typography>
                  </Item>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/*how it works */}
          <HowItWorks />

          <Grid container direction="row" justifyContent="center">
            <Grid item xs={12} md={10}>
              <Item>Experiences</Item>
              <Grid container>
                <Grid item xs={12} md={6}>
                  P1
                </Grid>
                <Grid item xs={12} md={6}>
                  P2
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  )
}
export default Home
