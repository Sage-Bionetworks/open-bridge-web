import {ReactComponent as CheckBlue} from '@assets/adherence/round_check_blue.svg'
import {Box, styled, Typography} from '@mui/material'
import {latoFont, poppinsFont, theme} from '@style/theme'
import {ParticipantClientData, ParticipantRequestInfo} from '@typedefs/types'
import moment from 'moment'

const Table = styled('table')(({theme}) => ({
  borderSpacing: 0,
  borderCollapse: 'collapse',
}))

const Th = styled('th')(({theme}) => ({
  fontFamily: poppinsFont,
  fontSize: '14px',
  fontWeight: 600,
  padding: theme.spacing(1, 1.5),
  borderBottom: '1px solid #BBC3CD',
  textAlign: 'left',
  '&:first-child': {paddingLeft: 0},
}))

const Td = styled('td')(({theme}) => ({
  fontFamily: latoFont,
  fontSize: '16px',
  fontWeight: 'normal',
  borderBottom: '1px solid #BBC3CD',
  padding: theme.spacing(2, 1.5),
  '&:first-child': {paddingLeft: 0},
}))

const StyledHeader = styled(Typography)(({theme}) => ({
  fontWeight: 'bold',
  fontSize: '16px',
  fontFamily: poppinsFont,
  marginBottom: theme.spacing(0.5),
}))

const StyledSection = styled(Box)(({theme}) => ({
  fontFamily: latoFont,
  marginBottom: theme.spacing(5),
  fontSize: '16px',
}))

type AdditionalAdherenceParticipantInfoProps = {
  participantRequestInfo?: ParticipantRequestInfo
  participantClientData?: ParticipantClientData
}

const AdditionalAdherenceParticipantInfo: React.FunctionComponent<AdditionalAdherenceParticipantInfoProps> =
  ({participantRequestInfo, participantClientData}) => {
    return (
      <Box width="30%">
        {participantClientData?.availability && (
          <StyledSection>
            <StyledHeader>Availability</StyledHeader>
            {participantClientData?.availability?.wake}(wake) -{' '}
            {participantClientData?.availability?.bed}(bed)
          </StyledSection>
        )}

        {participantClientData?.earnings?.length && (
          <StyledSection>
            <StyledHeader>History of Earnings</StyledHeader>
            <Table width="100%">
              {participantClientData?.earnings.map((e, index) => (
                <tr>
                  <Td>
                    Burst {index + 1}&nbsp; Earnings:&nbsp;&nbsp; {e}
                  </Td>
                  <Td width="20px">
                    <CheckBlue />
                  </Td>
                </tr>
              ))}
            </Table>
          </StyledSection>
        )}
        {participantRequestInfo?.clientInfo && (
          <StyledSection sx={{marginTop: theme.spacing(9)}}>
            <StyledHeader>Device Type</StyledHeader>
            <Typography
              sx={{fontFamily: latoFont, marginBottom: 3}}
              component="p">
              {' '}
              {participantRequestInfo.clientInfo.deviceName}
            </Typography>

            <Table>
              <thead>
                <tr>
                  <Th>Last signed in with: </Th>

                  <Th>OS Version:</Th>
                  <Th> App Version:</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>
                    {moment(participantRequestInfo.signedInOn).format(
                      'MM/DD/yyy @ h:mm a'
                    )}
                  </Td>
                  <Td>
                    {participantRequestInfo.clientInfo.osName}{' '}
                    {participantRequestInfo.clientInfo.osVersion}
                  </Td>
                  <Td>{participantRequestInfo.clientInfo.appVersion}</Td>
                </tr>
              </tbody>
            </Table>
          </StyledSection>
        )}
      </Box>
    )
  }

export default AdditionalAdherenceParticipantInfo
