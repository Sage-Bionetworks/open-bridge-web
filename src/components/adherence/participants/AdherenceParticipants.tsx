import {useAdherenceForWeek} from '@components/studies/adherenceHooks'
import ParticipantSearch from '@components/studies/participants/ParticipantSearch'
import LoadingComponent from '@components/widgets/Loader'
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
import Filter from './Filter'

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
        <Box display="flex" mt={0} mb={2}>
          <LoadingComponent
            reqStatusLoading={adherenceWeeklyReport === undefined}>
            {sessions?.map(s => (
              <SessionLegend
                key={s.sessionGuid}
                symbolKey={s.sessionSymbol}
                sessionName={s.sessionName}
              />
            ))}
          </LoadingComponent>

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
          <div>
            <Filter
              onFilterChange={(
                a: string | undefined,
                b: number | undefined
              ) => {}}
              adherenceWeeklyReport={
                adherenceWeeklyReport?.items || []
              }></Filter>
          </div>
        </Box>

        <LoadingComponent
          reqStatusLoading={adherenceWeeklyReport === undefined}>
          {adherenceWeeklyReport && (
            <div>
              <AdherenceParticipantsGrid
                studyId={studyId}
                adherenceWeeklyReport={adherenceWeeklyReport!}
              />

              <TablePagination
                totalItems={adherenceWeeklyReport!.total}
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
        </LoadingComponent>
      </div>
    )
  }

export default AdherenceParticipants
