import {useAdherenceForWeek} from '@components/studies/adherenceHooks'
import ParticipantSearch from '@components/studies/participants/ParticipantSearch'
import LoadingComponent from '@components/widgets/Loader'
import TablePagination from '@components/widgets/pagination/TablePagination'
import {Box, makeStyles} from '@material-ui/core'
import {WeeklyAdherenceFilter} from '@services/adherence.service'
import {AdherenceWeeklyReport, SessionDisplayInfo} from '@typedefs/types'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {useParams} from 'react-router-dom'
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

function getUniqueSessionsInfoForWeek(
  items: AdherenceWeeklyReport[]
): SessionDisplayInfo[] {
  const labels = _.flatten(items.map(i => i.rows))
  const result: SessionDisplayInfo[] = labels.map(label => ({
    sessionGuid: label.sessionGuid,
    sessionName: label.sessionName,
    sessionSymbol: label.sessionSymbol,
  }))
  console.log(result)
  return _.uniqBy(result, 'sessionGuid')
}
const AdherenceParticipants: FunctionComponent<AdherenceParticipantsProps> =
  () => {
    const classes = {...useCommonStyles(), ...useStyles()}
    let {id: studyId} = useParams<{
      id: string
    }>()
    const [completionStatus, setCompletionStatus] = React.useState<
      CompletionStatus[]
    >(['completed', 'progress'])
    const [adherenceParams, setAdherenceParams] =
      React.useState<WeeklyAdherenceFilter>({})
    const [currentPage, setCurrentPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(5)
    const [sessions, setSessions] = React.useState<SessionDisplayInfo[]>([])
    const [displayLabels, setDisplayLabels] = React.useState<string[]>([])

    const {
      data: adherenceWeeklyReport,
      status: adhStatus,
      error: adhError,
    } = useAdherenceForWeek(studyId, currentPage, pageSize, adherenceParams)

    const {data: fullAdherenceWeeklyReport, status: fullAdhStatus} =
      useAdherenceForWeek(studyId, currentPage, pageSize, {})

    const handleError = useErrorHandler()

    React.useEffect(() => {
      if (adherenceWeeklyReport) {
        setSessions(getUniqueSessionsInfoForWeek(adherenceWeeklyReport.items))
      }
    }, [adherenceWeeklyReport])

    React.useEffect(() => {
      if (fullAdherenceWeeklyReport) {
        setDisplayLabels(
          _.uniq(
            _.flatten(fullAdherenceWeeklyReport.items.map(i => i.rows)).map(
              i => i.label
            )
          )
        )
      }
    }, [fullAdherenceWeeklyReport])
    if (adhStatus === 'error') {
      handleError(adhError)
    }

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
                setAdherenceParams({...adherenceParams, idFilter: undefined})
                setCurrentPage(1)
              }}
              onSearch={(searchedValue: string) => {
                setAdherenceParams({
                  ...adherenceParams,
                  idFilter: searchedValue,
                })
                setCurrentPage(1)
              }}
            />
          </div>
          <div>
            <Filter
              displayLabels={displayLabels}
              threshold={adherenceParams.adherenceMax}
              onFilterChange={params => {
                setAdherenceParams({
                  ...adherenceParams,
                  adherenceMax: params.threshold,
                  labelFilters: params.labels,
                })
              }}></Filter>
          </div>
        </Box>
        <LoadingComponent reqStatusLoading={adhStatus === 'loading'}>
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
          reqStatusLoading={adhStatus === 'idle' || adhStatus === 'loading'}>
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
