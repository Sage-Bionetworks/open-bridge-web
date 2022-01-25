import {useAdherenceForWeek} from '@components/studies/adherenceHooks'
import ParticipantSearch from '@components/studies/participants/ParticipantSearch'
import TablePagination from '@components/widgets/pagination/TablePagination'
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
    const [currentPage, setCurrentPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(5)
    const [sessions, setSessions] = React.useState<SessionDisplayInfo[]>([])

    const {
      data: adherenceWeeklyReport,

      status: adhStatus,
    } = useAdherenceForWeek(studyId, currentPage, pageSize)

    const handleError = useErrorHandler()

    React.useEffect(() => {
      if (adherenceWeeklyReport) {
        setSessions(
          AdherenceUtility.getUniqueSessionsInfo(adherenceWeeklyReport.items)
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

        {adherenceWeeklyReport && (
          <div>
            <AdherenceParticipantsGrid
              studyId={studyId}
              adherenceWeeklyReport={adherenceWeeklyReport}
            />

            <TablePagination
              totalItems={adherenceWeeklyReport.total}
              onPageSelectedChanged={(pageSelected: number) => {
                setCurrentPage(pageSelected)
              }}
              currentPage={currentPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              counterTextSingular="participant"
            />
          </div>
        )}
      </div>
    )
  }

export default AdherenceParticipants
