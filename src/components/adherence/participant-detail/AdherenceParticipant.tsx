import {ReactComponent as PersonIcon} from '@assets/adherence/person_icon.svg'
import {ReactComponent as EditIcon} from '@assets/edit_pencil_red.svg'
import {useAdherence} from '@components/studies/adherenceHooks'
import {useEnrollmentForParticipant} from '@components/studies/enrollmentHooks'
import {useEvents, useEventsForUser} from '@components/studies/eventHooks'
import EditParticipantEventsForm from '@components/studies/participants/modify/EditParticipantEventsForm'
import {useStudy} from '@components/studies/studyHooks'
import BreadCrumb from '@components/widgets/BreadCrumb'
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
  DialogTitle,
  IconButton,
  makeStyles,
  Paper,
  TextField,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
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
  closeModalButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    padding: 0,
    color: theme.palette.common.black,
  },
  dialogTitle: {
    '& h2': {
      display: 'flex',
      alignItems: 'center',
    },
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
  let {id: studyId, userId} = useParams<{
    id: string
    userId: string
  }>()

  const {
    data: adherenceReport,
    error,
    isLoading: isAdherenceLoading,
  } = useAdherence(studyId, userId)

  console.log('about to call with ', userId)
  const {
    data: enrollment,
    error: enrollmentError,
    isLoading: isEnrollmentLoading,
  } = useEnrollmentForParticipant(studyId, userId)

  const {
    data: study,
    error: studyError,
    isLoading: isStudyLoading,
  } = useStudy(studyId)

  const {data: scheduleEvents = [], error: eventError} = useEvents(studyId)
  const {data: participantEvents} = useEventsForUser(studyId, userId)
  console.log(participantEvents, 'pe')

  const [participantSessions, setParticipantSessions] = React.useState<
    SessionDisplayInfo[]
  >([])

  console.log('e', enrollment)

  React.useEffect(() => {
    if (adherenceReport) {
      setParticipantSessions(getParcipantSessions(adherenceReport))
    }
  }, [adherenceReport])

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
        <DialogTitle className={classes.dialogTitle}>
          <EditIcon />
          &nbsp;&nbsp; Edit Participant Event Date
          <IconButton
            aria-label="close"
            className={classes.closeModalButton}
            onClick={() => setIsEditParticipant(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EditParticipantEventsForm
            hideLoginEvent={true}
            scheduleEvents={scheduleEvents}
            onChange={events => {
              console.log('event change')
              // onChange({...participant, events: events})
            }}
            customParticipantEvents={
              participantEvents?.customEvents || ([] as ParticipantEvent[])
            }
          />
        </DialogContent>
        <DialogActions>
          <DialogButtonSecondary onClick={() => setIsEditParticipant(false)}>
            Cancel
          </DialogButtonSecondary>
          <DialogButtonPrimary onClick={() => {}} color="primary">
            Save Changes
          </DialogButtonPrimary>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdherenceParticipant
