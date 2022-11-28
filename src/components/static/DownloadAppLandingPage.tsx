import MTBLogoLarge from '@assets/logo_mtb_large.svg'
import appStoreBtn from '@assets/preview/appStoreBtn.png'
import googlePlayBtn from '@assets/preview/googlePlayBtn.png'
import QrCode from '@assets/qr_code.png'
import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont, playfairDisplayFont, theme} from '@style/theme'
import React from 'react'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingTop: theme.spacing(10),
    textAlign: 'left',
  },
  downloadText: {
    lineHeight: '28px',
    fontSize: '21px',
    fontStyle: 'italic',
    fontFamily: playfairDisplayFont,
    marginTop: theme.spacing(5),
    maxWidth: '250px',
    textAlign: 'center',
  },
  thankYouText: {
    maxWidth: '420px',
    fontFamily: latoFont,
    fontSize: '16px',
    lineHeight: '20px',
    marginTop: theme.spacing(3),
  },
  listText: {
    margin: '16px 0',
  },
}))

const DownloadAppLandingPage: React.FunctionComponent = () => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <img src={MTBLogoLarge} alt="large mtb logo" style={{width: '100px', height: '100px'}} />
      <Box className={classes.downloadText}>
        <strong>
          <i>App Download Instructions</i>
        </strong>
      </Box>

      <p className={classes.thankYouText}>
        Thank you for participating in this study.
        <br></br>
        <br></br>
        <ol>
          <li>
            To download the <strong>Mobile Toolbox App</strong>, search for "Mobile Toolbox App" in your phone's app
            store or do one of the following:
            <ul>
              <li className={classes.listText}>
                If you're viewing this page from a laptop, <strong>scan the QR code</strong> below with your phone's
                camera to be directed to the app.
              </li>
              <li className={classes.listText}>
                If you're viewing this page from the phone that you will be using for the study,{' '}
                <strong>select your app store</strong> below to be redirected to the iOS or Android app store.
              </li>
            </ul>
          </li>
          <li>To log into the app, your Research team will need to provide you with a Study ID and Participant ID.</li>
        </ol>
      </p>

      <Box
        sx={{
          margin: theme.spacing(2),
          padding: theme.spacing(2),
          textAlign: 'center',
          bgcolor: 'white',
        }}>
        <img src={QrCode} width="130px" alt="QR code" />
      </Box>
      <Box my={3}>
        <a
          style={{marginRight: '24px'}}
          href="https://apps.apple.com/us/app/mobile-toolbox-app/id1578358408"
          target="_blank"
          rel="noreferrer">
          <img src={appStoreBtn} alt="ios app store button"></img>
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=org.sagebionetworks.research.mobiletoolbox.app"
          target="_blank"
          rel="noreferrer">
          <img src={googlePlayBtn} alt="google play store"></img>
        </a>
      </Box>
    </Box>
  )
}
export default DownloadAppLandingPage
