import React from 'react'
import MTBLogoLarge from '../../assets/mtb_logo_large.svg'
import {makeStyles} from '@material-ui/core/styles'
import {Box, Button} from '@material-ui/core'
import {latoFont, playfairDisplayFont} from '../../style/theme'
import appStoreBtn from '../../assets/preview/appStoreBtn.png'
import googlePlayBtn from '../../assets/preview/googlePlayBtn.png'

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
    maxWidth: '260px',
    fontFamily: latoFont,
    fontSize: '15px',
    lineHeight: '18px',
    marginTop: theme.spacing(3),
  },
}))

const DownloadAppLandingPage: React.FunctionComponent<{}> = ({}) => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <img
        src={MTBLogoLarge}
        alt="large mtb logo"
        style={{width: '100px', height: '100px'}}
      />
      <Box className={classes.downloadText}>
        Download the <strong>Mobile Toolbox App</strong>
      </Box>
      <p className={classes.thankYouText}>
        Thank you for participating.
        <br></br>
        <br></br>
        Please select the store that works best on your smartphone:
      </p>
      <Box mt={3}>
        <Button style={{marginRight: '24px'}} onClick={() => {}}>
          <img src={appStoreBtn} alt="ios app store button"></img>
        </Button>
        <Button onClick={() => {}}>
          <img src={googlePlayBtn} alt="google play store"></img>
        </Button>
      </Box>
    </Box>
  )
}
export default DownloadAppLandingPage
