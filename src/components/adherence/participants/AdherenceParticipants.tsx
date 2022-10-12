import {useAdherenceForWeek, useAdherenceStatsForWeek} from '@components/studies/adherenceHooks'
import ParticipantSearch from '@components/studies/participants/ParticipantSearch'
import LoadingComponent from '@components/widgets/Loader'
import TablePagination from '@components/widgets/pagination/TablePagination'
import CloseIcon from '@mui/icons-material/Close'
import {Box, Button, darken} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {WeeklyAdherenceFilter} from '@services/adherence.service'
import {latoFont} from '@style/theme'
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
  clearFiltersButton: {
    fontFamily: latoFont,
    margin: theme.spacing(0, 0, 2, 'auto'),
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    borderRadius: 0,
    background: '#8FCDE2',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '&:hover': {
      backgroundColor: darken('#8FCDE2', 0.1),
    },
  },
}))

type AdherenceParticipantsProps = {
  studyId?: string
}

const AdherenceParticipants: FunctionComponent<AdherenceParticipantsProps> = () => {
  const classes = {...useCommonStyles(), ...useStyles()}
  let {id: studyId} = useParams<{
    id: string
  }>()

  const [adherenceParams, setAdherenceParams] = React.useState<WeeklyAdherenceFilter>({})
  const [currentPage, setCurrentPage] = React.useState(0)

  const [pageSize, setPageSize] = React.useState(50)
  const [sessions, setSessions] = React.useState<SessionDisplayInfo[]>([])

  const {
    data: adherenceWeeklyReport,
    status: adhStatus,
    error: adhError,
  } = useAdherenceForWeek(studyId, currentPage, pageSize, adherenceParams)

  const {data: adherenceWeeklyInProcessCount} = useAdherenceForWeek(studyId, 0, 5, {
    progressionFilters: ['in_progress'],
  })
  const {data: adherenceWeeklyDoneCount} = useAdherenceForWeek(studyId, 0, 5, {
    progressionFilters: ['done'],
  })

  const {data: fullAdherenceWeeklyReport} = useAdherenceForWeek(studyId, currentPage, pageSize, {})

  const {data: weeklyStats} = useAdherenceStatsForWeek(studyId)

  const handleError = useErrorHandler()

  React.useEffect(() => {
    if (adherenceWeeklyReport) {
      setSessions(AdherenceUtility.getUniqueSessionsInfo(adherenceWeeklyReport.items))
    }
  }, [adherenceWeeklyReport])

  if (adhStatus === 'error') {
    handleError(adhError)
  }

  const isDataLoaded = () => adherenceWeeklyInProcessCount && adherenceWeeklyDoneCount

  const hasNoFilter = () => {
    const allAdherence =
      (adherenceParams.adherenceMax === 100 && adherenceParams.adherenceMin === 0) ||
      (adherenceParams.adherenceMin === undefined && adherenceParams.adherenceMax === undefined)
    const allCompletion = !adherenceParams.progressionFilters || adherenceParams.progressionFilters.length === 2

    const result =
      Object.keys(adherenceParams).length === 0 || (allCompletion && allAdherence && !adherenceParams.labelFilters)
    return result
  }
  return (
    <div className={classes.mainContainer}>
      <Box display="flex" mt={0} mb={1}>
        {isDataLoaded() && (
          <ProgressionFilter
            counts={
              new Map([
                ['in_progress', adherenceWeeklyInProcessCount!.total],
                ['done', adherenceWeeklyDoneCount!.total],
              ])
            }
            progressionStatus={adherenceParams.progressionFilters}
            onChange={(f: ProgressionStatus[] | undefined) => {
              setCurrentPage(0)
              setAdherenceParams(prev => ({...prev, progressionFilters: f}))
            }}
          />
        )}

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
        {fullAdherenceWeeklyReport?.items && weeklyStats && (
          <div>
            <Filter
              adherenceStats={weeklyStats}
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
        {!hasNoFilter() && (
          <Button variant="text" onClick={() => setAdherenceParams({})} className={classes.clearFiltersButton}>
            Clear all filters&nbsp;&nbsp;
            <CloseIcon />
          </Button>
        )}
        <Box display="flex" mt={0} mb={2}>
          {sessions?.map(s => (
            <SessionLegend key={s.sessionGuid} symbolKey={s.sessionSymbol} sessionName={s.sessionName} />
          ))}
        </Box>
      </LoadingComponent>
      <LoadingComponent reqStatusLoading={adhStatus === 'idle' || adhStatus === 'loading'}>
        {adherenceWeeklyReport && (
          <div>
            <AdherenceParticipantsGrid studyId={studyId} adherenceWeeklyReport={adherenceWeeklyReport!} />

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
