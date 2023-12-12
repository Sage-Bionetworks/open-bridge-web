import {ReactComponent as CollapseIcon} from '@assets/collapse.svg'
import {ReactComponent as AddTestParticipantsIcon} from '@assets/participants/add_test_participants.svg'

import CollapsibleLayout from '@components/widgets/CollapsibleLayout'
import TablePagination from '@components/widgets/pagination/TablePagination'
import ParticipantAdherenceContentShell from '@components/widgets/ParticipantAdherenceContentShell'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {default as Utility} from '@helpers/utility'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone'
import HandymanTwoToneIcon from '@mui/icons-material/HandymanTwoTone'
import LinkTwoToneIcon from '@mui/icons-material/LinkTwoTone'
import PersonAddAlt1TwoToneIcon from '@mui/icons-material/PersonAddAlt1TwoTone'
import PersonRemoveAlt1TwoToneIcon from '@mui/icons-material/PersonRemoveAlt1TwoTone'
import {Box, Button, CircularProgress, styled, Tab, Tabs} from '@mui/material'
import Alert from '@mui/material/Alert'
import {JOINED_EVENT_ID} from '@services/event.service'
import StudyService from '@services/study.service'
import {useStudy} from '@services/studyHooks'
import {theme} from '@style/theme'
import constants from '@typedefs/constants'
import {
  ExtendedParticipantAccountSummary,
  ParticipantAccountSummary,
  ParticipantActivityType,
  SelectionType,
} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {RouteComponentProps, useParams} from 'react-router-dom'
import {useEvents, useEventsForUsers} from '../../../services/eventHooks'
import {useInvalidateParticipants, useParticipants} from '../../../services/participantHooks'
import StudyBuilderHeader from '../StudyBuilderHeader'
import AddParticipants from './add/AddParticipants'
import CsvUtility from './csv/csvUtility'
import DownloadTrigger from '../DownloadTrigger'
import ParticipantTableGrid from './grid/ParticipantTableGrid'
import BatchEditForm from './modify/BatchEditForm'
import ParticipantDeleteModal from './ParticipantDeleteModal'
import ParticipantManagerPlaceholder from './ParticipantManagerPlaceholder'
import useStyles from './ParticipantManager_style'
import ParticipantSearch from './ParticipantSearch'
import WithdrawnTabNoParticipantsPage from './WithdrawnTabNoParticipantsPage'

const StyledGridToolBar = styled(Box, {label: 'StyledGridToolBar'})(({theme}) => ({
  height: theme.spacing(9),
  paddingLeft: theme.spacing(7),
  paddingRight: theme.spacing(7),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  '&  button': {
    display: 'flex',

    fontSize: '14px',
    marginRight: theme.spacing(2),
    '&:last-of-type': {
      marginRight: 0,
    },
  },
}))

const StyledTabPanel = styled(Box, {label: 'StyledTabPanel'})(({theme}) => ({
  backgroundColor: theme.palette.common.white,
  boxShadow: 'none',
  padding: theme.spacing(0, 0, 2, 0),
}))

/** types and constants  */
type ParticipantData = {
  items: ExtendedParticipantAccountSummary[]
  total: number
}

type SelectedParticipantIdsType = {
  ACTIVE: string[]
  TEST: string[]
  WITHDRAWN: string[]
}

const TAB_DEFs = [
  {type: 'ACTIVE', label: 'Participant List', icon: <GroupsTwoToneIcon />},
  {type: 'WITHDRAWN', label: 'Withdrawn Participants', icon: <PersonRemoveAlt1TwoToneIcon />},
  {type: 'TEST', label: 'Test Accounts', icon: <HandymanTwoToneIcon />},
]

const AddTestParticipantsIconSC: FunctionComponent<{title: string}> = ({title}) => {
  const classes = useStyles()
  return (
    <div>
      <AddTestParticipantsIcon title={title} />
    </div>
  )
}
const GoToDownloadPageLinkSC: FunctionComponent = () => {
  const classes = useStyles()
  return (
    <Button
      href="/app-store-download"
      target="_blank"
      variant="text"
      color="primary"
      aria-label="downloadApp"
      sx={{position: 'absolute', right: 0, top: 0}}
      startIcon={<LinkTwoToneIcon />}>
      App Download Link
    </Button>
  )
}

/*** main component */

type ParticipantManagerOwnProps = {
  title?: string
  paragraph?: string
  studyId?: string
}

type ParticipantManagerProps = ParticipantManagerOwnProps & RouteComponentProps

