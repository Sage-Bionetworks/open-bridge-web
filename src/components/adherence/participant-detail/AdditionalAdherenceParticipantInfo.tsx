import {Box, Button, Popover, styled} from '@mui/material'
import {theme} from '@style/theme'
import {
  AdherenceDetailReport,
  ParticipantAccountSummary,
  ParticipantClientData,
  ParticipantRequestInfo,
} from '@typedefs/types'
import dayjs from 'dayjs'
import React from 'react'
import ClientDeviceMap from '../clientDevices'

const InfoRow = styled(Box, {label: 'InfoRow'})(({theme}) => ({
  lineHeight: '18px',
  '& > strong': {
    fontWeight: 700,
    marginRight: theme.spacing(1.5),
  },

  marginBottom: '6px',
}))

const Separator = styled('div')(({theme}) => ({
  width: '1px',
  backgroundColor: '#afb5bd',
  height: '10px',
  margin: theme.spacing(0, 1),
  display: 'inline-block',
}))

type AdditionalAdherenceParticipantInfoProps = {
  participantRequestInfo?: ParticipantRequestInfo
  participantClientData?: ParticipantClientData
  adherenceReport: AdherenceDetailReport

  enrollment: ParticipantAccountSummary
}

function getDeviceName(deviceType: string): string {
  if (!deviceType) {
    return ''
  }
  const keys = Array.from(ClientDeviceMap.keys())
  const deviceKey = keys.find(key => deviceType.includes(key))
  return deviceKey && ClientDeviceMap.has(deviceKey) ? ClientDeviceMap.get(deviceKey)! : deviceType
}

const AdditionalAdherenceParticipantInfo: React.FunctionComponent<AdditionalAdherenceParticipantInfoProps> = ({
  participantRequestInfo,
  participantClientData,
  adherenceReport,
  enrollment,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const getDisplayTimeInStudyTime = (adherenceReport?: AdherenceDetailReport) => {
    if (!adherenceReport?.dateRange) {
      return ''
    }
    const startDate = dayjs(adherenceReport.dateRange.startDate).format('MM/DD/YYYY')

    const endDate = dayjs(adherenceReport.dateRange.endDate).format('MM/DD/YYYY')
    return `${startDate}-${endDate}`
  }

  const getSumEarnings = (earnings: string[]) => {
    const paymentText = earnings.length > 1 ? 'payments' : 'payment'
    const earningsTotal = earnings.reduce((acc, e) => {
      const num = Number(e.replace('$', ''))
      return acc + num
    }, 0)
    return (
      <>
        {`${earningsTotal.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}`}{' '}
        <Separator /> {`${earnings.length} ${paymentText}`}{' '}
      </>
    )
  }

  return (
    <>
      <InfoRow>
        <strong> Time in Study</strong>
        {getDisplayTimeInStudyTime(adherenceReport)}
        {adherenceReport?.progression === 'done' && (
          <div>
            <strong>Completed</strong>
          </div>
        )}
      </InfoRow>

      <InfoRow>
        <strong>Health Code </strong>
        {enrollment ? enrollment.healthCode : ''}
      </InfoRow>
      <InfoRow>
        <strong>Client TimeZone</strong>
        {adherenceReport?.clientTimeZone || 'Unknown'}
      </InfoRow>

      {participantRequestInfo?.clientInfo && (
        <>
          <InfoRow>
            <strong>Device Type</strong>
            {getDeviceName(participantRequestInfo.clientInfo.deviceName)}
          </InfoRow>
          <InfoRow>
            <strong>Last signed in</strong> {dayjs(participantRequestInfo.signedInOn).format('MM/DD/YYYY @ h:mma')}{' '}
            <Separator /> OS Version: {participantRequestInfo.clientInfo.osName}{' '}
            {participantRequestInfo.clientInfo.osVersion} <Separator /> App Version{' '}
            {participantRequestInfo.clientInfo.appVersion}
          </InfoRow>
        </>
      )}

      {participantClientData?.availability && (
        <InfoRow>
          <strong>Availability</strong>
          {participantClientData?.availability?.wake}(wake) - {participantClientData?.availability?.bed}(bed)
        </InfoRow>
      )}

      {participantClientData?.earnings?.length && (
        <InfoRow>
          <strong>History of Earnings</strong>
          {getSumEarnings(participantClientData.earnings)}
          {participantClientData.earnings.length > 1 && (
            <>
              <Separator />
              <Button
                variant="text"
                color="primary"
                sx={{fontSize: '14px', height: '14px'}}
                onClick={e => setAnchorEl(e.currentTarget)}>
                View Earnings History
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}>
                <Box sx={{padding: theme.spacing(2), backgroundColor: '#fff'}}>
                  {participantClientData?.earnings.map((e, index) => (
                    <>
                      <span>
                        {' '}
                        Burst {index + 1}&nbsp; Earnings:&nbsp;&nbsp; {e}
                      </span>{' '}
                      <br />
                    </>
                  ))}
                </Box>
              </Popover>
            </>
          )}
        </InfoRow>
      )}
    </>
  )
}

export default AdditionalAdherenceParticipantInfo
