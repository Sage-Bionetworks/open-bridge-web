import {ReactComponent as CelebrationBg} from '@assets/adherence/celebration_bg.svg'
import {ReactComponent as PersonIcon} from '@assets/adherence/person_icon.svg'
import EditIcon from '@assets/edit_pencil_red.svg'
import {useAdherence} from '@components/studies/adherenceHooks'
import {useEnrollmentForParticipant} from '@components/studies/enrollmentHooks'
import {useEventsForUser} from '@components/studies/eventHooks'
import {useStudy} from '@components/studies/studyHooks'
import BreadCrumb from '@components/widgets/BreadCrumb'
import {MTBHeadingH4} from '@components/widgets/Headings'
import LoadingComponent from '@components/widgets/Loader'
import NonDraftHeaderFunctionComponent from '@components/widgets/StudyIdWithPhaseImage'
import {Box, Button, makeStyles, Paper} from '@material-ui/core'
import ParticipantService from '@services/participants.service'
import {latoFont} from '@style/theme'
import constants from '@typedefs/constants'
import {
  AdherenceDetailReport,
  ParticipantEvent,
  SessionDisplayInfo,
} from '@typedefs/types'
import moment from 'moment'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import AdherenceUtility from '../adherenceUtility'
import SessionLegend from '../SessionLegend'
import {useCommonStyles} from '../styles'
import AdherenceParticipantGrid from './AdherenceParticipantGrid'
import EditParticipantEvents from './EditParticipantEvents'
import EditParticipantNotes from './EditParticipantNotes'
const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: theme.spacing(3),
    margin: theme.spacing(4, 0),
    backgroundColor: '#f8f8f8',
  },

  editEventDate: {
    fontSize: '14px',
    fontFamily: latoFont,
    fontWeight: 600,
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

const AdherenceParticipant: FunctionComponent<
  AdherenceParticipantProps & RouteComponentProps
> = () => {
  const [isEditParticipant, setIsEditParticipant] = React.useState(false)

  let {id: studyId, userId: participantId} = useParams<{
    id: string
    userId: string
  }>()

  const {
    data: adherenceReport,
    error,
    isLoading: isAdherenceLoading,
  } = useAdherence(studyId, participantId)

  const {data: events} = useEventsForUser(studyId, participantId)

  const {
    data: enrollment,
    error: enrollmentError,
    isLoading: isEnrollmentLoading,
  } = useEnrollmentForParticipant(studyId, participantId)

  const {
    data: study,
    error: studyError,
    isLoading: isStudyLoading,
  } = useStudy(studyId)

  const [participantSessions, setParticipantSessions] = React.useState<
    SessionDisplayInfo[]
  >([])

  React.useEffect(() => {
    if (adherenceReport) {
      // debugger

      setParticipantSessions(
        AdherenceUtility.getUniqueSessionsInfo(adherenceReport.weeks)
      )
    }
  }, [adherenceReport])

  const classes = {...useCommonStyles(), ...useStyles()}

  const getBreadcrumbLinks = () => [
    {
      url: `${constants.restrictedPaths.ADHERENCE_DATA.replace(
        ':id',
        studyId
      )}?tab=ENROLLED`,

      text: 'Enrolled Participants',
    },
  ]

  const getDisplayTimeInStudyTime = (
    events?: {
      timeline_retrieved: Date | undefined
      customEvents: ParticipantEvent[]
    },
    adherenceReport?: AdherenceDetailReport
  ) => {
    if (!events?.timeline_retrieved) {
      return 'not joined'
    }
    // const startDate = new Date(events.timeline_retrieved).toDateString()
    if (!adherenceReport) {
      return ''
    }
    const startDate = moment(adherenceReport.dateRange.startDate).format(
      'MM/DD/yyyy'
    ) //new Date(adherenceReport.dateRange.startDate)
    //ALINA TODO: only show for completed participants
    /* const endDate = adherenceReport
      ? AdherenceUtility.getLastSchedleDate(adherenceReport.streams)
      : ''*/
    const endDate = moment(adherenceReport.dateRange.endDate).format(
      'MM/DD/yyyy'
    ) //new Date(adherenceReport.dateRange.endDate)
    return `${startDate}-${endDate}`
  }

  return (
    <Box bgcolor="#F8F8F8" px={5}>
      <LoadingComponent
        reqStatusLoading={
          isStudyLoading ||
          isAdherenceLoading ||
          isEnrollmentLoading ||
          !enrollment
        }
        variant="full">
        <Box px={3} py={2} display="flex" alignItems="center">
          <NonDraftHeaderFunctionComponent study={study} />
        </Box>

        <BreadCrumb links={getBreadcrumbLinks()}></BreadCrumb>
        <Paper className={classes.mainContainer} elevation={2}>
          {adherenceReport?.progression === 'done' && (
            <CelebrationBg className={classes.celebration} />
          )}
          <Box display="flex" alignItems="center" mb={2}>
            {' '}
            <PersonIcon />
            <MTBHeadingH4>
              {ParticipantService.formatExternalId(
                studyId,
                enrollment?.externalId || '',
                true
              )}
            </MTBHeadingH4>
          </Box>
          <Box mb={2}>
            <MTBHeadingH4> Time in Study</MTBHeadingH4>
            {getDisplayTimeInStudyTime(events, adherenceReport)}
          </Box>
          <Box mb={2}>
            <MTBHeadingH4> Client TimeZone</MTBHeadingH4>
            {enrollment?.clientTimeZone}
          </Box>
          <Box mb={2}>
            <MTBHeadingH4>Health Code </MTBHeadingH4>
            {enrollment ? enrollment.healthCode : ''}

            <Box display="flex" mt={4} mb={2}>
              {participantSessions?.map(s => (
                <SessionLegend
                  key={s.sessionGuid}
                  symbolKey={s.sessionSymbol}
                  sessionName={s.sessionName}
                />
              ))}
            </Box>
          </Box>
          {<AdherenceParticipantGrid adherenceReport={adherenceReport!} />}
          <Box display="flex">
            <Button
              className={classes.editEventDate}
              variant="text"
              onClick={() => setIsEditParticipant(true)}>
              <img src={EditIcon}></img>
              &nbsp;Edit Participant Events
            </Button>
            <Box marginLeft="auto" className={classes.cumulative}>
              Cumulative: &nbsp; &nbsp; &nbsp;
              {adherenceReport?.adherencePercent}%
            </Box>
          </Box>
          <EditParticipantNotes
            participantId={participantId}
            studyId={studyId}
            enrollment={enrollment!}
          />
        </Paper>
      </LoadingComponent>
      {isEditParticipant && (
        <EditParticipantEvents
          studyId={studyId}
          participantId={participantId}
          onCloseDialog={() => setIsEditParticipant(false)}
        />
      )}
    </Box>
  )
}

export default AdherenceParticipant
