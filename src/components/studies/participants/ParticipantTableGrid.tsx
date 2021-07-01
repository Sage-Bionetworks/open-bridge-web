import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Paper,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  DataGrid,
  GridCellParams,
  GridCellValue,
  GridColDef,
  GridColumnMenuContainer,
  GridColumnMenuProps,
  GridColumnsMenuItem,
  GridOverlay,
  GridRowSelectedParams,
  GridToolbarContainer,
  GridValueGetterParams,
  HideGridColMenuItem,
} from '@material-ui/data-grid'
import _ from 'lodash'
import React, { FunctionComponent, ReactNode } from 'react'
import Pluralize from 'react-pluralize'
import { ReactComponent as PencilIcon } from '../../../assets/edit_pencil.svg'
import JoinedCheckSymbol from '../../../assets/participants/joined_check_mark.svg'
import JoinedPhoneSymbol from '../../../assets/participants/joined_phone_icon.svg'
import { ReactComponent as HidePhoneIcon } from '../../../assets/participants/phone_hide_icon.svg'
import { ReactComponent as ShowPhoneIcon } from '../../../assets/participants/phone_show_icon.svg'
import { ReactComponent as WithdrawIcon } from '../../../assets/withdraw.svg'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import ParticipantService, {
  EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING,
} from '../../../services/participants.service'
import { latoFont } from '../../../style/theme'
import {
  EditableParticipantData,
  ParticipantAccountSummary,
  ParticipantActivityType,
  RequestStatus,
} from '../../../types/types'
import DialogTitleWithClose from '../../widgets/DialogTitleWithClose'
import HideWhen from '../../widgets/HideWhen'
import SelectAll, { SelectionType } from '../../widgets/SelectAll'
import {
  EditParticipantForm,
  WithdrawParticipantForm,
} from './ParticipantForms'

