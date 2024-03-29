import JoinedCheckSymbol from '@assets/participants/joined_check_mark.svg'
import JoinedPhoneSymbol from '@assets/participants/joined_phone_icon.svg'
import {ReactComponent as HidePhoneIcon} from '@assets/participants/phone_hide_icon.svg'
import {ReactComponent as ShowPhoneIcon} from '@assets/participants/phone_show_icon.svg'
import {ReactComponent as WithdrawIcon} from '@assets/withdraw.svg'
import EditDialogTitle from '@components/studies/participants/modify/EditDialogTitle'
import EditParticipantForm from '@components/studies/participants/modify/EditParticipantForm'
import WithdrawParticipantForm from '@components/studies/participants/modify/WithdrawParticipantForm'
import HideWhen from '@components/widgets/HideWhen'
import SelectAll from '@components/widgets/SelectAll'
import {StyledLink} from '@components/widgets/StyledComponents'
import {useUserSessionDataState} from '@helpers/AuthContext'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import {Box, Button, Checkbox, CircularProgress, Dialog, IconButton, Paper, styled} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {
  DataGrid,
  GridCellParams,
  GridCellValue,
  gridClasses,
  GridColDef,
  GridColumnMenuContainer,
  GridColumnMenuProps,
  GridColumnsMenuItem,
  GridOverlay,
  GridRowParams,
  // GridRowSelectedParams,
  GridToolbarContainer,
  GridValueGetterParams,
  HideGridColMenuItem,
} from '@mui/x-data-grid'
import EventService, {JOINED_EVENT_ID} from '@services/event.service'
import {useEvents} from '@services/eventHooks'
import {useUpdateParticipantInList} from '@services/participantHooks'
import ParticipantService, {EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING} from '@services/participants.service'
import {latoFont} from '@style/theme'
import {
  EditableParticipantData,
  ParticipantAccountSummary,
  ParticipantActivityType,
  ParticipantEvent,
  SelectionType,
} from '@typedefs/types'
import dayjs from 'dayjs'
import _ from 'lodash'
import React, {FunctionComponent, ReactNode, SyntheticEvent} from 'react'
import Pluralize from 'react-pluralize'
import {Link} from 'react-router-dom'
import GridCellExpand from './GridCellExpand'

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
  border: 0,
  color: '#353A3F',
  [`& .${gridClasses.row}:nth-child(odd)`]: {
    backgroundColor: '#fff',
    borderBottom: `1px solid #EAECEE`,
  },
  [`& .${gridClasses.row}:nth-child(even)`]: {
    backgroundColor: '#FBFBFC',
    borderBottom: `1px solid #EAECEE`,
  },

  [`& .${gridClasses.columnHeaders}`]: {
    backgroundColor: '#F1F3F5',
    fontWeight: 700,
  },

  [`& .${gridClasses.columnHeader},  .${gridClasses.cell}`]: {
    minHeight: '60px',
    borderColor: '#EAECEE',
    borderBottom: `1px solid #EAECEE`,
    fontSize: '12px',
    outline: 'none !important',
    '&:last-of-type': {
      borderRight: 'none',
    },
  },
}))

const StyledSelectionDisplay = styled(Box, {label: 'selectionDisplay'})(({theme}) => ({
  fontFamily: latoFont,
  height: theme.spacing(3),
  textAlign: 'left',
  padding: theme.spacing(0, 0, 0, 2),
  fontWeight: 'bold',
  fontSize: '12px',
  fontStyle: 'italic',
  position: 'relative',
}))

const useStyles = makeStyles(theme => ({
  root: {},
  gridHeaderTitle: {
    fontWeight: 700,
  },
  gridHeader: {
    fontWeight: 700,
    '& .MuiDataGrid-columnSeparator': {
      display: 'none',
    },
  },
  showEntryText: {
    fontFamily: latoFont,
    fontSize: '15px',
    marginRight: theme.spacing(1),
  },
}))

/**********************************************   SUBCOMPONENTS ****************************************************/

