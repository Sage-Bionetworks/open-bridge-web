import {Box, Button, Grid, Paper, Typography} from '@mui/material'
import {styled} from '@mui/material/styles' //vs mui/styles
import {colors} from '@style/staticPagesTheme'
import React, {FunctionComponent} from 'react'

const SecurityContainer = styled(Box)(({theme}) => ({
  // backgroundPositionY: 'bottom',
  // backgroundPositionX: 'right',
  // backgroundRepeat: 'no-repeat',
  /* [theme.breakpoints.up('lg')]: {
    backgroundImage: 'url(' + bgRight + ')',
    marginRight: '-200px',
    paddingRight: '200px',
  },*/
}))

const Card = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: '20px',
  borderLeft: `solid 17px ${colors.primaryGreenBlue}`,
  padding: theme.spacing(18, 16),
  minHeight: theme.spacing(118),
  marginTop: theme.spacing(8),
}))

const InnerList = styled('ul')(({theme}) => ({
  listStyleType: 'decimal',
  paddingLeft: theme.spacing(5),
  '& li': {
    marginBottom: theme.spacing(8),
    color: colors.primaryBlue,
    paddingLeft: theme.spacing(9),
  },
}))

const Security: FunctionComponent<{}> = () => {
  return (
    <SecurityContainer>
      <Typography variant="h2" mb={10}>
        Security &amp; Governance
      </Typography>
      <Grid container rowSpacing={5} spacing={5}>
        <Grid item xs={7}>
          <Typography variant="h3" sx={{opacity: 0.6}}>
            The Mobile toolbox platform provides the highest levels of modern
            security standards built-in from the ground up. We offer industry
            leading data governance best practices and patterns.
          </Typography>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography variant="h3">Secure</Typography>
          <Card sx={{color: colors.primaryBlue}}>
            <InnerList>
              <li> AWS hosted HIPAA-compliant web services</li>

              <li>Acquisition &amp; secure transfer of multiple data types</li>

              <li>De-identification and storage of encrypted study data</li>

              <li>
                Separation of account and study data RBAC - controlled access
              </li>
            </InnerList>
          </Card>
          <Button
            color="primary"
            variant="outlined"
            sx={{mx: 'auto', mt: 8, display: 'block'}}>
            Learn More
          </Button>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography variant="h3">Governance</Typography>
          <Card sx={{color: colors.primaryBlue}}>
            <Typography variant="h3" color={colors.neutralsBlack} mb={8}>
              Industry leading best practices and patterns:
            </Typography>
            <InnerList>
              <li> Privacy and data management toolkit</li>
              <li> Elements of informed consent</li>
              <li> Consent checklist</li>
            </InnerList>
          </Card>
          <Button
            color="primary"
            variant="outlined"
            sx={{mx: 'auto', mt: 8, display: 'block'}}>
            Learn More
          </Button>
        </Grid>
      </Grid>
    </SecurityContainer>
  )
}

export default Security
