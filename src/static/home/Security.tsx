import {default as bgRight} from '@assets/static/bg_right_box.svg'
import {Box, Grid, Paper, Typography} from '@mui/material'
import {styled} from '@mui/material/styles' //vs mui/styles
import {colors} from '@style/staticPagesTheme'
import React, {FunctionComponent} from 'react'

const SecurityContainer = styled(Box)(({theme}) => ({
  backgroundPositionY: 'bottom',
  backgroundPositionX: 'right',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.up('lg')]: {
    backgroundImage: 'url(' + bgRight + ')',
    marginRight: '-200px',
    paddingRight: '200px',
  },
}))

const Card = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: '20px',
  borderLeft: `solid 17px ${colors.primaryGreenBlue}`,
  padding: theme.spacing(20),
}))

const Security: FunctionComponent<{}> = () => {
  return (
    <SecurityContainer>
      <Typography variant="h2">Security</Typography>
      <Grid container rowSpacing={5} spacing={5}>
        <Grid item xs={12}>
          <Typography variant="h3">
            The Mobile toolbox platform provides the highest levels of modern
            security standards built-in from the ground up. We offer industry
            leading data governance best practices and patterns.
          </Typography>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography variant="h3">Secure</Typography>
          <Card>
            <ul style={{fontSize: '24px', color: colors.primaryBlue}}>
              <li> AWS hosted HIPAA-compliant web services</li>

              <li>Acquisition &amp; secure transfer of multiple data types</li>

              <li>De-identification and storage of encrypted study data</li>

              <li>
                Separation of account and study data RBAC - controlled access
              </li>
            </ul>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography variant="h3">Governance</Typography>
          <Card>
            <Typography variant="h3">
              Industry leading best practices and patterns:
            </Typography>
            <ul>
              <li> Privacy and data management toolkit</li>

              <li> Elements of informed consent</li>

              <li> Consent checklist</li>
            </ul>
          </Card>
        </Grid>
      </Grid>
    </SecurityContainer>
  )
}

export default Security