//---------------------- cell for displaying phone
const PhoneCell: FunctionComponent<{
  params: GridCellParams
  hidePhone: boolean
}> = ({params, hidePhone}) => {
  const [isHidden, setIsHidden] = React.useState(hidePhone)
  React.useEffect(() => {
    setIsHidden(hidePhone)
  }, [hidePhone])
  const onClick = async () => {
    setIsHidden(prev => !prev)

    try {
    } catch (e) {
      console.log('Error in  onClick', (e as Error).message)
    }
  }

  return params.formattedValue ? (
    <div style={{textAlign: 'left', width: '115px'}}>
      {!isHidden && params.formattedValue}
      <Button onClick={onClick} style={{minWidth: 'auto', margin: '0 auto', padding: '4px'}}>
        {isHidden ? <ShowPhoneIcon /> : <HidePhoneIcon />}
      </Button>
    </div>
  ) : (
    <></>
  )
}

//---------------------- cell for editing participant

const EditCell: FunctionComponent<{
  params: GridCellParams
  studyId: string
  token: string
  onSetParticipantToEdit: Function
}> = ({params, studyId, token, onSetParticipantToEdit}) => {
  const onClick = async (e: SyntheticEvent) => {
    try {
      e.preventDefault()
      e.stopPropagation()
      const getValString = (column: string): string | undefined => {
        const result = params.row[column]

        return result
      }

      const getValPhone = (column: string): string | undefined => {
        const result = params.row[column]?.toString()
        return result?.replace('+1', '') || ''
      }

      const getEvents = (column: string): ParticipantEvent[] => {
        const result = params.row[column]
        return result as ParticipantEvent[]
      }

      const participant: EditableParticipantData = {
        events: getEvents('events'),
        note: getValString('note'),
        externalId: getValString('externalId'),
        phoneNumber: getValPhone('phone'),
        clientTimeZone: getValString('clientTimeZone'),
      }

      const event = await ParticipantService.getRequestInfoForParticipant(
        studyId,

        getValString('id')!,
        token!
      )

      const hasSignedIn = event.signedInOn !== undefined

      onSetParticipantToEdit({
        id: getValString('id')!,
        participant,
        hasSignedIn,
        shouldWithdraw: false,
      })
    } catch (e) {
      console.log('Error in  onClick!', (e as Error).message)
      throw e
    }
  }
  const isWithdrawn = params.row['externalId'] === EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING
  return !isWithdrawn ? (
    <IconButton onClick={onClick} aria-label="edit participant" component="span" size="large">
      <EditTwoToneIcon />
    </IconButton>
  ) : (
    <></>
  )
}

//---------------------- selection control

const SelectionControl: FunctionComponent<{
  selectionModel: string[]
  isAllSelected: boolean
  totalParticipants: number
}> = ({selectionModel, isAllSelected, totalParticipants}) => {
  const classes = useStyles()

  return (
    <GridToolbarContainer>
      <StyledSelectionDisplay sx={{display: !selectionModel?.length ? 'none' : 'block'}}>
        {`${isAllSelected ? 'All ' : ''}`}
        <Pluralize singular={'participant'} count={isAllSelected ? totalParticipants : selectionModel.length} />{' '}
        selected
      </StyledSelectionDisplay>
    </GridToolbarContainer>
  )
}

export function CustomColumnMenuComponent(props: GridColumnMenuProps & {color: string}) {
  const {hideMenu, currentColumn, color, ...other} = props
  // more info here: https://material-ui.com/components/data-grid/components/#components
  /*if (currentColumn.field === 'name') { }*/

  return (
    <GridColumnMenuContainer hideMenu={hideMenu} currentColumn={currentColumn} {...other}>
      <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
      <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />
    </GridColumnMenuContainer>
  )
}

function getPhone(params: GridValueGetterParams) {
  if (params.value) {
    return (params.value as {nationalFormat: string}).nationalFormat
  } else return ''
}
function getDate(value: GridCellValue) {
  return value && dayjs(value.toString()).isValid() ? dayjs(value.toString()).format('MM/DD/YYYY') : undefined
}

