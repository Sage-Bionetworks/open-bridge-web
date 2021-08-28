import {ReactComponent as CollapseIcon} from '@assets/collapse.svg'
import LiveIcon from '@assets/live_study_icon.svg'
import {ReactComponent as AddParticipantsIcon} from '@assets/participants/add_participants.svg'
import {ReactComponent as AddTestParticipantsIcon} from '@assets/participants/add_test_participants.svg'
import BatchEditIcon from '@assets/participants/batch_edit_icon.svg'
import DownloadIcon from '@assets/participants/download_icon.svg'
import SMSPhoneImg from '@assets/participants/joined_phone_icon.svg'
import ParticipantListFocusIcon from '@assets/participants/participant_list_focus_icon.svg'
import ParticipantListUnfocusIcon from '@assets/participants/participant_list_unfocus_icon.svg'
import {ReactComponent as PinkSendSMSIcon} from '@assets/participants/send_sms_link_pink_icon.svg'
import TestAccountFocusIcon from '@assets/participants/test_account_focus_icon.svg'
import TestAccountUnfocusIcon from '@assets/participants/test_account_unfocus_icon.svg'
import WithdrawnParticipantsFocusIcon from '@assets/participants/withdrawn_participants_focus_icon.svg'
import WithdrawnParticipantsUnfocusIcon from '@assets/participants/withdrawn_participants_unfocus_icon.svg'
import {ReactComponent as DeleteIcon} from '@assets/trash.svg'
import CollapsibleLayout from '@components/widgets/CollapsibleLayout'
import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import {MTBHeadingH3} from '@components/widgets/Headings'
import HelpBox from '@components/widgets/HelpBox'
import {
  DialogButtonPrimary,
  DialogButtonSecondary,
} from '@components/widgets/StyledComponents'
import {useAsync} from '@helpers/AsyncHook'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {StudyInfoData, useStudyInfoDataState} from '@helpers/StudyInfoContext'
import Utility from '@helpers/utility'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Tab,
  Tabs,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import EventService from '@services/event.service'
import ParticipantService from '@services/participants.service'
import ScheduleService from '@services/schedule.service'
import {latoFont, poppinsFont, theme} from '@style/theme'
import constants from '@typedefs/constants'
import {SchedulingEvent} from '@typedefs/scheduling'
import {
  ExtendedParticipantAccountSummary,
  ParticipantAccountSummary,
  ParticipantActivityType,
  ParticipantEvent,
  RequestStatus,
  SelectionType,
} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {RouteComponentProps} from 'react-router-dom'
import AddParticipants from './add/AddParticipants'
import DialogContents from './DialogContents'
import ParticipantDownloadTrigger from './download/ParticipantDownloadTrigger'
import ParticipantTableGrid from './grid/ParticipantTableGrid'
import ParticipantTablePagination from './grid/ParticipantTablePagination'
import BatchEditForm from './modify/BatchEditForm'
import ParticipantManagerPlaceholder from './ParticipantManagerPlaceholder'
import ParticipantSearch from './ParticipantSearch'
import ParticipantUtility from './participantUtility'

const useStyles = makeStyles(theme => ({
  root: {},

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
  gridToolBar: {
    backgroundColor: theme.palette.common.white,
    // padding: theme.spacing(1, 5, 0, 5),
    height: theme.spacing(9),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  tabPanel: {
    backgroundColor: theme.palette.common.white,
    boxShadow: 'none',
    padding: theme.spacing(0, 0, 2, 0),
  },
  studyId: {
    color: '#393434',
    marginRight: '24px',
    opacity: 0.75,
  },
  topButtons: {
    marginRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '36px',
  },
  topRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    //paddingLeft: theme.spacing(5),
  },
  horizontalGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: theme.spacing(5),
  },
  buttonImage: {
    marginRight: theme.spacing(0.5),
  },

  inputRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledImage: {
    opacity: 0.5,
  },
  topRowImage: {
    marginRight: theme.spacing(0.75),
  },
  deleteIcon: {
    height: '17px',
    width: '13px',
  },
  addParticipantIcon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    backgroundColor: '#AEDCC9',
    paddingTop: theme.spacing(1.5),
  },
  deleteButtonParticipant: {
    fontFamily: latoFont,
    marginLeft: theme.spacing(3),
    fontSize: '14px',
  },
  sendSMSButton: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: latoFont,
    fontSize: '14px',
  },
  batchEditButton: {
    marginRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: latoFont,
    fontSize: '14px',
  },
  selectedTab: {
    zIndex: 100,
    backgroundColor: theme.palette.common.white,
  },
  withdrawnParticipants: {
    width: '270px',
  },
  tab_icon: {
    borderBottom: '1px solid transparent',
  },
  unactiveTabIcon: {
    '&:hover div': {
      borderBottom: '1px solid black',
    },
  },
  collapsedAddTestUser: {
    '& > rect': {
      fill: '#AEDCC9',
    },
  },
  primaryDialogButton: {
    border: 'none',
    height: '48px',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
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
  {type: 'ACTIVE', label: 'Participant List'},
  {type: 'WITHDRAWN', label: 'Withdrawn Participants'},
  {type: 'TEST', label: 'Test Accounts'},
]

