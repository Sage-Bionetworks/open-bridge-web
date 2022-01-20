import {useAdherenceForWeek} from '@components/studies/adherenceHooks'
import Loader from '@components/widgets/Loader'
import {useAsync} from '@helpers/AsyncHook'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {Box, makeStyles} from '@material-ui/core'
import ParticipantService from '@services/participants.service'
import {EnrolledAccountRecord, SessionDisplayInfo} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {useParams} from 'react-router-dom'
import AdherenceUtility from '../adherenceUtility'
import SessionLegend from '../SessionLegend'
import {useCommonStyles} from '../styles'
import AdherenceParticipantsGrid from './AdherenceParticipantsGrid'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: theme.spacing(4),
  },
}))

type AdherenceParticipantsProps = {
  studyId?: string
}

const AdherenceParticipants: FunctionComponent<AdherenceParticipantsProps> =
  () => {
    const classes = {...useCommonStyles(), ...useStyles()}
    let {id: studyId} = useParams<{
      id: string
    }>()
    const {token} = useUserSessionDataState()
    const {
      data: enrolledUsers,
      status,
      error,
      run,
      setData,
    } = useAsync<{
      items: EnrolledAccountRecord[]
      total: number
    }>({
      status: 'PENDING',
      data: {
        items: [],
        total: 0,
      },
    })
    const [userIds, setUserIds] = React.useState<string[]>([])
    const [sessions, setSessions] = React.useState<SessionDisplayInfo[]>([])

    const {
      data: adherenceWeeklyReport,
      refetch: refetchAdherence,
      status: adhStatus,
    } = useAdherenceForWeek(studyId, userIds)

    const handleError = useErrorHandler()

    React.useEffect(() => {
      return run(
        ParticipantService.getEnrollmentByEnrollmentType(
          studyId,
          token!,
          'enrolled',
          true
        )
      )
    }, [run, studyId, token])

    React.useEffect(() => {
      if (enrolledUsers) {
        const userIds = enrolledUsers.items.map(
          user => user.participant.identifier
        )
        setUserIds(userIds)
      }
    }, [enrolledUsers?.items?.length, studyId])

    React.useEffect(() => {
      if (adherenceWeeklyReport) {
        setSessions(
          AdherenceUtility.getUniqueSessionsInfo(adherenceWeeklyReport)
        )
      }
    }, [adherenceWeeklyReport])

    if (status === 'PENDING') {
      return <Loader reqStatusLoading={'PENDING'}></Loader>
    }
    if (status === 'REJECTED') {
      handleError(error!)
    }
    if (!adherenceWeeklyReport) {
      return <>nothing</>
    }

    return (
      <div className={classes.mainContainer}>
        <Box display="flex" mt={0} mb={2}>
          {sessions?.map(s => (
            <SessionLegend
              key={s.sessionGuid}
              symbolKey={s.sessionSymbol}
              sessionName={s.sessionName}
            />
          ))}
        </Box>
        <AdherenceParticipantsGrid
          studyId={studyId}
          adherenceWeeklyReport={adherenceWeeklyReport}
        />
      </div>
    )
  }

export default AdherenceParticipants