function getJoinedDateWithIcons(params: GridValueGetterParams) {
  // const joinedDate = params.row.joinedDate
  // const smsDate = params.row.smsDate
  const foundEvent = params.row.events.find((event: any) => event.eventId === JOINED_EVENT_ID)
  const joinedDate = foundEvent ? getDate(foundEvent.timestamp) : undefined

  const dateToDisplay = joinedDate //|| smsDate
  const formattedDate = getDate(dateToDisplay)
  const hasJoined = !!joinedDate
  return (
    <Box display="flex" flexDirection="row">
      {dateToDisplay && (
        <img
          src={hasJoined ? JoinedCheckSymbol : JoinedPhoneSymbol}
          style={{marginRight: '6px', width: '16px'}}
          alt={hasJoined ? 'joined' : 'not joined'}></img>
      )}
      {formattedDate}
    </Box>
  )
}

function renderColumnHeaderWithIcon(icon: string, headerName: string) {
  return (
    <Box display="flex" flexDirection="row">
      <img src={icon} style={{marginRight: '6px', width: '16px'}} alt={headerName}></img>
      {headerName}
    </Box>
  ) as ReactNode
}

function renderCellExpand(params: GridCellParams, width: number) {
  return (
    <GridCellExpand
      value={params.value ? params.value.toString() : ''}
      width={Math.max(params.colDef.computedWidth, width)}
    />
  )
}

/*************** COLUMNS    ****** */