const useStyles = makeStyles(theme => ({
  root: {},
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
const PhoneCell: FunctionComponent<{ params: GridCellParams }> = ({
  params,
}) => {
  const [isHidden, setIsHidden] = React.useState(true)
  const getValPhone = (column: string): string | undefined => {
    const result = params.getValue(params.id, column)?.toString()
    return result?.replace('+1', '') || ''
  }
  const onClick = async () => {
    setIsHidden(prev => !prev)

    try {
    } catch (e) {
      console.log('Error in  onClick', e.message)
    }
  }

  return params.formattedValue ? (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {!isHidden && params.formattedValue}
      <Button onClick={onClick} style={{ minWidth: 'auto', margin: '0 auto' }}>
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
}> = ({ params, studyId, token, onSetParticipantToEdit }) => {
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

      const participant: EditableParticipantData = {
        clinicVisitDate: getValDate('clinicVisitDate'),
        note: getValString('note'),
        externalId: getValString('externalId'),
        phoneNumber: getValPhone('phone'),
      }

      const event = await ParticipantService.getRequestInfoForParticipant(
        studyId,
        token!,
        getValString('id')!,
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
      onClick={onClick}
      aria-label="edit participant"
      component="span"
    >
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
      <div style={{ position: 'relative' }}>
        <Box
          className={classes.selectionDisplay}
          style={{
            visibility: !selectionModel?.length ? 'hidden' : 'visible',
          }}
        >
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
          }}
        >
          <SelectAll
            selectionType={selectionType}
            allText={`Select all ${totalParticipants}`}
            allPageText="Select this page"
            onSelectAllPage={onSelectAllPage}
            onDeselect={onDeselect}
            onSelectAll={onSelectAll}
          ></SelectAll>
        </div>
      </div>
    </GridToolbarContainer>
  )
}

export function CustomColumnMenuComponent(
  props: GridColumnMenuProps & { color: string },
) {
  const classes = useStyles()
  const { hideMenu, currentColumn, color, ...other } = props
  // more info here: https://material-ui.com/components/data-grid/components/#components
  /*if (currentColumn.field === 'name') { }*/

  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      {...other}
    >
      <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
      <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />
    </GridColumnMenuContainer>
  )
}

function getPhone(params: GridValueGetterParams) {
  if (params.value) {
    return (params.value as { nationalFormat: string }).nationalFormat
  } else return ''
}
function getDate(value: GridCellValue) {
  return value ? new Date(value as string).toLocaleDateString() : undefined
}

function getJoinedDateWithIcons(params: GridValueGetterParams) {
  const joinedDate = params.row.joinedDate
  const smsDate = params.row.smsDate

  const dateToDisplay = joinedDate || smsDate
  const formattedDate = getDate(dateToDisplay)
  const hasJoined = !!joinedDate
  return (
    <Box display="flex" flexDirection="row">
      {dateToDisplay && (
        <img
          src={hasJoined ? JoinedCheckSymbol : JoinedPhoneSymbol}
          style={{ marginRight: '6px', width: '16px' }}
        ></img>
      )}
      {formattedDate}
    </Box>
  )
}

function renderColumnHeader(icon: string, headerName: string) {
  return (
    <Box display="flex" flexDirection="row">
      <img src={icon} style={{ marginRight: '6px', width: '16px' }}></img>
      {headerName}
    </Box>
  ) as ReactNode
}

const ACTIVE_PARTICIPANT_COLUMNS: GridColDef[] = [
  {
    field: 'externalId',
    headerName: 'Participant ID',
    flex: 2,
  },
  { field: 'id', headerName: 'HealthCode', flex: 2 },
  {
    field: 'clinicVisitDate',
    headerName: 'Clinic Visit',
    valueGetter: params => getDate(params.value) || ' ',
    flex: 1,
  },
  {
    field: 'joinedDate',
    renderHeader: () => renderColumnHeader(JoinedCheckSymbol, 'Joined'),
    renderCell: getJoinedDateWithIcons,
    flex: 1,
  },
  { field: 'note', headerName: 'Notes', flex: 1 },
]

const WITHDRAWN_PARTICIPANT_COLUMNS: GridColDef[] = [
  {
    field: 'externalId',
    headerName: 'Participant ID',
    flex: 2,
  },
  { field: 'id', headerName: 'HealthCode', flex: 2 },
  {
    field: 'clinicVisitDate',
    headerName: 'Clinic Visit',
    valueGetter: params => getDate(params.value) || ' ',
    flex: 1,
  },
  {
    field: 'joinedDate',
    renderHeader: () => renderColumnHeader(JoinedCheckSymbol, 'Joined'),
    renderCell: getJoinedDateWithIcons,
    flex: 1,
  },
  {
    field: 'dateWithdrawn',
    headerName: 'Withdrawn',
    valueGetter: params => getDate(params.value) || '-',
    flex: 1,
  },
  { field: 'withdrawalNote', headerName: 'Withdrawal note', flex: 1 },
]

const phoneColumn: GridColDef = {
  field: 'phone',
  headerName: 'Phone Number',
  flex: 1,
  valueGetter: getPhone,

  disableClickEventBubbling: true,

  renderCell: (params: GridCellParams) => {
    return <PhoneCell params={params}></PhoneCell>
  },
}

export const EditDialogTitle: FunctionComponent<{
  onCancel: Function
  shouldWithdraw?: boolean
  batchEdit?: boolean
}> = ({ onCancel, shouldWithdraw, batchEdit }) => {
  const title = shouldWithdraw
    ? 'Withdraw'
    : !batchEdit
    ? 'Edit Participant Detail'
    : 'Batch Edit Multiple Participant Details '
  const Icon = shouldWithdraw ? WithdrawIcon : PencilIcon

  return (
    <DialogTitleWithClose onCancel={onCancel}>
      <>
        <Icon style={{ width: '25px' }}></Icon>
        <span style={{ paddingLeft: '8px' }}>{title}</span>
      </>
    </DialogTitleWithClose>
  )
}

export type ParticipantTableGridProps = {
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
    clinicVisitDate?: Date,
  ) => void
  onWithdrawParticipant: (participantId: string, note: string) => void
  children: React.ReactNode //paging control
  status: RequestStatus
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
  onUpdateParticipant,
  onWithdrawParticipant,
  onRowSelected,
  children,
}: ParticipantTableGridProps) => {
  const classes = useStyles()
  const { token } = useUserSessionDataState()

  //when we are editing the record this is where the info is stored
  const [participantToEdit, setParticipantToEdit] =
    React.useState<
      | {
          id: string
          participant: EditableParticipantData
          hasSignedIn: boolean
          shouldWithdraw: boolean
        }
      | undefined
    >(undefined)

  const editColumn = {
    field: 'edit',
    headerName: 'Action',
    disableClickEventBubbling: true,

    renderCell: (params: GridCellParams) => (
      <EditCell
        params={params}
        studyId={studyId}
        token={token!}
        onSetParticipantToEdit={setParticipantToEdit}
      />
    ),
  }

  const participantColumns =
    gridType === 'ACTIVE'
      ? [...ACTIVE_PARTICIPANT_COLUMNS]
      : [...WITHDRAWN_PARTICIPANT_COLUMNS]

  if (!isEnrolledById) {
    if (!participantColumns.find(col => col.field === 'phone'))
      participantColumns.splice(2, 0, phoneColumn)
  }
  if (gridType !== 'WITHDRAWN') {
    if (!participantColumns.find(col => col.field === 'edit')) {
      participantColumns.push(editColumn)
    }
  }

  participantColumns.forEach(c => {
    c.sortable = false
    c.filterable = false
  })

  const [selectionModel, setSelectionModel] = React.useState<string[]>([
    ...selectedParticipantIds,
  ])
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
        <div style={{ display: 'flex', height: '90vh' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              rows={rows}
              density="standard"
              columns={participantColumns}
              checkboxSelection
              onRowSelected={(row: GridRowSelectedParams) => {
                let model: string[] = []
                if (row.isSelected) {
                  console.log()
                  model = [...selectionModel, row.data.id]
                } else {
                  model = selectionModel.filter(id => id != row.data.id)
                }

                onRowSelected(
                  // rows.filter(row => model.includes(row.id)) || [],
                  model,
                  false,
                )
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
                      'No Participants'
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
        aria-labelledby="edit participant"
      >
        <EditDialogTitle
          onCancel={() => setParticipantToEdit(undefined)}
          shouldWithdraw={participantToEdit?.shouldWithdraw}
        />

        <HideWhen hideWhen={participantToEdit?.shouldWithdraw || false}>
          <EditParticipantForm
            isEnrolledById={isEnrolledById}
            onCancel={() => setParticipantToEdit(undefined)}
            onOK={(note: string, cvd?: Date) => {
              onUpdateParticipant(participantToEdit?.id!, note, cvd)
              setParticipantToEdit(undefined)
            }}
            participant={participantToEdit?.participant || {}}
          >
            <Button
              onClick={() =>
                setParticipantToEdit(prev => ({
                  ...prev!,
                  shouldWithdraw: true,
                }))
              }
              color="secondary"
            >
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
            participant={participantToEdit?.participant || {}}
          ></WithdrawParticipantForm>
        </HideWhen>
      </Dialog>
    </>
  )
}

export default ParticipantTableGrid
