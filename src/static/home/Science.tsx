import {Box, Grid, Typography} from '@mui/material'
import {styled} from '@mui/material/styles' //vs mui/styles
import React, {FunctionComponent} from 'react'
import StyledLink from './StyledLink'

const ScienceContainer = styled(Box)(({theme}) => ({
  /* backgroundPositionY: 'bottom',
  backgroundPositionX: 'right',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.up('lg')]: {
    backgroundImage: 'url(' + bgRight + ')',
    marginRight: '-200px',
    paddingRight: '200px',
  },*/
}))

const Science: FunctionComponent<{}> = () => {
  return (
    <ScienceContainer>
      <Typography variant="h2">Trusted Science</Typography>
      <Grid
        container
        rowSpacing={5}
        sx={{
          //  backgroundImage: {lg: 'url(' + bgLeft + ')'},
          backgroundPositionY: 'bottom',
          backgroundPositionX: 'left',
          backgroundRepeat: 'no-repeat',

          marginLeft: {lg: -50},
          paddingLeft: {lg: 50},
        }}>
        <Grid item xs={12} lg={6}>
          <Box>
            <Typography variant="h3" sx={{opacity: 0.6}}>
              Mobile toolbox is a modern, mobile version of NIH Toolbox
              cognitive assessments. Mobile toolbox cognitive assessments have
              been validated against gold standard measures in healthy adults
              ages 20-85. The assessments have been normed and 3-month, 12-month
              and 24-month change scores calculated in an age-stratified
              (20-85), iOS vs Android, national sample matching the 2020 US
              Census (N=6,800) for gender, race, ethnicity, SES and level of
              education.
            </Typography>
            <Typography variant="h3" sx={{opacity: 0.6}}>
              Additional validation and longitudinal evaluation is in-progress
              (2022-2023) in healthy and clinical samples, including persons at
              risk for MCI or AD, cognitively impaired and those with
              Parkinson’s disease.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box>
            <Typography component="p">
              <StyledLink to=""> Try out the assessments</StyledLink>
              Try out the assessments yourself with our demo app or start
              designing your own custom study through our Researcher web. You
              can customize your study schedule, assessments, and the look and
              feel of the app. Preview your study before you release it live for
              participants.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </ScienceContainer>
  )
}

export default Science