function getColumns(
  studyId: string,
  token: string,
  gridType: ParticipantActivityType,
  isEnrolledById: boolean,
  scheduleEventIds: string[],
  setParticipantToEdit: Function,
  isGloballyHidePhone: boolean,
  setIsGloballyHidePhone: Function
) {
  const COLUMNS: GridColDef[] = [
    {
      field: 'phone',
      headerName: 'Phone Number',
      // flex: 1.5,
      valueGetter: getPhone,
      width: 152,

      //AGv5 disableClickEventBubbling: true,

      renderHeader: () => {
        return (
          <Box display="flex" flexDirection="row" alignItems="left">
            Phone Number
            <Button
              onClick={() => setIsGloballyHidePhone(!isGloballyHidePhone)}
              style={{
                minWidth: 'auto',
                margin: '0 auto 0 3px',
                padding: '4px',
                height: '20px',
              }}>
              {isGloballyHidePhone ? <ShowPhoneIcon /> : <HidePhoneIcon />}
            </Button>
          </Box>
        ) as ReactNode
      },

      renderCell: (params: GridCellParams) => {
        return <PhoneCell params={params} hidePhone={isGloballyHidePhone}></PhoneCell>
      },
    },
    {
      field: 'externalId',
      headerName: isEnrolledById ? 'Participant ID' : `${gridType === 'TEST' ? 'Log in' : 'Reference'} ID`,
      renderCell: params => <StyledLink to={`adherence/${params.row['id']}`}>{params.value}</StyledLink>,
      width: 125,
    },

    {
      field: 'healthCode',
      headerName: 'Health Code',
      renderCell: params => renderCellExpand(params, 190),
      width: 130,
    },
    {
      field: 'clientTimeZone',
      headerName: 'Time Zone',
      align: 'left',
      valueGetter: params => params.value || '-',
      width: 150,
    },
    {
      field: 'joinedDate',
      renderHeader: () => renderColumnHeaderWithIcon(JoinedCheckSymbol, 'Joined'),
      renderCell: getJoinedDateWithIcons,
      width: 110,
    },
    {field: 'note', headerName: 'Notes', width: 200},
    {
      field: 'dateWithdrawn',
      headerName: 'Withdrawn',
      valueGetter: params => getDate(params.value) || '-',
      flex: 1,
    },
    {
      field: 'withdrawalNote',
      headerName: 'Withdrawal note',
      flex: 2,
    },
  ]

  const editColumn: GridColDef = {
    field: 'edit',
    headerName: ' ',
    //AGv5  disableClickEventBubbling: true,
    disableColumnMenu: true,
    width: 60,

    renderCell: (params: GridCellParams) => (
      <EditCell params={params} studyId={studyId} token={token!} onSetParticipantToEdit={setParticipantToEdit} />
    ),
  }

  //not a burst custom event and has bursts
  const getEventHeader = (scheduleEventIds: string[], eventId: string) => {
    const formattedEventId = EventService.formatEventIdForDisplay(eventId)
    const isBurstEvent = EventService.isEventBurstEvent(eventId)
    const hasConnectedBursts =
      scheduleEventIds.find(e => e.includes(`study_burst:custom_${formattedEventId}_burst:`)) !== undefined

    const sourceOfBurstEvents = !isBurstEvent && hasConnectedBursts

    return sourceOfBurstEvents ? `${formattedEventId}/Burst 1` : formattedEventId
  }

  const shouldShowEvent = (eventId: string) => {
    const isBurstEvent = EventService.isEventBurstEvent(eventId)
    const isLoginEvent = eventId === JOINED_EVENT_ID
    const isFirstBurst = EventService.getBurstNumberFromEventId(eventId) === 1
    return !isLoginEvent && (!isBurstEvent || !isFirstBurst)
  }

  const customEventColumns = scheduleEventIds
    //filter out joined event. As well as: if there is a custom event that has a burst
    // if there are burst events -- hide 1st burst
    .filter(eventId => shouldShowEvent(eventId))
    .map((eventId, index) => {
      const col: GridColDef = {
        field: eventId + index,
        width: 100,

        headerName: getEventHeader(scheduleEventIds, eventId), //+
        valueGetter: params => {
          const foundEvent = params.row.events.find(
            (event: any) => event.eventId === EventService.prefixCustomEventIdentifier(eventId)
          )
          return foundEvent ? getDate(foundEvent.timestamp) : ' '
        },
        // flex: 1,
      }
      return col
    })

  let participantColumns = [...COLUMNS]
  // for active participants -- don't need withdrawn date and note
  if (gridType === 'ACTIVE') {
    participantColumns = _.filter(participantColumns, c => !_.includes(['dateWithdrawn', 'withdrawalNote'], c.field))
  }

  participantColumns.splice(1, 0, editColumn)

  //for withdrawn participants -- remove edit and note fileds
  if (gridType === 'WITHDRAWN') {
    participantColumns = _.filter(participantColumns, c => !_.includes(['note', 'edit'], c.field))
  }
  if (gridType === 'TEST') {
    participantColumns = participantColumns.filter(el => el.headerName !== 'Phone Number')
  }

  // if enrolled by ID -- dont' need phone
  if (isEnrolledById) {
    participantColumns = _.filter(participantColumns, c => !_.includes(['phone'], c.field))
  }

  // if no custom event / burst -- remove time zone column
  if (scheduleEventIds.length === 1) {
    participantColumns = participantColumns.filter(el => el.headerName !== 'Time Zone')
  }

  const eventInsertionIndex = participantColumns.findIndex(column => column.field === 'clientTimeZone')
  participantColumns.splice(eventInsertionIndex, 0, ...customEventColumns)
  //participantColumns = [...participantColumns, ...customEventColumns]
  return participantColumns
}

/************************** */

export type ParticipantTableGridProps = {
  scheduleEventIds: string[]
  isAllSelected: boolean
  rows: ParticipantAccountSummary[]
  selectedParticipantIds: string[]
  isEnrolledById: boolean
  gridType: ParticipantActivityType
  studyId: string
  totalParticipants: number
  onRowSelected: (participantIds: string[], isAll?: boolean) => void
  children: React.ReactNode //paging control
  status: 'loading' | 'success' | 'error' | 'idle'
}

