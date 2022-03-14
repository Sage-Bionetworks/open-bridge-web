import {useAdherenceForWeek} from '@components/studies/adherenceHooks'
import ParticipantSearch from '@components/studies/participants/ParticipantSearch'
import LoadingComponent from '@components/widgets/Loader'
import TablePagination from '@components/widgets/pagination/TablePagination'
import {Box, makeStyles} from '@material-ui/core'
import {WeeklyAdherenceFilter} from '@services/adherence.service'
import {ProgressionStatus, SessionDisplayInfo} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {useParams} from 'react-router-dom'
import AdherenceUtility from '../adherenceUtility'
import SessionLegend from '../SessionLegend'
import {useCommonStyles} from '../styles'
import AdherenceParticipantsGrid from './AdherenceParticipantsGrid'
import Filter from './Filter'
import ProgressionFilter from './ProgressionFilter'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: theme.spacing(4, 3),
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

    const [adherenceParams, setAdherenceParams] =
      React.useState<WeeklyAdherenceFilter>({})
    const [currentPage, setCurrentPage] = React.useState(0)

    const [pageSize, setPageSize] = React.useState(50)
    const [sessions, setSessions] = React.useState<SessionDisplayInfo[]>([])

    const {
      data: adherenceWeeklyReport,
      status: adhStatus,
      error: adhError,
    } = useAdherenceForWeek(studyId, currentPage, pageSize, adherenceParams)

    const {data: fullAdherenceWeeklyReport} = useAdherenceForWeek(
      studyId,
      currentPage,
      pageSize,
      {}
    )

    const handleError = useErrorHandler()

    React.useEffect(() => {
      if (adherenceWeeklyReport) {
        setSessions(
          AdherenceUtility.getUniqueSessionsInfo(adherenceWeeklyReport.items)
        )
      }
    }, [adherenceWeeklyReport])

    if (adhStatus === 'error') {
      handleError(adhError)
    }

    return (
      <div className={classes.mainContainer}>
        <Box display="flex" mt={0} mb={2}>
          <ProgressionFilter
            progressionStatus={adherenceParams.progressionFilters}
            onChange={(f: ProgressionStatus[] | undefined) => {
              setCurrentPage(0)
              setAdherenceParams(prev => ({...prev, progressionFilters: f}))
            }}
          />

          <div style={{marginLeft: 'auto'}}>
            <ParticipantSearch
              isSearchById={true}
              onReset={() => {
                setAdherenceParams({})
                setCurrentPage(0)
              }}
              onSearch={(searchedValue: string) => {
                setAdherenceParams({
                  idFilter: searchedValue,
                })
                setCurrentPage(0)
              }}
            />
          </div>
          {fullAdherenceWeeklyReport?.items && (
            <div>
              <Filter
                adherenceReportItems={fullAdherenceWeeklyReport.items}
                selectedLabels={adherenceParams.labelFilters}
                thresholdMax={adherenceParams.adherenceMax}
                thresholdMin={adherenceParams.adherenceMin}
                onFilterChange={params => {
                  setCurrentPage(0)
                  setAdherenceParams({
                    ...adherenceParams,
                    adherenceMax: params.max,
                    adherenceMin: params.min,
                    labelFilters: params.labels,
                  })
                }}></Filter>
            </div>
          )}
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