const TAB_ICONS_FOCUS = [
  ParticipantListFocusIcon,
  WithdrawnParticipantsFocusIcon,
  TestAccountFocusIcon,
]
const TAB_ICONS_UNFOCUS = [
  ParticipantListUnfocusIcon,
  WithdrawnParticipantsUnfocusIcon,
  TestAccountUnfocusIcon,
]

/*** general functions */
const getCurrentPageFromPageNavigationArrowPressed = (
  type: string,
  currentPage: number,
  totalParticipants: number,
  pageSize: number
): number => {
  // "FF" = forward to last page
  // "F" = forward to next pages
  // "B" = back to previous page
  // "BB" = back to beginning

  const numberOfPages = Math.ceil(totalParticipants / pageSize)
  if (type === 'F' && currentPage !== numberOfPages) {
    return currentPage + 1
  } else if (type === 'FF' && currentPage !== numberOfPages) {
    return numberOfPages
  } else if (type === 'B' && currentPage !== 1) {
    return currentPage - 1
  } else if (type === 'BB' && currentPage !== 1) {
    return 1
  }
  return currentPage //should not happen
}

/***  subcomponents  */
const AddTestParticipantsIconSC: FunctionComponent<{title: string}> = ({
  title,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.addParticipantIcon}>
      <AddTestParticipantsIcon title={title} />
    </div>
  )
}