const ParticipantTableGrid: FunctionComponent<ParticipantTableGridProps> = ({
  rows,
  studyId,
  totalParticipants,
  gridType,
  status,
  selectedParticipantIds,
  isEnrolledById,
  isAllSelected,
  onRowSelected,
  children,
}: ParticipantTableGridProps) => {
  const classes = useStyles()
  const {token} = useUserSessionDataState()
  const {data: scheduleEvents = []} = useEvents(studyId)

  const {isLoading: isParticipantUpdating, mutate} = useUpdateParticipantInList()

  //when we are editing the record this is where the info is stored
  const [participantToEdit, setParticipantToEdit] = React.useState<
    | {
        id: string
        participant: EditableParticipantData
        hasSignedIn: boolean
        shouldWithdraw: boolean
      }
    | undefined
  >(undefined)

  const [selectionModel, setSelectionModel] = React.useState<string[]>([...selectedParticipantIds])
  const [isGloballyHidePhone, setIsGloballyHidePhone] = React.useState(true)
  const [error, setError] = React.useState<Error>()

  const participantColumns = getColumns(
    studyId,
    token!,
    gridType,
    isEnrolledById,
    scheduleEvents.map(e => e.eventId),
    setParticipantToEdit,
    isGloballyHidePhone,
    setIsGloballyHidePhone
  )

  participantColumns.forEach(c => {
    c.sortable = false
    c.filterable = false
  })

  React.useEffect(() => {
    setSelectionModel([...selectedParticipantIds.filter(id => rows.find(row => row.id === id))])
  }, [selectedParticipantIds, rows])

  const allSelectedPage = () => rows && !rows.find(row => !selectionModel.includes(row.id))

  const getSelectionType = (): SelectionType => {
    if (isAllSelected) {
      return 'ALL'
    }
    if (allSelectedPage()) {
      return 'PAGE'
    }
    if (selectionModel.length) {
      return 'SOME'
    }
    return 'NONE'
  }

  const withdrawParticipant = (id: string, note: string) => {
    setError(undefined)
    mutate(
      {
        action: 'WITHDRAW',
        studyId: studyId,
        userId: [id],
        note,
      },
      {
        onSuccess: () => {
          setParticipantToEdit(undefined)
        },
        onError: (e: any) => {
          setError(e as Error)
          console.log(e.message)
        },
      }
    )
  }

  const updateParticiant = (note: string, clientTimeZone?: string, customEvents?: ParticipantEvent[]) => {
    setError(undefined)
    const changedEvents = customEvents?.filter(ue => {
      let prevEvents = participantToEdit!.participant.events || []
      const updatedEvent = prevEvents.find(e => e.eventId === ue.eventId && e.timestamp !== ue.timestamp)
      const existingEvent = prevEvents.find(e => e.eventId === ue.eventId)
      return updatedEvent || !existingEvent
    })

    mutate(
      {
        action: 'UPDATE',
        studyId: studyId,
        userId: [participantToEdit!.id!],
        updatedFields: {
          note: note,
          clientTimeZone: clientTimeZone,
        },
        customEvents: changedEvents || [],
      },
      {
        onSuccess: () => {
          setParticipantToEdit(undefined)
        },
        onError: (e: any) => {
          setError(e as Error)
          console.log(e.message)
        },
      }
    )
  }

  const checkBoxSelectColumn: GridColDef = {
    field: 'selectCheckboxColumn',

    //AGv5 disableClickEventBubbling: true,
    disableColumnMenu: true,
    sortable: false,
    width: 70,
    align: 'left',
    renderHeader: () => {
      return (
        <div>
          <SelectAll
            selectionType={getSelectionType()}
            allText={`Select all ${totalParticipants}`}
            allPageText="Select this page"
            onSelectAllPage={() => {
              const ids = rows.map(row => row.id)
              onRowSelected(_.uniq([...selectionModel, ...ids]), false)
            }}
            onDeselect={() => onRowSelected([], false)}
            onSelectAll={() => {
              const ids = rows.map(row => row.id)
              onRowSelected(ids, true)
            }}></SelectAll>
        </div>
      )
    },

    renderCell: (params: GridCellParams) => {
      const id = params.row['id']

      return (
        <div>
          <Checkbox
            name="selectAllCheckbox"
            checked={selectionModel.includes(id)}
            onChange={e => {
              let model: string[] = []
              if (e.target.checked) {
                model = [...selectionModel, id]
              } else {
                model = selectionModel.filter(mid => mid !== id)
              }

              onRowSelected(model, false)
            }}
          />
        </div>
      )
    },
  }

  participantColumns.unshift(checkBoxSelectColumn)

  return (
    <>
      <Paper elevation={0} sx={{fontSize: '14px'}}>
        <div style={{display: 'flex', height: '90vh'}}>
          <div style={{flexGrow: 1}}>
            <StyledDataGrid
              rows={rows}
              showColumnRightBorder={true}
              showCellRightBorder={true}
              sx={{fontSize: '14px', borderBottom: '1px solid #EAECEE'}}
              loading={isParticipantUpdating}
              classes={{columnHeader: classes.gridHeader, columnHeaderTitle: classes.gridHeaderTitle}}
              density="standard"
              columns={participantColumns}
              checkboxSelection={false}
              onRowClick={(params: GridRowParams) => {
                let model: string[] = []
                if (!selectionModel.includes(params.row.id)) {
                  model = [...selectionModel, params.row.id]
                } else {
                  model = selectionModel.filter(id => id !== params.row.id)
                }

                onRowSelected(model, false)
              }}
              selectionModel={selectionModel}
              components={{
                ColumnMenu: CustomColumnMenuComponent,

                Toolbar: () => (
                  <>
                    <SelectionControl
                      selectionModel={selectionModel}
                      isAllSelected={isAllSelected}
                      totalParticipants={totalParticipants}
                    />
                  </>
                ),

                Footer: () => <>{children}</>,
                NoRowsOverlay: () => (
                  <GridOverlay>
                    {status === 'loading' ? (
                      <CircularProgress id="circular_progress"></CircularProgress>
                    ) : (
                      <Box bgcolor="white" height="100%" width="100%"></Box>
                    )}
                  </GridOverlay>
                ),
                LoadingOverlay: () => (
                  <GridOverlay>
                    <CircularProgress id="circular_progress" />
                  </GridOverlay>
                ),
              }}
            />
          </div>
        </div>
      </Paper>
      <Dialog
        open={participantToEdit !== undefined}
        maxWidth="md"
        scroll="body"
        fullWidth
        aria-labelledby="edit participant">
        <EditDialogTitle
          onCancel={() => {
            setParticipantToEdit(undefined)
            setError(undefined)
          }}
          shouldWithdraw={participantToEdit?.shouldWithdraw}
        />

        <HideWhen hideWhen={participantToEdit?.shouldWithdraw || false}>
          <EditParticipantForm
            isLoading={isParticipantUpdating}
            scheduleEvents={scheduleEvents}
            isEnrolledById={isEnrolledById}
            onError={error}
            onCancel={() => setParticipantToEdit(undefined)}
            onOK={(note: string, clientTimeZone?: string, customEvents?: ParticipantEvent[]) => {
              updateParticiant(note, clientTimeZone, customEvents)
            }}
            participant={participantToEdit?.participant || {}}>
            <Button
              onClick={() =>
                setParticipantToEdit(prev => ({
                  ...prev!,
                  shouldWithdraw: true,
                }))
              }
              color="secondary">
              <WithdrawIcon />
              &nbsp; Withdraw from study
            </Button>
          </EditParticipantForm>
          <WithdrawParticipantForm
            isEnrolledById={isEnrolledById}
            onCancel={() => setParticipantToEdit(undefined)}
            onOK={(note: string) => withdrawParticipant(participantToEdit?.id!, note)}
            participant={participantToEdit?.participant || {}}
            onError={error}
            onHandleError={setError}></WithdrawParticipantForm>
        </HideWhen>
      </Dialog>
    </>
  )
}

export default ParticipantTableGrid
