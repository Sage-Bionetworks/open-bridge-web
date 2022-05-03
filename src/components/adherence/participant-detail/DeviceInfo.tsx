import {Box, styled, Typography} from '@mui/material'
import {latoFont, poppinsFont} from '@style/theme'
import {ParticipantRequestInfo} from '@typedefs/types'
import moment from 'moment'

const TH = styled('th')(({theme}) => ({
  fontFamily: poppinsFont,
  fontSize: '14px',
  fontWeight: 600,
  padding: theme.spacing(1, 1.5),
  borderBottom: '1px solid #BBC3CD',
  textAlign: 'left',
  '&:first-child': {paddingLeft: 0},
}))

const TD = styled('td')(({theme}) => ({
  fontFamily: latoFont,
  fontSize: '16px',
  fontWeight: 'normal',
  borderBottom: '1px solid #BBC3CD',
  padding: theme.spacing(1, 1.5),
  '&:first-child': {paddingLeft: 0},
}))

const DeviceInfo: React.FunctionComponent<ParticipantRequestInfo> = info => {
  return (
    <Box>
      <Typography sx={{fontFamily: poppinsFont, fontWeight: 800}}>
        Device Type
      </Typography>
      <Typography sx={{fontFamily: latoFont, marginBottom: 3}} component="p">
        {' '}
        {info.clientInfo.deviceName}
      </Typography>

      <table style={{borderSpacing: 0, borderCollapse: 'collapse'}}>
        <thead>
          <tr>
            <TH>Last signed in with: </TH>

            <TH>OS Version:</TH>
            <TH> App Version:</TH>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TD>{moment(info.signedInOn).format('MM/DD/yyy @ h:mm a')}</TD>
            <TD>
              {info.clientInfo.osName} {info.clientInfo.osVersion}
            </TD>
            <TD>{info.clientInfo.appVersion}</TD>
          </tr>
        </tbody>
      </table>
    </Box>
  )
}

export default DeviceInfo
