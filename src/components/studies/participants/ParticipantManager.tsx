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
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { jsonToCSV } from 'react-papaparse'
import { RouteComponentProps } from 'react-router-dom'
import { ReactComponent as CollapseIcon } from '../../../assets/collapse.svg'
import { ReactComponent as AddParticipantsIcon } from '../../../assets/participants/add_participants.svg'
import { ReactComponent as AddTestParticipantsIcon } from '../../../assets/participants/add_test_participants.svg'
import SMSPhoneImg from '../../../assets/participants/joined_phone_icon.svg'
import ParticipantListFocusIcon from '../../../assets/participants/participant_list_focus_icon.svg'
import ParticipantListUnfocusIcon from '../../../assets/participants/participant_list_unfocus_icon.svg'
import TestAccountFocusIcon from '../../../assets/participants/test_account_focus_icon.svg'
import TestAccountUnfocusIcon from '../../../assets/participants/test_account_unfocus_icon.svg'
import WithdrawnParticipantsFocusIcon from '../../../assets/participants/withdrawn_participants_focus_icon.svg'
import WithdrawnParticipantsUnfocusIcon from '../../../assets/participants/withdrawn_participants_unfocus_icon.svg'
import { ReactComponent as DeleteIcon } from '../../../assets/trash.svg'
import { useAsync } from '../../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import {
  StudyInfoData,
  useStudyInfoDataState,
} from '../../../helpers/StudyInfoContext'
import ParticipantService, {
  ParticipantRelevantEvents
} from '../../../services/participants.service'
import { latoFont, poppinsFont, theme } from '../../../style/theme'
import {
  ExtendedParticipantAccountSummary,
  ParticipantAccountSummary,
  ParticipantActivityType,
  RequestStatus,
  StringDictionary,
} from '../../../types/types'
import CollapsibleLayout from '../../widgets/CollapsibleLayout'
import DialogTitleWithClose from '../../widgets/DialogTitleWithClose'
import { MTBHeadingH3 } from '../../widgets/Headings'
import HelpBox from '../../widgets/HelpBox'
import {
  DialogButtonPrimary,
  DialogButtonSecondary,
} from '../../widgets/StyledComponents'
import LiveIcon from '../../../assets/live_study_icon.svg'
import AddParticipants from './AddParticipants'
import DialogContents from './DialogContents'
import ParticipantDownload, {
  ParticipantDownloadType,
} from './ParticipantDownload'
import ParticipantSearch from './ParticipantSearch'
import ParticipantTableGrid from './ParticipantTableGrid'
import { ReactComponent as PinkSendSMSIcon } from '../../../assets/participant-manager/send_sms_link_pink_icon.svg'
import ParticipantTablePagination from './ParticipantTablePagination'

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
    marginRight: theme.spacing(3),
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
  { type: 'ACTIVE', label: 'Participant List' },
  { type: 'WITHDRAWN', label: 'Withdrawn Participants' },
  { type: 'TEST', label: 'Test Accounts' },
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
  pageSize: number,
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

async function getParticipants(
  studyId: string,
  token: string,
  currentPage: number,
  pageSize: number, // set to 0 to get all the participants
  tab: ParticipantActivityType = 'ACTIVE',
): Promise<ParticipantData> {
  const offset = (currentPage - 1) * pageSize

  let participants: ParticipantData = await ParticipantService.getParticipants(
    studyId,
    token!,
    tab,
    pageSize,
    offset,
  )

  const retrievedParticipants = participants ? participants.items : []
  const numberOfParticipants = participants ? participants.total : 0
  const eventsMap: StringDictionary<ParticipantRelevantEvents> =
    await ParticipantService.getRelevantEventsForParticipans(
      studyId,
      token,
      retrievedParticipants.map(p => p.id),
    )
  const result = retrievedParticipants!.map(participant => {
    const id = participant.id as string
    const event = eventsMap[id]
    const updatedParticipant = {
      ...participant,
      clinicVisitDate: event.clinicVisitDate,
      joinedDate: event.joinedDate,
      smsDate: event.smsDate,
    }
    return updatedParticipant
  })
  console.log('returning result')
  return { items: result, total: numberOfParticipants }
}

/***  subcomponents  */
const AddTestParticipantsIconSC = () => {
  const classes = useStyles()
  return (
    <div className={classes.addParticipantIcon}>
      <AddTestParticipantsIcon />
    </div>
  )
}