const HelpBoxSC: FunctionComponent<{
  numRows: number | undefined
  status: RequestStatus
  isAddOpen: boolean
}> = ({numRows, status, isAddOpen}) => {
  return (
    <Box position="relative">
      {!numRows && !isAddOpen && status !== 'PENDING' && (
        <HelpBox
          topOffset={90}
          leftOffset={70}
          arrowTailLength={110}
          helpTextTopOffset={0}
          helpTextLeftOffset={50}
          arrowRotate={15}>
          <div>
            Currently there are no participants enrolled in this study. To add
            participants, click 'Add Participant'.
          </div>
        </HelpBox>
      )}

      {!numRows && isAddOpen && status === 'RESOLVED' && (
        <HelpBox
          topOffset={340}
          leftOffset={250}
          arrowTailLength={150}
          helpTextTopOffset={-70}
          helpTextLeftOffset={140}
          helpTextWidth={250}
          arrowRotate={0}>
          <div>
            You can upload a .csv or enter each participant credentials one by
            one. When you are done, return to “View” mode to send them an SMS
            link to download the app.
          </div>
        </HelpBox>
      )}
    </Box>
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
  const handleError = useErrorHandler()
  const classes = useStyles()

  const {study}: StudyInfoData = useStudyInfoDataState()
  const {token} = useUserSessionDataState()

  // The current page in the particpant grid the user is viewing
  const [currentPage, setCurrentPage] = React.useState(1)
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
  const [isUserSearchingForParticipant, setIsUserSearchingForParticipant] =
    React.useState(false)

  const [fileDownloadUrl, setFileDownloadUrl] = React.useState<
    string | undefined
  >(undefined)

  //user ids selectedForSction
  const [selectedParticipantIds, setSelectedParticipantIds] =
    React.useState<SelectedParticipantIdsType>({
      ACTIVE: [],
      TEST: [],
      WITHDRAWN: [],
    })
  const [isAllSelected, setIsAllSelected] = React.useState(false)

  //List of participants errored out during operation - used for deltee
  const [participantsWithError, setParticipantsWithError] = React.useState<
    ParticipantAccountSummary[]
  >([])

  //trigger data refresh on updates
  const [refreshParticipantsToggle, setRefreshParticipantsToggle] =
    React.useState(false)

  const {
    data,
    status,
    error,
    run,
    setData: setParticipantData,
  } = useAsync<ParticipantData>({
    status: 'PENDING',
    data: null,
  })

  const {
    data: studyEvents,
    run: getEvents,
    status: eventsStatus,
  } = useAsync<SchedulingEvent[]>({
    status: 'PENDING',
    data: [],
  })

  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    getEvents(ScheduleService.getEventsForSchedule(study.identifier))
  }, [study?.identifier, getEvents])

  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    const fn = async () => {
      console.log('getting data')
      const result: ParticipantData = await run(
        ParticipantUtility.getParticipants(
          study.identifier,
          currentPage,
          pageSize,
          tab
        )
      )
    }
    fn()
  }, [study?.identifier, refreshParticipantsToggle, currentPage, pageSize, tab])

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTab(newValue)
    setCurrentPage(1)
    setIsAllSelected(false)
  }

  React.useEffect(() => {
    console.log('data updated - resetting selected')
    if (isAllSelected) {
      setSelectedParticipantIds(prev => ({
        ...prev,
        [tab]: data?.items?.map(p => p.id) || [],
      }))
    } else {
      setSelectedParticipantIds(prev => ({...prev}))
    }
  }, [data])

  //callbacks from the participant grid
  const withdrawParticipant = async (participantId: string, note: string) => {
    await ParticipantService.withdrawParticipant(
      study!.identifier,
      token!,
      participantId,
      note
    )
    setRefreshParticipantsToggle(prev => !prev)
  }

  const updateParticipant = async (
    participantId: string,
    note: string,
    customEvents: ParticipantEvent[]
  ) => {
    await ParticipantService.updateParticipantNote(
      study!.identifier,
      token!,
      participantId,
      note
    )
    await EventService.updateParticipantCustomEvents(
      study!.identifier,
      token!,
      participantId,
      customEvents
    )
    setRefreshParticipantsToggle(prev => !prev)
  }

  const deleteSelectedParticipants = async () => {
    setLoadingIndicators(_ => ({isDeleting: true}))
    setParticipantsWithError([])
    let isError = false
    for (let i = 0; i < selectedParticipantIds[tab].length; i++) {
      try {
        const x = await ParticipantService.deleteParticipant(
          study!.identifier,
          token!,
          selectedParticipantIds[tab][i]
        )
      } catch (e) {
        isError = true
        const errorParticipant = data?.items?.find(
          p => p.id === selectedParticipantIds[tab][i]
        )
        if (errorParticipant) {
          setParticipantsWithError(prev => [...prev, errorParticipant])
        }
      }
    }
    setLoadingIndicators(_ => ({isDeleting: false}))
    if (!isError) {
      setDialogState({dialogOpenRemove: false, dialogOpenSMS: false})
      setRefreshParticipantsToggle(prev => !prev)
    }
  }

  const handleSearchParticipantRequest = async (
    searchValue: string | undefined
  ) => {
    let searchOptions:
      | {searchParam: 'EXTERNAL_ID' | 'PHONE_NUMBER'; searchValue: string}
      | undefined = undefined
    if (searchValue) {
      setIsUserSearchingForParticipant(true)
      const isById = Utility.isSignInById(study.signInTypes)
      const searchParam = isById ? 'EXTERNAL_ID' : 'PHONE_NUMBER'
      searchOptions = {
        searchParam,
        searchValue,
      }
    } else {
      setIsUserSearchingForParticipant(false)
    }
    const {items, total} = await run(
      ParticipantUtility.getParticipants(
        study.identifier,
        0,
        pageSize,
        tab,
        searchOptions
      )
    )
    setParticipantData({items, total})
  }

  const downloadParticipants = async (selectionType: SelectionType) => {
    setLoadingIndicators({isDownloading: true})

    //if getting all participants
    const participantsData: ParticipantData | undefined =
      selectionType === 'ALL'
        ? undefined
        : {
            items:
              data?.items?.filter(p =>
                selectedParticipantIds[tab].includes(p.id)
              ) || [],
            total: selectedParticipantIds[tab].length,
          }
    const participantBlob =
      await ParticipantUtility.getParticipantDataForDownload(
        study.identifier,
        tab,
        studyEvents,
        selectionType,
        Utility.isSignInById(study.signInTypes),
        participantsData
      )

    // get the fake link
    const fileObjUrl = URL.createObjectURL(participantBlob)
    setFileDownloadUrl(fileObjUrl)

    setLoadingIndicators({isDownloading: false})
  }

  const displayPlaceholderScreen =
    !constants.constants.IS_TEST_MODE && study.phase != 'in_flight'
  if (!study || eventsStatus === 'PENDING') {
    return (
      <Box mx="auto" my={5} textAlign="center">
        <CircularProgress />
      </Box>
    )
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else {
    return (
      <Box bgcolor="#F8F8F8">
        <Box px={3} py={2} display="flex" alignItems="center">
          <MTBHeadingH3 className={classes.studyId}>
            {' '}
            Study ID: {Utility.formatStudyId(study.identifier)}{' '}
          </MTBHeadingH3>
          {!displayPlaceholderScreen && (
            <img src={LiveIcon} style={{height: '25px'}}></img>
          )}
        </Box>
        {displayPlaceholderScreen ? (
          <ParticipantManagerPlaceholder />
        ) : (
          <>
            {tab === 'ACTIVE' && !isUserSearchingForParticipant && (
              <HelpBoxSC
                numRows={data?.items?.length}
                status={status}
                isAddOpen={isAddOpen}
              />
            )}
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
                        tab === tabDef.type && classes.selectedTab,
                        tabDef.type === 'WITHDRAWN' &&
                          classes.withdrawnParticipants
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
                              ? data
                                ? `(${data.total})`
                                : '(...)'
                              : ''
                          }`}
                        </div>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
              <Box bgcolor="white">
                <CollapsibleLayout
                  expandedWidth={300}
                  isFullWidth={true}
                  isHideContentOnClose={true}
                  isDrawerHidden={tab === 'WITHDRAWN'}
                  collapseButton={
                    <CollapseIcon
                      className={clsx(
                        tab === 'TEST' && classes.collapsedAddTestUser
                      )}
                    />
                  }
                  onToggleClick={(open: boolean) => setIsAddOpen(open)}
                  expandButton={
                    tab === 'ACTIVE' ? (
                      <AddParticipantsIcon title="Add Participant" />
                    ) : (
                      <AddTestParticipantsIconSC title="Add Test Participant" />
                    )
                  }
                  toggleButtonStyle={{
                    display: 'block',
                    padding: '0',
                    borderRadius: 0,
                    backgroundColor:
                      tab === 'ACTIVE' ? theme.palette.primary.dark : '#AEDCC9',
                  }}>
                  <>
                    <AddParticipants
                      customStudyEvents={studyEvents || []}
                      study={study}
                      token={token!}
                      onAdded={() => {
                        setRefreshParticipantsToggle(prev => !prev)
                      }}
                      isTestAccount={tab === 'TEST'}
                    />
                  </>
                  <div>
                    <Box className={classes.gridToolBar}>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center">
                        {/* This is here for now because the "Send SMS link" feature is not being included in the october release. */}
                        {false && !Utility.isSignInById(study.signInTypes) && (
                          <Button
                            aria-label="send-sms-text"
                            onClick={() => {
                              setParticipantsWithError([])
                              setDialogState({
                                dialogOpenRemove: false,
                                dialogOpenSMS: true,
                              })
                            }}
                            className={classes.sendSMSButton}
                            disabled={selectedParticipantIds[tab].length === 0}>
                            <img
                              src={SMSPhoneImg}
                              className={clsx(
                                selectedParticipantIds[tab].length === 0 &&
                                  classes.disabledImage,
                                classes.topRowImage
                              )}></img>
                            Send SMS link
                          </Button>
                        )}
                        {tab === 'ACTIVE' && (
                          <Button
                            aria-label="batch-edit"
                            onClick={() => {
                              setIsBatchEditOpen(true)
                            }}
                            className={classes.batchEditButton}
                            disabled={selectedParticipantIds[tab].length <= 1}>
                            <img
                              className={clsx(
                                selectedParticipantIds[tab].length <= 1 &&
                                  classes.disabledImage,
                                classes.topRowImage
                              )}
                              src={BatchEditIcon}></img>
                            Batch Edit
                          </Button>
                        )}

                        <ParticipantDownloadTrigger
                          onDownload={() =>
                            downloadParticipants(isAllSelected ? 'ALL' : 'SOME')
                          }
                          fileDownloadUrl={fileDownloadUrl}
                          hasItems={
                            !!data?.items?.length &&
                            selectedParticipantIds[tab].length > 0
                          }
                          onDone={() => {
                            URL.revokeObjectURL(fileDownloadUrl!)
                            setFileDownloadUrl(undefined)
                          }}>
                          <>
                            <img
                              src={DownloadIcon}
                              style={{
                                marginRight: '6px',
                                opacity:
                                  selectedParticipantIds[tab].length === 0
                                    ? 0.5
                                    : 1,
                              }}></img>
                            {!loadingIndicators.isDownloading ? (
                              'StudyParticipants.csv'
                            ) : (
                              <CircularProgress size={24} />
                            )}
                          </>
                        </ParticipantDownloadTrigger>

                        {tab !== 'WITHDRAWN' && (
                          <Button
                            aria-label="delete"
                            onClick={() => {
                              setParticipantsWithError([])
                              setDialogState({
                                dialogOpenRemove: true,
                                dialogOpenSMS: false,
                              })
                            }}
                            className={classes.deleteButtonParticipant}
                            disabled={selectedParticipantIds[tab].length === 0}>
                            <DeleteIcon
                              className={clsx(
                                selectedParticipantIds[tab].length === 0 &&
                                  classes.disabledImage,
                                classes.topRowImage,
                                classes.deleteIcon
                              )}></DeleteIcon>
                            Remove from Study
                          </Button>
                        )}
                      </Box>

                      <ParticipantSearch
                        isEnrolledById={Utility.isSignInById(study.signInTypes)}
                        onReset={() => {
                          handleSearchParticipantRequest(undefined)
                        }}
                        onSearch={(searchedValue: string) => {
                          handleSearchParticipantRequest(searchedValue)
                        }}
                        tab={tab}
                      />
                    </Box>
                    <div
                      role="tabpanel"
                      hidden={false}
                      id={`active-participants`}
                      className={classes.tabPanel}
                      style={{
                        marginLeft:
                          !isAddOpen && tab !== 'WITHDRAWN' ? '-48px' : '0',
                      }}>
                      <ParticipantTableGrid
                        rows={data?.items || []}
                        status={status}
                        customStudyEvents={studyEvents || []}
                        studyId={study.identifier}
                        totalParticipants={data?.total || 0}
                        isAllSelected={isAllSelected}
                        gridType={tab}
                        selectedParticipantIds={selectedParticipantIds[tab]}
                        onWithdrawParticipant={(
                          participantId: string,
                          note: string
                        ) => withdrawParticipant(participantId, note)}
                        onUpdateParticipant={(
                          participantId: string,
                          note: string,
                          customEvents?: ParticipantEvent[]
                        ) =>
                          updateParticipant(
                            participantId,
                            note,
                            customEvents || []
                          )
                        }
                        isEnrolledById={Utility.isSignInById(study.signInTypes)}
                        onRowSelected={(
                          /*id: string, isSelected: boolean*/ selection,
                          isAll
                        ) => {
                          if (isAll !== undefined) {
                            setIsAllSelected(isAll)
                          }
                          setSelectedParticipantIds(prev => ({
                            ...prev,
                            [tab]: selection,
                          }))
                        }}>
                        <ParticipantTablePagination
                          totalParticipants={data?.total || 0}
                          onPageSelectedChanged={(pageSelected: number) => {
                            setCurrentPage(pageSelected)
                          }}
                          currentPage={currentPage}
                          pageSize={pageSize}
                          setPageSize={setPageSize}
                          handlePageNavigationArrowPressed={(
                            button: string
                          ) => {
                            const currPage =
                              getCurrentPageFromPageNavigationArrowPressed(
                                button,
                                currentPage,
                                data?.total || 0,
                                pageSize
                              )
                            setCurrentPage(currPage)
                          }}
                        />
                      </ParticipantTableGrid>
                    </div>
                  </div>

                  <Box textAlign="center" pl={2}>
                    {tab !== 'TEST' ? 'ADD A PARTICIPANT' : 'ADD TEST USER'}
                  </Box>
                </CollapsibleLayout>
              </Box>
            </Box>
            <BatchEditForm
              isEnrolledById={Utility.isSignInById(study.signInTypes)}
              isBatchEditOpen={isBatchEditOpen}
              onSetIsBatchEditOpen={setIsBatchEditOpen}
              selectedParticipants={selectedParticipantIds[tab]}
              token={token!}
              studyId={study.identifier}
              onToggleParticipantRefresh={() =>
                setRefreshParticipantsToggle(prev => !prev)
              }
              isAllSelected={isAllSelected}></BatchEditForm>
            <Dialog
              open={dialogState.dialogOpenSMS || dialogState.dialogOpenRemove}
              maxWidth="xs"
              scroll="body"
              aria-labelledby="Remove Participant">
              <DialogTitleWithClose
                onCancel={() => {
                  setDialogState({
                    dialogOpenRemove: false,
                    dialogOpenSMS: false,
                  })
                }}>
                <>
                  {dialogState.dialogOpenRemove ? (
                    <DeleteIcon style={{width: '25px'}}></DeleteIcon>
                  ) : (
                    <PinkSendSMSIcon style={{width: '25px'}}></PinkSendSMSIcon>
                  )}
                  <span style={{paddingLeft: '8px'}}>
                    {dialogState.dialogOpenRemove
                      ? 'Remove From Study'
                      : 'Sending SMS Download Link'}
                  </span>
                </>
              </DialogTitleWithClose>
              <DialogContent
                style={{display: 'flex', justifyContent: 'center'}}>
                {(dialogState.dialogOpenRemove ||
                  dialogState.dialogOpenSMS) && (
                  <DialogContents
                    participantsWithError={participantsWithError}
                    study={study}
                    selectedParticipants={
                      data?.items?.filter(participant =>
                        selectedParticipantIds[tab].includes(participant.id)
                      ) || []
                    }
                    isProcessing={!!loadingIndicators.isDeleting}
                    isRemove={dialogState.dialogOpenRemove}
                    selectingAll={isAllSelected}
                    tab={tab}
                    token={token!}
                  />
                )}
              </DialogContent>

              {participantsWithError.length === 0 && (
                <DialogActions>
                  <DialogButtonSecondary
                    onClick={() =>
                      setDialogState({
                        dialogOpenRemove: false,
                        dialogOpenSMS: false,
                      })
                    }
                    style={{height: '48px'}}>
                    Cancel
                  </DialogButtonSecondary>

                  <DialogButtonPrimary
                    onClick={() => deleteSelectedParticipants()}
                    autoFocus
                    className={classes.primaryDialogButton}>
                    {dialogState.dialogOpenRemove
                      ? 'Permanently Remove'
                      : 'Yes, send SMS'}
                  </DialogButtonPrimary>
                </DialogActions>
              )}

              {participantsWithError.length > 0 && (
                <DialogActions>
                  <DialogButtonPrimary
                    onClick={() => {
                      setRefreshParticipantsToggle(prev => !prev)
                      setDialogState({
                        dialogOpenRemove: false,
                        dialogOpenSMS: false,
                      })
                    }}
                    color="primary">
                    Done
                  </DialogButtonPrimary>
                </DialogActions>
              )}
            </Dialog>
          </>
        )}
      </Box>
    )
  }
  return <>bye</>
}
export default ParticipantManager
