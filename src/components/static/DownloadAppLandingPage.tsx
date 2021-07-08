import React from 'react'
import MTBLogoLarge from '../../assets/mtb_logo_large.svg'
import {Box} from '@material-ui/core'
import {latoFont, playfairDisplayFont} from '../../style/theme'
import appStoreBtn from '../../assets/preview/appStoreBtn.png'
import googlePlayBtn from '../../assets/preview/googlePlayBtn.png'
const DownloadAppLandingPage: React.FunctionComponent<{}> = ({}) => {
  return (
    <Box
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingTop: '80px',
        textAlign: 'left',
      }}>
      <img src={MTBLogoLarge} style={{width: '100px', height: '100px'}} />
      <Box
        lineHeight="28px"
        fontSize="21px"
        fontStyle="italic"
        fontFamily={playfairDisplayFont}
        mt={5}
        maxWidth="250px"
        textAlign="center">
        Download the <strong>Mobile Toolbox App</strong>
      </Box>
      <p
        style={{
          maxWidth: '260px',
          fontFamily: latoFont,
          fontSize: '15px',
          lineHeight: '18px',
          marginTop: '24px',
        }}>
        Thank you for participating.
        <br></br>
        <br></br>
        Please select the store that works best on your smartphone:
      </p>
      <Box mt={3}>
        <img src={appStoreBtn} style={{marginRight: '24px'}}></img>
        <img src={googlePlayBtn}></img>
      </Box>
    </Box>
  )
}
export default DownloadAppLandingPage