const HelpBoxSC: FunctionComponent<{
  numRows: number | undefined
  status: RequestStatus
}> = ({ numRows, status }) => {
  return (
    <Box px={3} py={2} position="relative">
      {!numRows && status !== 'PENDING' && (
        <HelpBox
          topOffset={40}
          leftOffset={160}
          arrowTailLength={150}
          helpTextTopOffset={40}
          helpTextLeftOffset={100}
          arrowRotate={45}
        >
          <div>
            Currently there are no participants enrolled in this study. To add
            participants, switch to Edit mode.
          </div>
        </HelpBox>
      )}

      {!numRows &&
        /*!isUserSearchingForParticipant &&*/
        status === 'RESOLVED' && (
          <HelpBox
            topOffset={340}
            leftOffset={250}
            arrowTailLength={150}
            helpTextTopOffset={-70}
            helpTextLeftOffset={140}
            helpTextWidth={250}
            arrowRotate={0}
          >
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

  const { study }: StudyInfoData = useStudyInfoDataState()
  const { token } = useUserSessionDataState()

  // The current page in the particpant grid the user is viewing
  const [currentPage, setCurrentPage] = React.useState(1)
  // The current page size of the particpant grid
  const [pageSize, setPageSize] = React.useState(25)
  // Withdrawn or active participants
  const [tab, setTab] = React.useState<ParticipantActivityType>('ACTIVE')
  const [isAddOpen, setIsAddOpen] = React.useState(false)
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
  const [
    isUserSearchingForParticipant,
    setIsUserSearchingForParticipant,
  ] = React.useState(false)

  const [fileDownloadUrl, setFileDownloadUrl] = React.useState<
    string | undefined
  >(undefined)

  //user ids selectedForSction
  const [
    selectedParticipantIds,
    setSelectedParticipantIds,
  ] = React.useState<SelectedParticipantIdsType>({
    ACTIVE: [],
    TEST: [],
    WITHDRAWN: [],
  })
  const [isAllSelected, setIsAllSelected] = React.useState(false)

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTab(newValue)
    setCurrentPage(1)
    setIsAllSelected(false)
  }

  //List of participants errored out during operation - used for deltee
  const [participantsWithError, setParticipantsWithError] = React.useState<
    ParticipantAccountSummary[]
  >([])

  //trigger data refresh on updates
  const [
    refreshParticipantsToggle,
    setRefreshParticipantsToggle,
  ] = React.useState(false)

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

  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    const fn = async () => {
      console.log('getting data')
      const result: ParticipantData = await run(
        getParticipants(study.identifier, token!, currentPage, pageSize, tab),
      )
    }
    fn()
  }, [
    study?.identifier,
    refreshParticipantsToggle,
    currentPage,
    pageSize,
    token,
    tab,
  ])

  React.useEffect(() => {
    console.log('data updated - resetting selected')
    if (isAllSelected) {
      console.log('selected')
      setSelectedParticipantIds(prev => ({
        ...prev,
        [tab]: data?.items.map(p => p.id) || [],
      }))
    } else {
      setSelectedParticipantIds(prev => ({ ...prev }))
    }
  }, [data])

  //callbacks from the participant grid
  const withdrawParticipant = async (participantId: string, note: string) => {
    await ParticipantService.withdrawParticipant(
      study!.identifier,
      token!,
      participantId,
      note,
    )
    setRefreshParticipantsToggle(prev => !prev)
  }

  const updateParticipant = async (
    participantId: string,
    note: string,
    clinicVisitDate?: Date,
  ) => {
    await ParticipantService.updateNotesAndClinicVisitForParticipant(
      study!.identifier,
      token!,
      participantId,
      {
        note,
        clinicVisitDate: clinicVisitDate,
      },
    )
    setRefreshParticipantsToggle(prev => !prev)
  }

  const deleteSelectedParticipants = async () => {
    setLoadingIndicators(_ => ({ isDeleting: true }))
    setParticipantsWithError([])
    let isError = false
    for (let i = 0; i < selectedParticipantIds[tab].length; i++) {
      try {
        const x = await ParticipantService.deleteParticipant(
          study!.identifier,
          token!,
          selectedParticipantIds[tab][i],
        )
      } catch (e) {
        isError = true
        const errorParticipant = data?.items.find(
          p => p.id === selectedParticipantIds[tab][i],
        )
        if (errorParticipant) {
          setParticipantsWithError(prev => [...prev, errorParticipant])
        }
      }
    }
    setLoadingIndicators(_ => ({ isDeleting: false }))
    if (!isError) {
      setDialogState({ dialogOpenRemove: false, dialogOpenSMS: false })
      setRefreshParticipantsToggle(prev => !prev)
    }
  }

  const handleSearchParticipantRequest = async (searchedValue: string) => {
    const result =
      tab === 'ACTIVE'
        ? await ParticipantService.getParticipantById(
            study.identifier,
            token!,
            searchedValue,
          )
        : await ParticipantService.getEnrollmentsWithdrawnById(
            study.identifier,
            token!,
            searchedValue,
          )
    const realResult = result ? [result] : []
    const totalParticipantsFound = result ? 1 : 0
    setParticipantData({ items: realResult, total: totalParticipantsFound })
  }

  const handleResetSearch = async () => {
    const result = await run(
      getParticipants(study!.identifier, token!, currentPage, pageSize),
    )
    setParticipantData({ items: result.items, total: result.total })
  }

  const downloadParticipants = async (selection: ParticipantDownloadType) => {
    debugger
    setLoadingIndicators({ isDownloading: true })

    //if getting all participants
    const participantsData: ParticipantData =
      selection === 'ALL'
        ? await getParticipants(study.identifier, token!, 0, 0, tab)
        : {
            items:
              data?.items.filter(p =>
                selectedParticipantIds[tab].includes(p.id),
              ) || [],
            total: selectedParticipantIds[tab].length,
          }
    //massage data
    const transformedParticipantsData = participantsData.items.map(
      (p: ExtendedParticipantAccountSummary) => ({
        participantId: p.externalIds[study.identifier],
        healthCode: p.id,
        phoneNumber: p.phone?.nationalFormat,
        clinicVisitDate: p.clinicVisitDate
          ? new Date(p.clinicVisitDate).toLocaleDateString()
          : '-',
        joinedDate: p.joinedDate
          ? new Date(p.joinedDate).toLocaleDateString()
          : '',
        note: '',
      }),
    )

    //csv and blob it
    const csvData = jsonToCSV(transformedParticipantsData)
    const blob = new Blob([csvData], {
      type: 'text/csv;charset=utf8;',
    })
    // get the fake link
    const fileObjUrl = URL.createObjectURL(blob)
    setFileDownloadUrl(fileObjUrl)
    setLoadingIndicators({ isDownloading: false })
  }

  if (!study) {
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
            Study ID: {study.identifier}{' '}
          </MTBHeadingH3>
          <img src={LiveIcon} style={{ height: "25px" }}></img>
        </Box>

        {tab === 'ACTIVE' && (
          <HelpBoxSC numRows={data?.items.length} status={status} />
        )}

        <Box py={0} pr={3} pl={2}>
          <Tabs
            value={tab}
            variant="standard"
            onChange={handleTabChange}
            TabIndicatorProps={{ hidden: true }}
          >
            {TAB_DEFs.map((tabDef, index) => (
              <Tab
                value={tabDef.type}
                classes={{
                  root: clsx(
                    classes.tab,
                    tab === tabDef.type && classes.selectedTab,
                    tabDef.type === 'WITHDRAWN' &&
                      classes.withdrawnParticipants,
                  ),
                }}
                icon={
                  <Box
                    display="flex"
                    flexDirection="row"
                    className={clsx(
                      classes.tab_icon,
                      tab !== tabDef.type && classes.unactiveTabIcon,
                    )}
                  >
                    <img
                      src={
                        tab === tabDef.type
                          ? TAB_ICONS_FOCUS[index]
                          : TAB_ICONS_UNFOCUS[index]
                      }
                      style={{ marginRight: '6px' }}
                    ></img>
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
          <Box marginTop="-16px">
            <CollapsibleLayout
              expandedWidth={300}
              isFullWidth={true}
              isHideContentOnClose={true}
              isDrawerHidden={tab === 'WITHDRAWN'}
              collapseButton={
                <CollapseIcon
                  className={clsx(
                    tab === 'TEST' && classes.collapsedAddTestUser,
                  )}
                />
              }
              onToggleClick={(open: boolean) => setIsAddOpen(open)}
              expandButton={
                tab === 'ACTIVE' ? (
                  <AddParticipantsIcon />
                ) : (
                  <AddTestParticipantsIconSC />
                )
              }
              toggleButtonStyle={{
                display: 'block',
                padding: '0',
                borderRadius: 0,
                backgroundColor:
                  tab === 'ACTIVE' ? theme.palette.primary.dark : '#AEDCC9',
              }}
            >
              <>
                <AddParticipants
                  study={study}
                  token={token!}
                  onAdded={() => {
                    setRefreshParticipantsToggle(prev => !prev)
                  }}
                  isTestAccount={tab === 'TEST'}
                ></AddParticipants>
              </>
              <div>
                <Box className={classes.gridToolBar}>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    {tab !== 'WITHDRAWN' &&
                      study.clientData.enrollmentType === 'PHONE' && (
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
                          disabled={selectedParticipantIds[tab].length === 0}
                        >
                          <img
                            src={SMSPhoneImg}
                            className={clsx(
                              selectedParticipantIds[tab].length === 0 &&
                                classes.disabledImage,
                              classes.topRowImage,
                            )}
                          ></img>
                          Send SMS link
                        </Button>
                      )}

                    <ParticipantDownload
                      isProcessing={loadingIndicators.isDownloading}
                      onDownload={() =>
                        downloadParticipants(isAllSelected ? 'ALL' : 'SELECTED')
                      }
                      fileDownloadUrl={fileDownloadUrl}
                      hasItems={!!data?.items?.length}
                      selectedLength={selectedParticipantIds[tab].length}
                      onDone={() => {
                        URL.revokeObjectURL(fileDownloadUrl!)
                        setFileDownloadUrl(undefined)
                      }}
                    />
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
                        disabled={selectedParticipantIds[tab].length === 0}
                      >
                        <DeleteIcon
                          className={clsx(
                            selectedParticipantIds[tab].length === 0 &&
                              classes.disabledImage,
                            classes.topRowImage,
                            classes.deleteIcon,
                          )}
                        ></DeleteIcon>
                        Remove from Study
                      </Button>
                    )}
                  </Box>

                  <ParticipantSearch
                    onReset={() => {
                      setIsUserSearchingForParticipant(false)
                      handleResetSearch()
                    }}
                    onSearch={(searchedValue: string) => {
                      setIsUserSearchingForParticipant(true)
                      handleSearchParticipantRequest(searchedValue)
                    }}
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
                  }}
                >
                  <ParticipantTableGrid
                    rows={data?.items || []}
                    status={status}
                    studyId={study.identifier}
                    totalParticipants={data?.total || 0}
                    isAllSelected={isAllSelected}
                    gridType={tab}
                    selectedParticipantIds={selectedParticipantIds[tab]}
                    onWithdrawParticipant={(
                      participantId: string,
                      note: string,
                    ) => withdrawParticipant(participantId, note)}
                    onUpdateParticipant={(
                      participantId: string,
                      note: string,
                      clinicVisitDate?: Date,
                    ) =>
                      updateParticipant(participantId, note, clinicVisitDate)
                    }
                    enrollmentType={study.clientData.enrollmentType!}
                    onRowSelected={(
                      /*id: string, isSelected: boolean*/ selection,
                      isAll,
                    ) => {
                      if (isAll !== undefined) {
                        setIsAllSelected(isAll)
                      }
                      setSelectedParticipantIds(prev => ({
                        ...prev,
                        [tab]: selection,
                      }))
                    }}
                  >
                    <ParticipantTablePagination
                      totalParticipants={data?.total || 0}
                      onPageSelectedChanged={(pageSelected: number) => {
                        setCurrentPage(pageSelected)
                      }}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      setPageSize={setPageSize}
                      handlePageNavigationArrowPressed={(button: string) => {
                        const currPage =
                          getCurrentPageFromPageNavigationArrowPressed(
                            button,
                            currentPage,
                            data?.total || 0,
                            pageSize,
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

        <Dialog
          open={dialogState.dialogOpenSMS || dialogState.dialogOpenRemove}
          maxWidth="xs"
          scroll="body"
          aria-labelledby="Remove Participant"
        >
          <DialogTitleWithClose
            onCancel={() => {
              setDialogState({ dialogOpenRemove: false, dialogOpenSMS: false })
            }}
          >
            <>
              {dialogState.dialogOpenRemove ? (
                <DeleteIcon style={{ width: '25px' }}></DeleteIcon>
              ) : (
                <PinkSendSMSIcon style={{ width: '25px' }}></PinkSendSMSIcon>
              )}
              <span style={{ paddingLeft: '8px' }}>
                {dialogState.dialogOpenRemove
                  ? 'Remove From Study'
                  : 'Sending SMS Download Link'}
              </span>
            </>
          </DialogTitleWithClose>
          <DialogContent style={{ display: 'flex', justifyContent: 'center' }}>
            {(dialogState.dialogOpenRemove || dialogState.dialogOpenSMS) && (
              <DialogContents
                participantsWithError={participantsWithError}
                study={study}
                selectedParticipants={
                  data?.items.filter(participant =>
                    selectedParticipantIds[tab].includes(participant.id),
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
                style={{ height: '48px' }}
              >
                Cancel
              </DialogButtonSecondary>

              <DialogButtonPrimary
                onClick={() => deleteSelectedParticipants()}
                autoFocus
                className={classes.primaryDialogButton}
              >
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
                color="primary"
              >
                Done
              </DialogButtonPrimary>
            </DialogActions>
          )}
        </Dialog>
      </Box>
    )
  }
  return <>bye</>
}
export default ParticipantManager