const ParticipantManager: FunctionComponent<ParticipantManagerProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const {token} = useUserSessionDataState()
  const {data: study, error: studyError, isLoading: isStudyLoading} = useStudy(studyId)

  const handleError = useErrorHandler()
  const classes = useStyles()
  const [pIds, setPIds] = React.useState<string[]>([])

  // The current page in the particpant grid the user is viewing
  const [currentPage, setCurrentPage] = React.useState(0)
  // The current page size of the particpant grid
  const [pageSize, setPageSize] = React.useState(25)
  // Withdrawn or active participants
  const [tab, setTab] = React.useState<ParticipantActivityType>('ACTIVE')
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isBatchEditOpen, setIsBatchEditOpen] = React.useState(false)
  const [loadingIndicators, setLoadingIndicators] = React.useState<{
    isDeleting?: boolean
    isDownloading?: boolean
  }>({})
  // Should delete dialog be open
  const [dialogState, setDialogState] = React.useState({
    dialogOpenRemove: false,
    dialogOpenSMS: false,
  })

  // True if the user is currently searching for a particpant using id
  const [error, setError] = React.useState<Error>()
  const [fileDownloadUrl, setFileDownloadUrl] = React.useState<string | undefined>(undefined)

  //user ids selectedForSction
  const [selectedParticipantIds, setSelectedParticipantIds] = React.useState<SelectedParticipantIdsType>({
    ACTIVE: [],
    TEST: [],
    WITHDRAWN: [],
  })
  const [isAllSelected, setIsAllSelected] = React.useState(false)

  //List of participants errored out during operation - used for deltee
  const [participantsWithError, setParticipantsWithError] = React.useState<ParticipantAccountSummary[]>([])

  const [searchValue, setSearchValue] = React.useState<string | undefined>(undefined)

  const isById = Utility.isSignInById(study?.signInTypes)
  const [data, setData] = React.useState<ParticipantData>()

  // Hook to get scheduled events
  const {data: scheduleEvents = [], error: eventError} = useEvents(studyId)

  // Hook to get participants
  const {
    data: pData,
    status,
    error: participantError,
  } = useParticipants(study?.identifier, currentPage, pageSize, tab, searchValue, isById)
  const {data: pEventsMap} = useEventsForUsers(study?.identifier, pIds)

  const invalidateParticipants = useInvalidateParticipants()

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTab(newValue)
    setCurrentPage(0)
    setIsAllSelected(false)
  }

  const resetSelectAll = () => {
    setIsAllSelected(false)
    setSelectedParticipantIds(prev => ({
      ...prev,
      [tab]: [],
    }))
  }

  React.useEffect(() => {
    if (participantError) setError(participantError)
  }, [participantError])

  React.useEffect(() => {
    if (pData && pData.items) {
      setPIds(pData.items.map(item => item.id))
    }
  }, [pData?.items])

  React.useEffect(() => {
    if (pData && pData.items && pEventsMap) {
      const items = pData.items.map(item => {
        const events = pEventsMap[item.id]
        return events
          ? {
              ...item,
              events: [
                ...events.customEvents,
                {
                  eventId: JOINED_EVENT_ID,
                  timestamp: events.timeline_retrieved,
                },
              ],
            }
          : item
      })
      setData({total: pData.total, items})
    }
  }, [pData, pEventsMap])
  React.useEffect(() => {
    if (isAllSelected) {
      setSelectedParticipantIds(prev => ({
        ...prev,
        [tab]: data?.items?.map(p => p.id) || [],
      }))
    } else {
      setSelectedParticipantIds(prev => ({...prev}))
    }
  }, [data])

  if (!study) {
    return isStudyLoading ? (
      <Box mx="auto" my={5} textAlign="center">
        <CircularProgress />
      </Box>
    ) : (
      <></>
    )
  }

  const downloadParticipants = async (selectionType: SelectionType) => {
    setLoadingIndicators({isDownloading: true})
    try {
      //if getting all participants
      const participantsData: ParticipantData | undefined =
        selectionType === 'ALL'
          ? undefined
          : {
              items: data?.items?.filter(p => selectedParticipantIds[tab].includes(p.id)) || [],
              total: selectedParticipantIds[tab].length,
            }
      const participantBlob = await CsvUtility.getParticipantDataForDownload(
        study.identifier,
        token!,
        tab,
        scheduleEvents.map(e => e.eventId),
        selectionType,
        Utility.isSignInById(study.signInTypes),
        participantsData
      )

      // get the fake link
      const fileObjUrl = URL.createObjectURL(participantBlob)
      setFileDownloadUrl(fileObjUrl)
    } catch (error) {
      alert(`Download error ${(error as Error).message.toString()}`)
    } finally {
      setLoadingIndicators({isDownloading: false})
    }
  }

  const displayPlaceholderScreen =
    !constants.constants.IS_TEST_MODE && StudyService.getDisplayStatusForStudyPhase(study.phase) !== 'LIVE'

  const displayNoParticipantsPage = status !== 'loading' && data?.items.length === 0 && tab === 'WITHDRAWN'

  return (
    <Box id="participantManager">
      <StudyBuilderHeader study={study} />
      {displayPlaceholderScreen ? (
        <ParticipantManagerPlaceholder study={study} />
      ) : (
        <>
          <ParticipantAdherenceContentShell title="Participant Manager">
            <Tabs
              color="secondary"
              value={tab}
              variant="standard"
              onChange={handleTabChange}
              TabIndicatorProps={{hidden: true}}>
              {!Utility.isArcApp() && <GoToDownloadPageLinkSC />}
              {TAB_DEFs.map((tabDef, index) => (
                <Tab
                  key={`tab_${tabDef.label}`}
                  value={tabDef.type}
                  sx={tab === tabDef.type ? {zIndex: 100, backgroundColor: theme.palette.common.white} : {}}
                  icon={
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                      {tabDef.icon}
                      <div>
                        &nbsp;&nbsp;
                        {`${tabDef.label} ${tab === tabDef.type ? (data ? `(${data.total})` : '(...)') : ''}`}
                      </div>
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </ParticipantAdherenceContentShell>
          <Box sx={{backgroundColor: '#fff', padding: theme.spacing(0)}}>
            <CollapsibleLayout
              isOpen={isAddOpen}
              expandedWidth={300}
              isFullWidth={true}
              isHideContentOnClose={true}
              isDrawerHidden={tab === 'WITHDRAWN'}
              collapseButton={<CollapseIcon className={clsx(tab === 'TEST' && classes.collapsedAddTestUser)} />}
              onToggleClick={(open: boolean) => setIsAddOpen(open)}
              expandButton={
                Utility.isArcApp() ? (
                  <></>
                ) : tab === 'ACTIVE' ? (
                  <Button>Add participant</Button>
                ) : (
                  <AddTestParticipantsIconSC title="Add Test Participant" />
                )
              }
              toggleButtonStyle={{
                display: 'block',
                padding: '0',
                borderRadius: 0,
              }}>
              <>
                <AddParticipants
                  scheduleEvents={scheduleEvents}
                  study={study}
                  token={token!}
                  onAdded={() => {
                    invalidateParticipants()
                  }}
                  isTestAccount={tab === 'TEST'}
                />
              </>
              {displayNoParticipantsPage ? (
                <WithdrawnTabNoParticipantsPage />
              ) : (
                <div>
                  <StyledGridToolBar>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {/* This is here for now because the "Send SMS link" feature is not being included in the october release. */}
                      {false && !Utility.isSignInById(study!.signInTypes) && (
                        <Button
                          aria-label="send-sms-text"
                          onClick={() => {
                            setParticipantsWithError([])
                            setDialogState({
                              dialogOpenRemove: false,
                              dialogOpenSMS: true,
                            })
                          }}
                          style={{marginRight: theme.spacing(1)}}
                          disabled={selectedParticipantIds[tab].length === 0}>
                          Send SMS link
                        </Button>
                      )}
                      {!isAddOpen && (
                        <Button
                          aria-label="add-participant"
                          variant="text"
                          color="primary"
                          onClick={() => {
                            setIsAddOpen(true)
                          }}
                          startIcon={<PersonAddAlt1TwoToneIcon />}>
                          Add Participant
                        </Button>
                      )}
                      {tab === 'ACTIVE' && (
                        <Button
                          aria-label="batch-edit"
                          onClick={() => {
                            setIsBatchEditOpen(true)
                          }}
                          disabled={selectedParticipantIds[tab].length <= 1}
                          startIcon={<EditTwoToneIcon />}>
                          Batch Edit
                        </Button>
                      )}
                      <DownloadTrigger
                        hasImage={true}
                        onDownload={() => downloadParticipants(isAllSelected ? 'ALL' : 'SOME')}
                        fileDownloadUrl={fileDownloadUrl}
                        fileLabel={'StudyParticipants.csv'}
                        hasItems={!!data?.items?.length && selectedParticipantIds[tab].length > 0}
                        onDone={() => {
                          URL.revokeObjectURL(fileDownloadUrl!)
                          setFileDownloadUrl(undefined)
                        }}>
                        <>
                          {!loadingIndicators.isDownloading ? 'StudyParticipants.csv' : <CircularProgress size={24} />}
                        </>
                      </DownloadTrigger>
                      <Button
                        aria-label="delete"
                        onClick={() => {
                          setParticipantsWithError([])
                          setDialogState({
                            dialogOpenRemove: true,
                            dialogOpenSMS: false,
                          })
                        }}
                        disabled={selectedParticipantIds[tab].length === 0}
                        startIcon={<DeleteTwoToneIcon />}>
                        Remove from Study
                      </Button>
                    </Box>
                    <ParticipantSearch
                      isSearchById={Utility.isSignInById(study.signInTypes)}
                      onReset={() => {
                        setSearchValue(undefined)
                        resetSelectAll()
                      }}
                      onSearch={(searchedValue: string) => {
                        resetSelectAll()
                        setSearchValue(searchedValue)
                      }}
                      tab={tab}
                    />
                  </StyledGridToolBar>
                  <StyledTabPanel role="tabpanel" hidden={false} id={`active-participants`}>
                    {error && (
                      <Alert color="error" onClose={() => setError(undefined)}>
                        {error.message}
                      </Alert>
                    )}
                    <Box sx={{margin: theme.spacing(0, 7, 0, 7)}}>
                      <ParticipantTableGrid
                        rows={data?.items || []}
                        status={status}
                        scheduleEventIds={scheduleEvents.map(e => e.eventId) || []}
                        studyId={study.identifier}
                        totalParticipants={data?.total || 0}
                        isAllSelected={isAllSelected}
                        gridType={tab}
                        selectedParticipantIds={selectedParticipantIds[tab]}
                        isEnrolledById={Utility.isSignInById(study.signInTypes)}
                        onRowSelected={(/*id: string, isSelected: boolean*/ selection, isAll) => {
                          if (isAll !== undefined) {
                            setIsAllSelected(isAll)
                          }
                          setSelectedParticipantIds(prev => ({
                            ...prev,
                            [tab]: selection,
                          }))
                        }}>
                        <TablePagination
                          totalItems={data?.total || 0}
                          onPageSelectedChanged={(pageSelected: number) => {
                            setCurrentPage(pageSelected)
                          }}
                          currentPage={currentPage}
                          pageSize={pageSize}
                          setPageSize={setPageSize}
                          counterTextSingular="participant"
                        />
                      </ParticipantTableGrid>
                    </Box>
                  </StyledTabPanel>
                </div>
              )}
              <Box
                sx={{
                  paddingLeft: theme.spacing(2),
                  fontSize: '18px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <PersonAddAlt1TwoToneIcon sx={{color: '#878E95'}} />
                &nbsp;&nbsp;
                {tab !== 'TEST' ? 'Add Participant' : 'Add Test Participant'}
              </Box>
            </CollapsibleLayout>
          </Box>
          <BatchEditForm
            isEnrolledById={Utility.isSignInById(study.signInTypes)}
            isBatchEditOpen={isBatchEditOpen}
            onSetIsBatchEditOpen={setIsBatchEditOpen}
            selectedParticipants={selectedParticipantIds[tab]}
            studyId={study.identifier}
            onToggleParticipantRefresh={() => invalidateParticipants()}
            isAllSelected={isAllSelected}></BatchEditForm>
          <ParticipantDeleteModal
            studyId={studyId}
            dialogState={dialogState}
            onClose={(_dialogState: {dialogOpenRemove: boolean; dialogOpenSMS: boolean}) => {
              setDialogState(_dialogState)
              resetSelectAll()
            }}
            currentPage={currentPage}
            pageSize={pageSize}
            tab={tab}
            isAllSelected={isAllSelected}
            selectedParticipantIds={selectedParticipantIds}
            participantsWithError={participantsWithError}
            resetParticipantsWithError={() => setParticipantsWithError([])}
            loadingIndicators={loadingIndicators}
            onLoadingIndicatorsChange={(isDeleting: boolean) => {
              setLoadingIndicators(_ => ({isDeleting: isDeleting}))
            }}
          />
        </>
      )}
    </Box>
  )
}
export default ParticipantManager
