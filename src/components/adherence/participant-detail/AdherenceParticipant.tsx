import {ReactComponent as Upcoming} from '@assets/symbols/empty.svg'
import {useAdherence} from '@components/studies/adherenceHooks'
import {useStudy} from '@components/studies/studyHooks'
import BreadCrumb from '@components/widgets/BreadCrumb'
import LoadingComponent from '@components/widgets/Loader'
import SessionIcon, {SessionSymbols} from '@components/widgets/SessionIcon'
import NonDraftHeaderFunctionComponent from '@components/widgets/StudyIdWithPhaseImage'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {Box, makeStyles, Paper} from '@material-ui/core'
import {latoFont} from '@style/theme'
import constants from '@typedefs/constants'
import {
  AdherenceByDayEntries,
  EventStreamAdherenceReport,
  SessionDisplayInfo,
} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import AdherenceParticipantGrid from './AdherenceParticipantGrid'

const useStyles = makeStyles(theme => ({
  sessionLegend: {
    width: theme.spacing(17.5),
    padding: theme.spacing(1, 2),
    fontStyle: latoFont,
    fontSize: '12px',
    border: '1px solid black',
    marginRight: theme.spacing(1),
  },
  iconRow: {
    display: 'flex',
    alignItems: 'center',

    '& > svg': {
      width: '10px',
      height: '10px',
      marginRight: '5px',
    },
  },
  upcomingIcon: {
    display: 'flex',
    alignItems: 'center',

    '& svg': {
      display: 'flex',
      width: '10px',
      height: '10px',
      marginRight: '5px',
    },
  },
  emptySvg: {
    fill: 'none',
    width: '10px',
    height: '10px',
    marginRight: '5px',
    '&> path, &> circle, &> rect': {
      fill: 'none',
      stroke: 'black',
    },
    '&$red': {
      '&> path, &> circle, &> rect': {
        stroke: 'red',
      },
    },
  },
  red: {},
}))

type AdherenceParticipantProps = {
  studyId?: string
}

const SessionLegend: FunctionComponent<{
  symbolKey: string
  sessionName: string
}> = ({symbolKey, sessionName}) => {
  const classes = useStyles()
  return (
    <Box className={classes.sessionLegend}>
      <div style={{marginLeft: '15px'}}>
        <strong>{sessionName}</strong>{' '}
      </div>
      <div className={classes.upcomingIcon}>
        <Upcoming />
        Upcoming
      </div>
      <SessionIcon
        symbolIndex={0}
        className={classes.emptySvg}
        symbolKey={symbolKey}>
        Incomplete
      </SessionIcon>

      <Box display="flex" className={clsx(classes.iconRow, classes.emptySvg)}>
        {SessionSymbols.get(symbolKey!)![0]}
      </Box>
      <SessionIcon symbolIndex={1} symbolKey={symbolKey}>
        Partial Complete
      </SessionIcon>
      <SessionIcon symbolIndex={0} symbolKey={symbolKey}>
        Completed
      </SessionIcon>
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
  let {id: studyId} = useParams<{
    id: string
  }>()
  const {token} = useUserSessionDataState()
  const {
    data: adherenceReport,
    error,
    isLoading: isAdherenceLoading,
  } = useAdherence(studyId, '5jSdWKjevYMV47e7QPvlu7rx')
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
        reqStatusLoading={isStudyLoading || isAdherenceLoading}
        variant="full">
        <Box px={3} py={2} display="flex" alignItems="center">
          <NonDraftHeaderFunctionComponent study={study} />
        </Box>

        <BreadCrumb links={getBreadcrumbLinks()}></BreadCrumb>
        <Paper
          elevation={2}
          style={{padding: '32px', backgroundColor: '#f8f8f8'}}>
          <Box display="flex">
            {participantSessions?.map(s => (
              <SessionLegend
                symbolKey={s.sessionSymbol}
                sessionName={s.sessionName}
              />
            ))}

            {/*<SessionLegend symbolKey="Session1Circle" />
          <SessionLegend symbolKey="Session2Triangle" />
          <SessionLegend symbolKey="Session3Square" />
         <SessionLegend symbolKey="Session4Diamond" />*/}
          </Box>
          <AdherenceParticipantGrid adherenceReport={adherenceReport!} />
        </Paper>
      </LoadingComponent>
    </Box>
  )
}

export default AdherenceParticipant
