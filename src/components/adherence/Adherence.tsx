import AdherenceUnfocusIcon from '@assets/adherence/adh_tab_off.svg'
import AdherenceFocusIcon from '@assets/adherence/adh_tab_on.svg'
import SummaryUnfocusIcon from '@assets/adherence/sum_tab_off.svg'
import SummaryFocusIcon from '@assets/adherence/sum_tab_on.svg'
import {useAdherenceForWeek} from '@components/studies/adherenceHooks'
import {useStudy} from '@components/studies/studyHooks'
import {ErrorFallback, ErrorHandler} from '@components/widgets/ErrorHandler'
import NonDraftHeaderFunctionComponent from '@components/widgets/StudyIdWithPhaseImage'
import {Box, Tab, Tabs} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont, poppinsFont} from '@style/theme'
import {ExtendedParticipantAccountSummary} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {RouteComponentProps, useLocation, useParams} from 'react-router-dom'
import AdherenceParticipants from './participants/AdherenceParticipants'
import AdherenceSummary from './summary/AdherenceSummary'

const useStyles = makeStyles(theme => ({
  root: {},
  tab_icon: {
    borderBottom: '1px solid transparent',
  },
  unactiveTabIcon: {
    '&:hover div': {
      borderBottom: '1px solid black',
    },
  },

  tab: {
    marginRight: theme.spacing(2),
    width: '250px',
    clipPath: 'polygon(10% 0%, 90% 0, 98% 100%,0 100%)',
    marginLeft: theme.spacing(-3.5),
    zIndex: 0,
    backgroundColor: '#F0F0F0',
    fontSize: '12px',
    fontFamily: poppinsFont,
  },
  selectedTab: {
    zIndex: 100,
    backgroundColor: theme.palette.common.white,
  },
  downloadPageLinkButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    display: 'flex',
    fontFamily: latoFont,
    fontSize: '14px',
  },
}))

/** types and constants  */
type ParticipantData = {
  items: ExtendedParticipantAccountSummary[]
  total: number
}

const TAB_DEFs = [
  {type: 'SUMMARY', label: 'Adherence Summary'},
  {type: 'ENROLLED', label: 'Active Participants'},
]

const TAB_ICONS_FOCUS = [SummaryFocusIcon, AdherenceFocusIcon]
const TAB_ICONS_UNFOCUS = [SummaryUnfocusIcon, AdherenceUnfocusIcon]
export type AdherenceTabType = 'SUMMARY' | 'ENROLLED'

type AdherenceOwnProps = {
  studyId?: string
}

type AdherenceProps = AdherenceOwnProps & RouteComponentProps

const Adherence: FunctionComponent<AdherenceProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()
  const isEnrolledTab =
    new URLSearchParams(useLocation().search)?.get('tab') === 'ENROLLED'
  const {data: adherenceWeeklyReport} = useAdherenceForWeek(studyId, 0, 5, {})

  // Withdrawn or active participants
  const [tab, setTab] = React.useState<AdherenceTabType>(
    isEnrolledTab || true ? 'ENROLLED' : 'SUMMARY'
  )

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTab(newValue)
  }

  const classes = useStyles()

  const {
    data: study,
    error: studyError,
    isLoading: isStudyLoading,
  } = useStudy(studyId)

  return (
    <Box bgcolor="#F8F8F8" px={5} minHeight="100vh">
      <Box px={3} py={2} display="flex" alignItems="center">
        <NonDraftHeaderFunctionComponent study={study} />
      </Box>

      <Box py={0} pr={3} pl={2}>
        <Tabs
          value={tab}
          variant="standard"
          onChange={handleTabChange}
          TabIndicatorProps={{hidden: true}}>
          {TAB_DEFs.map((tabDef, index) => (
            <Tab
              key={`tab_${tabDef.label}`}
              value={tabDef.type}
              classes={{
                root: clsx(
                  classes.tab,
                  tab === tabDef.type && classes.selectedTab
                ),
              }}
              icon={
                <Box
                  display="flex"
                  flexDirection="row"
                  className={clsx(
                    classes.tab_icon,
                    tab !== tabDef.type && classes.unactiveTabIcon
                  )}>
                  <img
                    src={
                      tab === tabDef.type
                        ? TAB_ICONS_FOCUS[index]
                        : TAB_ICONS_UNFOCUS[index]
                    }
                    style={{marginRight: '6px'}}></img>
                  <div>
                    {`${tabDef.label} ${
                      tab === tabDef.type
                        ? '(' + (adherenceWeeklyReport?.total || '...') + ')'
                        : ''

                      /*? data 
                              ? `(${data.total})`
                              : '(...)'
                            : ''*/
                    }`}
                  </div>
                </Box>
              }
            />
          ))}
        </Tabs>
        <Box bgcolor="white">
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={ErrorHandler}>
            {tab === 'SUMMARY' ? (
              <AdherenceSummary />
            ) : (
              <AdherenceParticipants />
            )}
          </ErrorBoundary>
        </Box>
      </Box>
    </Box>
  )
}
export default Adherence
