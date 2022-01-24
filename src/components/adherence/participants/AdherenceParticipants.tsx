import {useAdherenceForWeek} from '@components/studies/adherenceHooks'
import ParticipantSearch from '@components/studies/participants/ParticipantSearch'
import {Box, makeStyles} from '@material-ui/core'
import {SessionDisplayInfo} from '@typedefs/types'
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

    const [sessions, setSessions] = React.useState<SessionDisplayInfo[]>([])

    const {
      data: adherenceWeeklyReport,

      status: adhStatus,
    } = useAdherenceForWeek(studyId)

    const handleError = useErrorHandler()

    React.useEffect(() => {
      if (adherenceWeeklyReport) {
        setSessions(
          AdherenceUtility.getUniqueSessionsInfo(adherenceWeeklyReport)
        )
      }
    }, [adherenceWeeklyReport])

    /* if (!adherenceWeeklyReport) {
      return adhStatus === 'error' ? <>error</> : <>no report</>
    }
*/
    return (
      <div className={classes.mainContainer}>
        {adhStatus}
        <Box display="flex" mt={0} mb={2}>
          {sessions?.map(s => (
            <SessionLegend
              key={s.sessionGuid}
              symbolKey={s.sessionSymbol}
              sessionName={s.sessionName}
            />
          ))}
          <div style={{marginLeft: 'auto'}}>
            <ParticipantSearch
              isSearchById={true}
              onReset={() => {
                /* handleSearchParticipantRequest(undefined)*/
              }}
              onSearch={(searchedValue: string) => {
                /* handleSearchParticipantRequest(searchedValue)*/
              }}
            />
          </div>
        </Box>

        <AdherenceParticipantsGrid
          studyId={studyId}
          adherenceWeeklyReport={adherenceWeeklyReport || []}
        />
      </div>
    )
  }

export default AdherenceParticipants
