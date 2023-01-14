import {useAdherence} from '@components/studies/adherenceHooks'
import StudyBuilderHeader from '@components/studies/StudyBuilderHeader'
import BreadCrumb from '@components/widgets/BreadCrumb'
import LoadingComponent from '@components/widgets/Loader'
import ParticipantAdherenceContentShell from '@components/widgets/ParticipantAdherenceContentShell'
import CheckIcon from '@mui/icons-material/CheckCircleTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import PersonIcon from '@mui/icons-material/PersonTwoTone'
import {Box, Button, Paper, Tooltip, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {useEnrollmentForParticipant} from '@services/enrollmentHooks'
import {useEventsForUser} from '@services/eventHooks'
import {useGetParticipant, useGetParticipantInfo} from '@services/participantHooks'
import ParticipantService from '@services/participants.service'
import {useStudy} from '@services/studyHooks'
import {theme} from '@style/theme'
import constants from '@typedefs/constants'
import {AdherenceDetailReport, SessionDisplayInfo} from '@typedefs/types'
import clsx from 'clsx'
import dayjs from 'dayjs'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import AdherenceUtility from '../adherenceUtility'
import SessionLegend from '../SessionLegend'
import {useCommonStyles} from '../styles'
import AdditionalAdherenceParticipantInfo from './AdditionalAdherenceParticipantInfo'
import AdherenceParticipantGrid from './AdherenceParticipantGrid'
import EditParticipantEvents from './EditParticipantEvents'
import EditParticipantNotes from './EditParticipantNotes'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: theme.spacing(0, 6),
    margin: theme.spacing(4, 0),
  },

  cumulative: {
    borderBottom: '3px double',
    padding: theme.spacing(0, 6, 1, 1),
    fontSize: '12px',
    fontWeight: 700,
  },

  celebration: {
    position: 'absolute',
    left: '20%',
    maxWidth: '75%',
  },
}))

type AdherenceParticipantProps = {}

const AdherenceParticipant: FunctionComponent<AdherenceParticipantProps & RouteComponentProps> = () => {
  const [isEditParticipant, setIsEditParticipant] = React.useState(false)

  let {id: studyId, userId: participantId} = useParams<{
    id: string
    userId: string
  }>()

  const {data: adherenceReport, error, isLoading: isAdherenceLoading} = useAdherence(studyId, participantId)

  const {data: participantRequestInfo} = useGetParticipantInfo(studyId, participantId)

  const {data: participant} = useGetParticipant(studyId, participantId)

  const {data: events} = useEventsForUser(studyId, participantId)

  const {
    data: enrollment,
    error: enrollmentError,
    isLoading: isEnrollmentLoading,
  } = useEnrollmentForParticipant(studyId, participantId)

  const {data: study, error: studyError, isLoading: isStudyLoading} = useStudy(studyId)

  const [participantSessions, setParticipantSessions] = React.useState<SessionDisplayInfo[]>([])

  React.useEffect(() => {
    if (adherenceReport) {
      // debugger

      setParticipantSessions(AdherenceUtility.getUniqueSessionsInfo(adherenceReport.weeks))
    }
  }, [adherenceReport])

  const classes = {...useCommonStyles(), ...useStyles()}

  const getBreadcrumbLinks = () => [
    {
      url: `${constants.restrictedPaths.ADHERENCE_DATA.replace(':id', studyId)}?tab=ENROLLED`,

      text: 'Active Participants',
    },
  ]

  const getDisplayTimeInStudyTime = (adherenceReport?: AdherenceDetailReport) => {
    if (!adherenceReport?.dateRange) {
      return ''
    }
    const startDate = dayjs(adherenceReport.dateRange.startDate).format('MM/DD/YYYY')

    const endDate = dayjs(adherenceReport.dateRange.endDate).format('MM/DD/YYYY')
    return `${startDate}-${endDate}`
  }

  return (
    <Box>
      <LoadingComponent
        reqStatusLoading={isStudyLoading || isAdherenceLoading || isEnrollmentLoading || !enrollment}
        variant="full">
        <StudyBuilderHeader study={study!} />
        <ParticipantAdherenceContentShell
          sx={
            adherenceReport?.progression === 'done'
              ? {background: 'linear-gradient(360deg, #F7FBF6 0%, #F7FBF6 85.05%)'}
              : {}
          }>
          <BreadCrumb links={getBreadcrumbLinks()}></BreadCrumb>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: theme.spacing(3),
              alignItems: 'flex-end',
            }}>
            <Box>
              {/*adherenceReport?.progression === 'done' && <CelebrationBg className={classes.celebration} />*/}
              <Box display="flex" alignItems="center" my={4}>
                {' '}
                <PersonIcon sx={{fontSize: '32px', marginRight: theme.spacing(1), color: '#afb5bd'}} />
                <Typography variant="h2">
                  {ParticipantService.formatExternalId(studyId, adherenceReport?.participant?.externalId || '', true)}
                </Typography>
                {adherenceReport?.progression === 'done' && (
                  <Tooltip title="Completed Study">
                    <CheckIcon sx={{color: '#63A650', marginLeft: theme.spacing(1)}} />
                  </Tooltip>
                )}
              </Box>

              <AdditionalAdherenceParticipantInfo
                participantRequestInfo={participantRequestInfo}
                participantClientData={participant?.clientData}
                adherenceReport={adherenceReport!}
                enrollment={enrollment!}
              />
            </Box>

            <Box sx={{width: '440px'}}>
              <EditParticipantNotes participantId={participantId} studyId={studyId} enrollment={enrollment!} />
            </Box>
          </Box>
        </ParticipantAdherenceContentShell>
        <Paper className={classes.mainContainer} elevation={2}>
          <Box display="flex" mt={4} mb={2}>
            {participantSessions?.map((s, index) => (
              <SessionLegend
                key={s.sessionGuid}
                symbolKey={s.sessionSymbol}
                sessionIndex={index}
                sessionName={s.sessionName}
              />
            ))}
          </Box>
          {
            <AdherenceParticipantGrid
              adherenceReport={adherenceReport!}
              clientData={participant?.clientData}
              sessions={participantSessions}
            />
          }
          <Box display="flex">
            {events && events?.customEvents?.length > 0 && (
              <Button variant="text" onClick={() => setIsEditParticipant(true)} startIcon={<EditTwoToneIcon />}>
                Edit Participant Events
              </Button>
            )}
            <Box
              marginLeft="auto"
              className={clsx(
                classes.cumulative,
                !AdherenceUtility.isCompliant(adherenceReport?.adherencePercent) && classes.red
              )}>
              Cumulative: &nbsp; &nbsp; &nbsp;
              <span
                className={!AdherenceUtility.isCompliant(adherenceReport?.adherencePercent) ? classes.red : ''}></span>
              {adherenceReport?.progression === 'unstarted' ? '-' : `${adherenceReport?.adherencePercent} %`}
            </Box>
          </Box>
        </Paper>
      </LoadingComponent>
      {isEditParticipant && (
        <EditParticipantEvents
          studyId={studyId}
          participantId={participantId}
          clientTimeZone={adherenceReport?.clientTimeZone}
          onCloseDialog={() => setIsEditParticipant(false)}
        />
      )}
    </Box>
  )
}

export default AdherenceParticipant
