import {ReactComponent as PersonIcon} from '@assets/adherence/person_icon.svg'
import {useAdherence} from '@components/studies/adherenceHooks'
import {useEnrollmentForParticipant} from '@components/studies/enrollmentHooks'
import {useStudy} from '@components/studies/studyHooks'
import BreadCrumb from '@components/widgets/BreadCrumb'
import {MTBHeadingH4} from '@components/widgets/Headings'
import LoadingComponent from '@components/widgets/Loader'
import NonDraftHeaderFunctionComponent from '@components/widgets/StudyIdWithPhaseImage'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {Box, makeStyles, Paper} from '@material-ui/core'
import {latoFont} from '@style/theme'
import constants from '@typedefs/constants'
import {
  AdherenceByDayEntries,
  AdherenceWindowState,
  EventStreamAdherenceReport,
  SessionDisplayInfo,
} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import AdherenceParticipantGrid from './AdherenceParticipantGrid'
import AdherenceSessionIcon from './AdherenceSessionIcon'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    backgroundColor: '#f8f8f8',
  },
  sessionLegend: {
    width: theme.spacing(17.5),
    padding: theme.spacing(1, 2),
    fontStyle: latoFont,
    fontSize: '12px',
    border: '1px solid black',
    marginRight: theme.spacing(1),
    '& strong': {
      marginLeft: '15px',
      display: 'block',
    },
  },
}))

type AdherenceParticipantProps = {
  studyId?: string
}

const SessionLegend: FunctionComponent<{
  symbolKey: string
  sessionName: string
}> = ({symbolKey, sessionName}) => {
  const classes = useStyles()
  const arr: {label: string; state: AdherenceWindowState}[] = [
    {label: 'Upcoming', state: 'not_yet_available'},
    {label: 'Incomplete', state: 'expired'},
    {label: 'Partial Complete', state: 'started'},
    {label: 'Completed', state: 'completed'},
  ]
  return (
    <Box className={classes.sessionLegend}>
      <strong>{sessionName}</strong>{' '}
      {arr.map(e => (
        <div>
          <AdherenceSessionIcon sessionSymbol={symbolKey} windowState={e.state}>
            {e.label}
          </AdherenceSessionIcon>
        </div>
      ))}
    </Box>
  )
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
  let {id: studyId, userId} = useParams<{
    id: string
    userId: string
  }>()

  const {token} = useUserSessionDataState()
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
          isStudyLoading || isAdherenceLoading || isEnrollmentLoading
        }
        variant="full">
        <Box px={3} py={2} display="flex" alignItems="center">
          <NonDraftHeaderFunctionComponent study={study} />
        </Box>

        <BreadCrumb links={getBreadcrumbLinks()}></BreadCrumb>
        <Paper className={classes.mainContainer} elevation={2}>
          <Box display="flex" alignItems="center">
            {' '}
            <PersonIcon />
            <MTBHeadingH4>{enrollment?.externalId}</MTBHeadingH4>
          </Box>
          <br />
          <MTBHeadingH4> Time in Study</MTBHeadingH4>
          <br />
          <MTBHeadingH4>Health Code </MTBHeadingH4>
          {enrollment?.healthCode}
          <Box display="flex" mt={4} mb={2}>
            {participantSessions?.map(s => (
              <SessionLegend
                symbolKey={s.sessionSymbol}
                sessionName={s.sessionName}
              />
            ))}
          </Box>
          <AdherenceParticipantGrid adherenceReport={adherenceReport!} />
        </Paper>
      </LoadingComponent>
    </Box>
  )
}

export default AdherenceParticipant
