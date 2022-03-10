import {ReactComponent as PencilIcon} from '@assets/edit_pencil.svg'
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
import {useUserSessionDataState} from '@helpers/AuthContext'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Paper,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {
  DataGrid,
  GridCellParams,
  GridCellValue,
  GridColDef,
  GridColumnMenuContainer,
  GridColumnMenuProps,
  GridColumnsMenuItem,
  GridOverlay,
  //GridRowSelectedParams
  GridToolbarContainer,
  GridValueGetterParams,
  HideGridColMenuItem,
} from '@material-ui/data-grid'
import EventService from '@services/event.service'
import ParticipantService, {
  EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING,
} from '@services/participants.service'
import {latoFont} from '@style/theme'
import {
  EditableParticipantData,
  ParticipantAccountSummary,
  ParticipantActivityType,
  ParticipantEvent,
  RequestStatus,
  SelectionType,
} from '@typedefs/types'
//test GridRowSelectedParams
import _ from 'lodash'
import React, {FunctionComponent, ReactNode, SyntheticEvent} from 'react'
import Pluralize from 'react-pluralize'
import GridCellExpand from './GridCellExpand'

const useStyles = makeStyles(theme => ({
  root: {},
  gridHeader: {
    '& .MuiDataGrid-columnSeparator': {
      display: 'none',
    },
  },
  showEntryText: {
    fontFamily: latoFont,
    fontSize: '15px',
    marginRight: theme.spacing(1),
  },
  selectionDisplay: {
    fontFamily: latoFont,
    height: theme.spacing(3),
    textAlign: 'left',
    padding: theme.spacing(1.5, 0, 0, 2),
    fontWeight: 'bold',
    fontSize: '12px',
    fontStyle: 'italic',
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
      console.log('Error in  onClick', e.message)
    }
  }

  return params.formattedValue ? (
    <div style={{textAlign: 'center', width: '115px'}}>
      {!isHidden && params.formattedValue}
      <Button
        onClick={onClick}
        style={{minWidth: 'auto', margin: '0 auto', padding: '4px'}}>
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
  const onClick = async () => {
    try {
      const getValString = (column: string): string | undefined => {
        const result = params.getValue(params.id, column)?.toString()

        return result
      }

      const getValDate = (column: string): Date | undefined => {
        const result = params.getValue(params.id, column)?.toString()
        const d = result ? new Date(result) : undefined
        return d
      }

      const getValPhone = (column: string): string | undefined => {
        const result = params.getValue(params.id, column)?.toString()
        return result?.replace('+1', '') || ''
      }

      const getEvents = (column: string): ParticipantEvent[] => {
        const result = params.getValue(params.id, column)
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
        token!,
        getValString('id')!
      )

      const hasSignedIn = event.signedInOn !== undefined

      onSetParticipantToEdit({
        id: getValString('id')!,
        participant,
        hasSignedIn,
        shouldWithdraw: false,
      })
    } catch (e) {
      console.log('Error in  onClick', e.message)
    }
  }
  const isWithdrawn =
    params.row['externalId'] === EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING
  return !isWithdrawn ? (
    <IconButton
      onClick={(e: SyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      aria-label="edit participant"
      component="span">
      <PencilIcon />
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
  onSelectAllPage: Function
  onSelectAll: Function
  onDeselect: Function
  selectionType: any
}> = ({
  selectionModel,
  isAllSelected,
  totalParticipants,
  selectionType,
  onSelectAll,
  onSelectAllPage,
  onDeselect,
}) => {
  const classes = useStyles()

  return (
    <GridToolbarContainer>
      <div style={{position: 'relative'}}>
        <Box
          className={classes.selectionDisplay}
          style={{
            visibility: !selectionModel?.length ? 'hidden' : 'visible',
          }}>
          {`${isAllSelected ? 'All ' : ''}`}
          <Pluralize
            singular={'participant'}
            count={isAllSelected ? totalParticipants : selectionModel.length}
          />{' '}
          selected
        </Box>

        <div
          style={{
            position: 'absolute',
            zIndex: 11,
            top: 40,
            left: 0,
            backgroundColor: '#fff',
          }}>
          <SelectAll
            selectionType={selectionType}
            allText={`Select all ${totalParticipants}`}
            allPageText="Select this page"
            onSelectAllPage={onSelectAllPage}
            onDeselect={onDeselect}
            onSelectAll={onSelectAll}></SelectAll>
        </div>
      </div>
    </GridToolbarContainer>
  )
}

export function CustomColumnMenuComponent(
  props: GridColumnMenuProps & {color: string}
) {
  const classes = useStyles()
  const {hideMenu, currentColumn, color, ...other} = props
  // more info here: https://material-ui.com/components/data-grid/components/#components
  /*if (currentColumn.field === 'name') { }*/

  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      {...other}>
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
  return value ? new Date(value as string).toLocaleString() : undefined
}

function getJoinedDateWithIcons(params: GridValueGetterParams) {
  const joinedDate = params.row.joinedDate
  // const smsDate = params.row.smsDate

  const dateToDisplay = joinedDate //|| smsDate
  const formattedDate = getDate(dateToDisplay)
  const hasJoined = !!joinedDate
  return (
    <Box display="flex" flexDirection="row">
      {dateToDisplay && (
        <img
          src={hasJoined ? JoinedCheckSymbol : JoinedPhoneSymbol}
          style={{marginRight: '6px', width: '16px'}}></img>
      )}
      {formattedDate}
    </Box>
  )
}

function renderColumnHeaderWithIcon(icon: string, headerName: string) {
  return (
    <Box display="flex" flexDirection="row">
      <img src={icon} style={{marginRight: '6px', width: '16px'}}></img>
      {headerName}
    </Box>
  ) as ReactNode
}

function renderCellExpand(params: GridCellParams) {
  return (
    <GridCellExpand
      value={params.value ? params.value.toString() : ''}
      width={params.colDef.computedWidth}
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

      //disableClickEventBubbling: true,

      renderHeader: () => {
        return (
          <Box display="flex" flexDirection="row" alignItems="center">
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
        return (
          <PhoneCell
            params={params}
            hidePhone={isGloballyHidePhone}></PhoneCell>
        )
      },
    },
    {
      field: 'externalId',
      headerName: isEnrolledById
        ? 'Participant ID'
        : `${gridType === 'TEST' ? 'Log in' : 'Reference'} ID`,
      width: 125,
    },

    {
      field: 'healthCode',
      headerName: 'HealthCode',
      renderCell: renderCellExpand,
      flex: 2,
    },
    {
      field: 'clientTimeZone',
      headerName: 'Time Zone',
      align: 'center',
      valueGetter: params => params.value || '-',
      flex: 1,
    },
    {
      field: 'joinedDate',
      renderHeader: () =>
        renderColumnHeaderWithIcon(JoinedCheckSymbol, 'Joined'),
      renderCell: getJoinedDateWithIcons,
      flex: 1,
    },
    {field: 'note', headerName: 'Notes', flex: 2},
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
    headerName: 'Edit',
    // disableClickEventBubbling: true,
    disableColumnMenu: true,
    width: 70,

    renderCell: (params: GridCellParams) => (
      <EditCell
        params={params}
        studyId={studyId}
        token={token!}
        onSetParticipantToEdit={setParticipantToEdit}
      />
    ),
  }

  const customEventColumns = scheduleEventIds.map((eventId, index) => {
    const col: GridColDef = {
      field: eventId + index,
      headerName: EventService.formatCustomEventIdForDisplay(eventId),
      valueGetter: params => {
        const foundEvent = params.row.events.find(
          (event: any) =>
            event.eventId === EventService.prefixCustomEventIdentifier(eventId)
        )
        return foundEvent ? getDate(foundEvent.timestamp) : ' '
      },
      flex: 1,
    }
    return col
  })

  let participantColumns = [...COLUMNS]
  // for active participants -- don't need withdrawn date and note
  if (gridType === 'ACTIVE') {
    participantColumns = _.filter(
      participantColumns,
      c => !_.includes(['dateWithdrawn', 'withdrawalNote'], c.field)
    )
  }

  participantColumns.splice(1, 0, editColumn)

  //for withdrawn participants -- remove edit and note fileds
  if (gridType === 'WITHDRAWN') {
    participantColumns = _.filter(
      participantColumns,
      c => !_.includes(['note', 'edit'], c.field)
    )
  }
  if (gridType === 'TEST') {
    participantColumns = participantColumns.filter(
      el => el.headerName !== 'Phone Number'
    )
  }

  // if enrolled by ID -- dont' need phone
  if (isEnrolledById) {
    participantColumns = _.filter(
      participantColumns,
      c => !_.includes(['phone'], c.field)
    )
  }

  const eventInsertionIndex = participantColumns.findIndex(
    column => column.field === 'clientTimeZone'
  )
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
  onUpdateParticipant: (
    pId: string,
    note: string,
    customEvents: ParticipantEvent[],
    clientTimeZone?: string
  ) => void
  onWithdrawParticipant: (participantId: string, note: string) => void
  children: React.ReactNode //paging control
  status: RequestStatus
}

const ParticipantTableGrid: FunctionComponent<ParticipantTableGridProps> = ({
  rows,
  scheduleEventIds,
  studyId,
  totalParticipants,
  gridType,
  status,
  selectedParticipantIds,
  isEnrolledById,
  isAllSelected,
  onUpdateParticipant,
  onWithdrawParticipant,
  onRowSelected,
  children,
}: ParticipantTableGridProps) => {
  const classes = useStyles()
  const {token} = useUserSessionDataState()

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

  const [selectionModel, setSelectionModel] = React.useState<string[]>([
    ...selectedParticipantIds,
  ])
  const [isGloballyHidePhone, setIsGloballyHidePhone] = React.useState(true)

  const participantColumns = getColumns(
    studyId,
    token!,
    gridType,
    isEnrolledById,
    scheduleEventIds,
    setParticipantToEdit,
    isGloballyHidePhone,
    setIsGloballyHidePhone
  )

  participantColumns.forEach(c => {
    c.sortable = false
    c.filterable = false
  })

  React.useEffect(() => {
    setSelectionModel([
      ...selectedParticipantIds.filter(id => rows.find(row => row.id === id)),
    ])
  }, [selectedParticipantIds, rows])

  const allSelectedPage = () =>
    rows && !rows.find(row => !selectionModel.includes(row.id))

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

  return (
    <>
      <Paper elevation={0}>
        <div style={{display: 'flex', height: '90vh'}}>
          <div style={{flexGrow: 1}}>
            <DataGrid
              rows={rows}
              classes={{columnHeader: classes.gridHeader}}
              density="standard"
              columns={participantColumns}
              checkboxSelection
              onRowSelected={(row: GridRowSelectedParams) => {
                let model: string[] = []
                if (!selectionModel.includes(row.data.id)) {
                  model = [...selectionModel, row.data.id]
                } else {
                  model = selectionModel.filter(id => id != row.data.id)
                }

                onRowSelected(model, false)
              }}
              selectionModel={selectionModel}
              components={{
                ColumnMenu: CustomColumnMenuComponent,

                Toolbar: () => (
                  <SelectionControl
                    selectionModel={selectionModel}
                    isAllSelected={isAllSelected}
                    totalParticipants={totalParticipants}
                    selectionType={getSelectionType()}
                    onSelectAllPage={() => {
                      const ids = rows.map(row => row.id)
                      onRowSelected(_.uniq([...selectionModel, ...ids]), false)
                    }}
                    onDeselect={() => onRowSelected([], false)}
                    onSelectAll={() => {
                      const ids = rows.map(row => row.id)
                      onRowSelected(ids, true)
                    }}
                  />
                ),

                Footer: () => <>{children}</>,
                NoRowsOverlay: () => (
                  <GridOverlay>
                    {status === 'PENDING' ? (
                      <CircularProgress id="circular_progress"></CircularProgress>
                    ) : (
                      <Box bgcolor="white" height="100%" width="100%"></Box>
                    )}
                  </GridOverlay>
                ),
              }}
            />
          </div>
        </div>
      </Paper>
      <Dialog
        open={participantToEdit !== undefined}
        maxWidth="sm"
        fullWidth
        aria-labelledby="edit participant">
        <EditDialogTitle
          onCancel={() => setParticipantToEdit(undefined)}
          shouldWithdraw={participantToEdit?.shouldWithdraw}
        />

        <HideWhen hideWhen={participantToEdit?.shouldWithdraw || false}>
          <EditParticipantForm
            scheduleEventIds={scheduleEventIds}
            isEnrolledById={isEnrolledById}
            onCancel={() => setParticipantToEdit(undefined)}
            onOK={(
              note: string,
              clientTimeZone?: string,
              customEvents?: ParticipantEvent[]
            ) => {
              onUpdateParticipant(
                participantToEdit?.id!,
                note,
                customEvents || [],
                clientTimeZone
              )
              setParticipantToEdit(undefined)
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
            onOK={(note: string) => {
              onWithdrawParticipant(participantToEdit?.id!, note)
              setParticipantToEdit(undefined)
            }}
            participant={
              participantToEdit?.participant || {}
            }></WithdrawParticipantForm>
        </HideWhen>
      </Dialog>
    </>
  )
}

export default ParticipantTableGrid
