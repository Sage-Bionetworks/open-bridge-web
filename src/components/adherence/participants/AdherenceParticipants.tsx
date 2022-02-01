import {useAdherenceForWeek} from '@components/studies/adherenceHooks'
import ParticipantSearch from '@components/studies/participants/ParticipantSearch'
import LoadingComponent from '@components/widgets/Loader'
import TablePagination from '@components/widgets/pagination/TablePagination'
import {Box, makeStyles} from '@material-ui/core'
import {SessionDisplayInfo} from '@typedefs/types'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {useParams} from 'react-router-dom'
import AdherenceUtility from '../adherenceUtility'
import SessionLegend from '../SessionLegend'
import {useCommonStyles} from '../styles'
import AdherenceParticipantsGrid from './AdherenceParticipantsGrid'
import CompletionFilter from './CompletionFilter'
import Filter from './Filter'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: theme.spacing(4),
  },
}))

type AdherenceParticipantsProps = {
  studyId?: string
}

type CompletionStatus = 'completed' | 'progress'

const COMPLETION_STATUS: {label: string; value: CompletionStatus}[] = [
  {label: 'In Progress', value: 'progress'},
  {label: 'Completed', value: 'completed'},
]

const AdherenceParticipants: FunctionComponent<AdherenceParticipantsProps> =
  () => {
    const classes = {...useCommonStyles(), ...useStyles()}
    let {id: studyId} = useParams<{
      id: string
    }>()
    const [completionStatus, setCompletionStatus] = React.useState<
      CompletionStatus[]
    >(['completed', 'progress'])
    const [adherenceParams, setAdherenceParams] = React.useState<
      {labels: string[]; threshold: number} | undefined
    >()
    const [currentPage, setCurrentPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(5)
    const [sessions, setSessions] = React.useState<SessionDisplayInfo[]>([])
    const [displayLabels, setDisplayLabels] = React.useState<string[]>([])

    const {data: adherenceWeeklyReport, status: adhStatus} =
      useAdherenceForWeek(
        studyId,
        currentPage,
        pageSize,
        completionStatus,
        adherenceParams?.labels || [],
        adherenceParams?.threshold
      )

    const {data: fullAdherenceWeeklyReport, status: fullAdhStatus} =
      useAdherenceForWeek(studyId, currentPage, pageSize, [
        'completed',
        'progress',
      ])

    const handleError = useErrorHandler()

    React.useEffect(() => {
      if (adherenceWeeklyReport) {
        setSessions(
          AdherenceUtility.getUniqueSessionsInfo(adherenceWeeklyReport.items)
        )
      }
    }, [adherenceWeeklyReport])

    React.useEffect(() => {
      if (fullAdherenceWeeklyReport) {
        setDisplayLabels(
          _.uniq(
            _.flatten(fullAdherenceWeeklyReport.items.map(i => i.rowLabels))
          )
        )
      }
    }, [fullAdherenceWeeklyReport])

    return (
      <div className={classes.mainContainer}>
        <Box display="flex" mt={0} mb={2}>
          <CompletionFilter
            completionStatus={completionStatus}
            onChange={setCompletionStatus}
          />

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
              displayLabels={displayLabels}
              threshold={adherenceParams?.threshold}
              onFilterChange={params => {
                setAdherenceParams(params)
              }}></Filter>
          </div>
        </Box>
        <LoadingComponent
          reqStatusLoading={adherenceWeeklyReport === undefined}>
          <Box display="flex" mt={0} mb={2}>
            {sessions?.map(s => (
              <SessionLegend
                key={s.sessionGuid}
                symbolKey={s.sessionSymbol}
                sessionName={s.sessionName}
              />
            ))}
          </Box>
        </LoadingComponent>
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
