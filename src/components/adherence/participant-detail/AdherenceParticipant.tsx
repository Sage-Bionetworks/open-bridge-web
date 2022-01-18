import {ReactComponent as PersonIcon} from '@assets/adherence/person_icon.svg'
import {useAdherence} from '@components/studies/adherenceHooks'
import {useEnrollmentForParticipant} from '@components/studies/enrollmentHooks'
import {
  useEvents,
  useEventsForUser,
  useUpdateEventsForUser,
} from '@components/studies/eventHooks'
import EditParticipantEventsForm from '@components/studies/participants/modify/EditParticipantEventsForm'
import {useStudy} from '@components/studies/studyHooks'
import BreadCrumb from '@components/widgets/BreadCrumb'
import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import {MTBHeadingH4} from '@components/widgets/Headings'
import LoadingComponent from '@components/widgets/Loader'
import NonDraftHeaderFunctionComponent from '@components/widgets/StudyIdWithPhaseImage'
import {
  DialogButtonPrimary,
  DialogButtonSecondary,
} from '@components/widgets/StyledComponents'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  Paper,
  TextField,
} from '@material-ui/core'
import constants from '@typedefs/constants'
import {
  AdherenceByDayEntries,
  EventStreamAdherenceReport,
  ParticipantEvent,
  SessionDisplayInfo,
} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import AdherenceParticipantGrid from './AdherenceParticipantGrid'
import SessionLegend from './SessionLegend'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    backgroundColor: '#f8f8f8',
  },
}))

type AdherenceParticipantProps = {
  studyId?: string
}

function getParcipantSessions(
  adherence: EventStreamAdherenceReport
): SessionDisplayInfo[] {
  var result: SessionDisplayInfo[] = []
  const entries = adherence.streams.map(s => s.byDayEntries)

  entries.forEach((adherenceByDayEntries: AdherenceByDayEntries) => {
    for (var day in adherenceByDayEntries) {
      const dayEntries = adherenceByDayEntries[day]

      for (var windowEntry of dayEntries) {
        if (!result.find(s => s.sessionGuid === windowEntry.sessionGuid)) {
          result.push({
            sessionGuid: windowEntry.sessionGuid,
            sessionName: windowEntry.sessionName,
            sessionSymbol: windowEntry.sessionSymbol,
          })
        }
      }
    }
  })
  return result
}

const AdherenceParticipant: FunctionComponent<
  AdherenceParticipantProps & RouteComponentProps
> = () => {
  const [isEditParticipant, setIsEditParticipant] = React.useState(false)
  const [participantEvents, setParticipantEvents] = React.useState<
    ParticipantEvent[]
  >([])
  let {id: studyId, userId: participantId} = useParams<{
    id: string
    userId: string
  }>()

  const {
    data: adherenceReport,
    error,
    isLoading: isAdherenceLoading,
  } = useAdherence(studyId, participantId)

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

  const {data: scheduleEvents = [], error: eventError} = useEvents(studyId)
  const {data: events} = useEventsForUser(studyId, participantId)

  const [participantSessions, setParticipantSessions] = React.useState<
    SessionDisplayInfo[]
  >([])

  React.useEffect(() => {
    if (adherenceReport) {
      setParticipantSessions(getParcipantSessions(adherenceReport))
    }
    console.log('updating adherence report')
    console.log(adherenceReport?.streams[0].eventTimestamp)
  }, [adherenceReport])

  React.useEffect(() => {
    if (events) {
      setParticipantEvents(events.customEvents)
    }
  }, [events])

  const classes = useStyles()

  const getBreadcrumbLinks = () => [
    {
      url: `${constants.restrictedPaths.ADHERENCE_DATA.replace(
        ':id',
        studyId
      )}?tab=ENROLLED`,

      text: 'Enrolled Participants',
    },
  ]

  const {
    isSuccess: scheduleUpdateSuccess,
    isError: scheduleUpdateError,
    mutateAsync: updateEvents,
    data,
  } = useUpdateEventsForUser()

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
          <Box display="flex" alignItems="center" mb={2}>
            {' '}
            <PersonIcon />
            <MTBHeadingH4>{enrollment?.externalId}</MTBHeadingH4>
          </Box>
          <Box mb={2}>
            <MTBHeadingH4> Time in Study (Enrollment Date)</MTBHeadingH4>
            {enrollment
              ? new Date(enrollment.enrolledOn).toLocaleDateString()
              : 'nothing'}
          </Box>
          <Box mb={2}>
            <MTBHeadingH4>Health Code </MTBHeadingH4>
            {enrollment?.participant.identifier}
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
          <AdherenceParticipantGrid adherenceReport={adherenceReport!} />
          <Button variant="text" onClick={() => setIsEditParticipant(true)}>
            Edit Participant Event Date Cumulative
          </Button>
          <Box>
            Participant Notes
            <TextField value={enrollment?.note} multiline={true} />
          </Box>
        </Paper>
      </LoadingComponent>
      <Dialog open={isEditParticipant} scroll="body">
        <DialogTitleWithClose
          onCancel={() => setIsEditParticipant(false)}
          title="Edit Participant Event Date"
          isSmallTitle={true}
        />
        <DialogContent>
          <EditParticipantEventsForm
            hideLoginEvent={true}
            scheduleEvents={scheduleEvents}
            onChange={customEvents => {
              setParticipantEvents(customEvents)
            }}
            customParticipantEvents={
              participantEvents || ([] as ParticipantEvent[])
            }
          />
        </DialogContent>
        <DialogActions>
          <DialogButtonSecondary onClick={() => setIsEditParticipant(false)}>
            Cancel
          </DialogButtonSecondary>
          <DialogButtonPrimary
            onClick={() => {
              updateEvents({
                studyId,
                participantId,
                customEvents: participantEvents,
              }).then(
                () => setIsEditParticipant(false),
                e => alert(e.message)
              )
            }}
            color="primary">
            Save Changes
          </DialogButtonPrimary>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdherenceParticipant
