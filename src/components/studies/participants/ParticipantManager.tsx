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
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { jsonToCSV } from 'react-papaparse'
import { RouteComponentProps } from 'react-router-dom'
import { ReactComponent as ExpandIcon } from '../../../assets/add_participants.svg'
import { ReactComponent as CollapseIcon } from '../../../assets/collapse.svg'
import { ReactComponent as DeleteIcon } from '../../../assets/trash.svg'
import { useAsync } from '../../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import {
  StudyInfoData,
  useStudyInfoDataState,
} from '../../../helpers/StudyInfoContext'
import ParticipantService from '../../../services/participants.service'
import { theme, latoFont, poppinsFont } from '../../../style/theme'
import {
  ExtendedParticipantAccountSummary,
  ParticipantAccountSummary,
  ParticipantActivityType,
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
import LiveIcon from '../LiveIcon'
import AddParticipants from './AddParticipants'
import DeleteDialog from './DeleteDialogContents'
import ParticipantDownload, {
  ParticipantDownloadType,
} from './ParticipantDownload'
import ParticipantSearch from './ParticipantSearch'
import ParticipantTableGrid from './ParticipantTableGrid'
import SMSPhoneImg from '../../../assets/ParticipantManager/joined_phone_icon.svg'
import ParticipantListFocusIcon from '../../../assets/ParticipantManager/participant_list_focus_icon.svg'
import ParticipantListUnfocusIcon from '../../../assets/ParticipantManager/participant_list_unfocus_icon.svg'
import TestAccountFocusIcon from '../../../assets/ParticipantManager/test_account_focus_icon.svg'
import TestAccountUnfocusIcon from '../../../assets/ParticipantManager/test_account_unfocus_icon.svg'
import WithdrawnParticipantsFocusIcon from '../../../assets/ParticipantManager/withdrawn_participants_focus_icon.svg'
import WithdrawnParticipantsUnfocusIcon from '../../../assets/ParticipantManager/withdrawn_participants_unfocus_icon.svg'
import clsx from 'clsx'

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
}))

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

type ParticipantManagerOwnProps = {
  title?: string
  paragraph?: string
  studyId?: string
}

const participantRecordTemplate: ParticipantAccountSummary = {
  status: 'unverified',

  firstName: '',
  lastName: '',
  email: '',
  id: '',
  externalIds: {},
}

async function getParticipants(
  studyId: string,
  token: string,
  currentPage: number,
  pageSize: number, // set to 0 to get all the participants
  tab: ParticipantActivityType = 'ACTIVE',
): Promise<ParticipantData> {
  const offset = (currentPage - 1) * pageSize

  let participants: ParticipantData

  if (tab === 'WITHDRAWN') {
    participants =
      pageSize > 0
        ? await ParticipantService.getEnrollmentsWithdrawn(
            studyId,
            token!,
            pageSize,
            offset,
          )
        : await ParticipantService.getAllEnrollmentsWithdrawn(studyId, token!)
  } else {
    participants =
      pageSize > 0
        ? await ParticipantService.getParticipants(
            studyId,
            token!,
            pageSize,
            offset,
          )
        : await ParticipantService.getAllParticipants(studyId, token!)
  }
  const retrievedParticipants = participants ? participants.items : []
  const numberOfParticipants = participants ? participants.total : 0
  const eventsMap: StringDictionary<{
    clinicVisitDate: string
    joinedDate: string
  }> = await ParticipantService.getRelevantEventsForParticipans(
    studyId,
    token,
    retrievedParticipants.map(p => p.id),
  )
  const result = retrievedParticipants!.map(participant => {
    const id = participant.id as string
    const event = eventsMap[id]
    const updatedParticipant = {
      ...participant,
      clinicVisit: event.clinicVisitDate,
      dateJoined: event.joinedDate,
    }
    return updatedParticipant
  })
  console.log('returning result')
  return { items: result, total: numberOfParticipants }
}

type ParticipantManagerProps = ParticipantManagerOwnProps & RouteComponentProps

type ParticipantData = {
  items: ExtendedParticipantAccountSummary[]
  total: number
}

type SelectedParticipantIdsType = {
  ACTIVE: string[]
  TEST: string[]
  WITHDRAWN: string[]
}

const ParticipantManager: FunctionComponent<ParticipantManagerProps> = () => {
  const handleError = useErrorHandler()
  const classes = useStyles()

  const { study }: StudyInfoData = useStudyInfoDataState()
  const { token } = useUserSessionDataState()

  // The current page in the particpant grid the user is viewing
  const [currentPage, setCurrentPage] = React.useState(1)
  // The current page size of the particpant grid
  const [pageSize, setPageSize] = React.useState(20)
  // Withdrawn or active participants
  const [tab, setTab] = React.useState<ParticipantActivityType>('ACTIVE')
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [loadingIndicators, setLoadingIndicators] = React.useState<{
    isDeleting?: boolean
    isDownloading?: boolean
  }>({})
  // Should delete dialog be open
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = React.useState(false)

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
      setSelectedParticipantIds(prev => ({ ...prev, [tab]: data?.items || [] }))
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
    notes: string,
    clinicVisitDate?: Date,
  ) => {
    await ParticipantService.updateNotesAndClinicVisitForParticipant(
      study!.identifier,
      token!,
      participantId,
      {
        notes,
        clinicVisitDate: clinicVisitDate,
      },
    )
    setRefreshParticipantsToggle(prev => !prev)
  }

  /* THIS IS UTILITY FUNCTION JUST FOR TESTING! */
  /*const makeTestGroup = async () => {
    for (let i = 0; i < selectedActiveParticipants.length; i++) {
      const result = await ParticipantService.updateParticipantGroup(
        study!.identifier,
        token!,
        selectedActiveParticipants[i].id,
        ['test_user'],
      )
    }
  }*/

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
      setIsOpenDeleteDialog(false)
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
        clinicVisit: p.clinicVisit
          ? new Date(p.clinicVisit).toLocaleDateString()
          : '-',
        dateJoined: p.dateJoined
          ? new Date(p.dateJoined).toLocaleDateString()
          : '',
        notes: '',
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
        <Box px={3} py={2} display="flex">
          <MTBHeadingH3 className={classes.studyId}>
            {' '}
            Study ID: {study.identifier}{' '}
          </MTBHeadingH3>
          <LiveIcon />
        </Box>
        {/* <Button onClick={() => makeTestGroup()}>Make test group [test]</Button>*/}

        <Box px={3} py={2} position="relative">
          {!data?.items.length && (
            <HelpBox
              topOffset={40}
              leftOffset={160}
              arrowTailLength={150}
              helpTextTopOffset={40}
              helpTextLeftOffset={100}
              arrowRotate={45}
            >
              <div>
                Currently there are no participants enrolled in this study. To
                add participants, switch to Edit mode.
              </div>
            </HelpBox>
          )}

          {!data?.items.length &&
            !isUserSearchingForParticipant &&
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
                  You can upload a .csv or enter each participant credentials
                  one by one. When you are done, return to “View” mode to send
                  them an SMS link to download the app.
                </div>
              </HelpBox>
            )}
        </Box>

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
                      {`${tabDef.label} (${
                        tab === tabDef.type ? (data ? data.total : '...') : '0'
                      })`}
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
              isDrawerHidden={tab !== 'ACTIVE'}
              collapseButton={<CollapseIcon />}
              onToggleClick={(open: boolean) => setIsAddOpen(open)}
              expandButton={<ExpandIcon />}
              toggleButtonStyle={{
                display: 'block',
                padding: '0',
                backgroundColor: theme.palette.primary.dark,
                borderRadius: '0px',
              }}
            >
              <>
                <AddParticipants
                  study={study}
                  token={token!}
                  onAdded={() => {
                    setRefreshParticipantsToggle(prev => !prev)
                  }}
                ></AddParticipants>
              </>
              <div>
                <Box className={classes.gridToolBar}>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    {tab !== 'WITHDRAWN' && (
                      <Button
                        aria-label="delete"
                        onClick={() => {}}
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
                          setIsOpenDeleteDialog(true)
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
                  hidden={tab === 'WITHDRAWN'}
                  id={`active-participants`}
                  className={classes.tabPanel}
                  style={{ marginLeft: !isAddOpen ? '-48px' : '0' }}
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
                      notes: string,
                      clinicVisitDate?: Date,
                    ) =>
                      updateParticipant(participantId, notes, clinicVisitDate)
                    }
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    enrollmentType={study.clientData.enrollmentType!}
                    onRowSelected={(
                      /*id: string, isSelected: boolean*/ selection,
                      isAll,
                    ) => {
                      console.log('PMANAGER', selection, isAll)
                      /* if (tab === 'ACTIVE') {
                        setSelectedActiveParticipants(selection)
                      } else {
                        setSelectedWithdrawnParticipants(selection)
                      }*/
                      if (isAll !== undefined) {
                        setIsAllSelected(isAll)
                      }
                      setSelectedParticipantIds(prev => ({
                        ...prev,
                        [tab]: selection,
                      }))
                    }}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                  ></ParticipantTableGrid>
                </div>

                <div
                  role="tabpanel"
                  hidden={tab !== 'WITHDRAWN'}
                  id={`withdrawn-participants`}
                  className={classes.tabPanel}
                >
                  <span>Withdrawn participants will go here</span>
                </div>

                <div
                  role="tabpanel"
                  hidden={tab !== 'TEST'}
                  id={`test-accounts`}
                  className={classes.tabPanel}
                >
                  <span>Withdrawn participants will go here</span>
                </div>
              </div>

              <Box textAlign="center" pl={2}>
                ADD A PARTICIPANT
              </Box>
            </CollapsibleLayout>
          </Box>
        </Box>

        <Dialog
          open={isOpenDeleteDialog}
          maxWidth="xs"
          scroll="body"
          aria-labelledby="Remove Participant"
        >
          <DialogTitleWithClose
            onCancel={() => {
              setIsOpenDeleteDialog(false)
            }}
          >
            <>
              <DeleteIcon style={{ width: '25px' }}></DeleteIcon>
              <span style={{ paddingLeft: '8px' }}>Remove From Study</span>
            </>
          </DialogTitleWithClose>
          <DialogContent>
            {isOpenDeleteDialog && (
              <DeleteDialog
                participantsWithError={participantsWithError}
                study={study}
                selectedParticipants={
                  data?.items.filter(participant =>
                    selectedParticipantIds[tab].includes(participant.id),
                  ) || []
                }
                isProcessing={!!loadingIndicators.isDeleting}
              />
            )}
          </DialogContent>

          {participantsWithError.length === 0 && (
            <DialogActions>
              <DialogButtonSecondary
                onClick={() => setIsOpenDeleteDialog(false)}
              >
                Cancel
              </DialogButtonSecondary>

              <DialogButtonPrimary
                onClick={() => deleteSelectedParticipants()}
                autoFocus
              >
                Permanently Remove
              </DialogButtonPrimary>
            </DialogActions>
          )}

          {participantsWithError.length > 0 && (
            <DialogActions>
              <DialogButtonPrimary
                onClick={() => {
                  setRefreshParticipantsToggle(prev => !prev)
                  setIsOpenDeleteDialog(false)
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
