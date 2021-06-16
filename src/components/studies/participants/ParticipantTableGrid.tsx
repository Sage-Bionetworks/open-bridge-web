import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Paper
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridOverlay,
  GridRowId,
  GridRowSelectedParams,
  GridValueGetterParams
} from '@material-ui/data-grid'
import React, { FunctionComponent } from 'react'
import { ReactComponent as PencilIcon } from '../../../assets/edit_pencil.svg'
import { ReactComponent as WithdrawIcon } from '../../../assets/withdraw.svg'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import ParticipantService from '../../../services/participants.service'
import { latoFont } from '../../../style/theme'
import {
  EditableParticipantData,
  EnrollmentType,
  ParticipantAccountSummary,
  ParticipantActivityType
} from '../../../types/types'
import DialogTitleWithClose from '../../widgets/DialogTitleWithClose'
import HideWhen from '../../widgets/HideWhen'
import SelectAll from '../../widgets/SelectAll'
import {
  EditParticipantForm,
  WithdrawParticipantForm
} from './ParticipantForms'
import ParticipantTablePagination from './ParticipantTablePagination'

const useStyles = makeStyles(theme => ({
  root: {},
  showEntryText: {
    fontFamily: latoFont,
    fontSize: '15px',
    marginRight: theme.spacing(1),
  },
}))

function getPhone(params: GridValueGetterParams) {
  if (params.value) {
    return (params.value as { nationalFormat: string }).nationalFormat
  } else return ''
}

function getClinicVisit(params: GridValueGetterParams) {
  if (params.value) {
    return new Date(params.value as string).toLocaleDateString()
  } else return ''
}

function getDateJoined(params: GridValueGetterParams) {
  if (params.value) {
    return new Date(params.value as string).toLocaleDateString()
  } else return '-'
}

const ACTIVE_PARTICIPANT_COLUMNS: GridColDef[] = [
  {
    field: 'externalId',
    headerName: 'Participant ID',
    flex: 2,
  },
  { field: 'id', headerName: 'HealthCode', flex: 2 },
  {
    field: 'clinicVisit',
    headerName: 'Clinic Visit',
    valueGetter: getClinicVisit,
    flex: 1,
  },
  {
    field: 'dateJoined',
    headerName: 'Joined',
    valueGetter: getDateJoined,
    flex: 1,
  },
  { field: 'notes', headerName: 'Notes', flex: 1 },
]

const WITHDRAWN_PARTICIPANT_COLUMNS: GridColDef[] = [
  {
    field: 'externalId',
    headerName: 'Participant ID',
    flex: 2,
  },
  { field: 'id', headerName: 'HealthCode', flex: 2 },
  {
    field: 'clinicVisit',
    headerName: 'Clinic Visit',
    valueGetter: getClinicVisit,
    flex: 1,
  },
  {
    field: 'dateJoined',
    headerName: 'Joined',
    valueGetter: getDateJoined,
    flex: 1,
  },
  {
    field: 'dateWithdrawn',
    headerName: 'Withdrawn',
    valueGetter: getDateJoined,
    flex: 1,
  },
  { field: 'withdrawalNote', headerName: 'Withdrawal notes', flex: 1 },
]

const phoneColumn = {
  field: 'phone',
  headerName: 'Phone Number',
  flex: 1,
  valueGetter: getPhone,
}

const EditDialogTitle: FunctionComponent<{
  onCancel: Function
  shouldWithdraw?: boolean
}> = ({ onCancel, shouldWithdraw }) => {
  const title = shouldWithdraw ? 'Withdraw' : 'Edit Participant Detail'
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
  enrollmentType: EnrollmentType
  gridType: ParticipantActivityType
  studyId: string
  totalParticipants: number
  currentPage: number
  setCurrentPage: Function
  onRowSelected: (
    participantIds: string[],
    isAll?: boolean,
  ) => void
  onUpdateParticipant: (
    pId: string,
    notes: string,
    clinicVisitDate?: Date,
  ) => void
  onWithdrawParticipant: (participantId: string, note: string) => void
  pageSize: number
  setPageSize: Function

  status: 'PENDING' | 'RESOLVED' | 'IDLE'
}

const ParticipantTableGrid: FunctionComponent<ParticipantTableGridProps> = ({
  rows,
  studyId,
  totalParticipants,
  gridType,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  status,
  selectedParticipantIds,
  enrollmentType,
  isAllSelected,
  onUpdateParticipant,
  onWithdrawParticipant,
  onRowSelected,
}: ParticipantTableGridProps) => {
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

  // This is the total number of pages needed to list all participants based on the
  // page size selected
  const numberOfPages = Math.ceil(totalParticipants / pageSize)

  const handlePageNavigationArrowPressed = (type: string) => {
    // "FF" = forward to last page
    // "F" = forward to next pages
    // "B" = back to previous page
    // "BB" = back to beginning
    if (type === 'F' && currentPage !== numberOfPages) {
      setCurrentPage(currentPage + 1)
    } else if (type === 'FF' && currentPage !== numberOfPages) {
      setCurrentPage(numberOfPages)
    } else if (type === 'B' && currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    } else if (type === 'BB' && currentPage !== 1) {
      setCurrentPage(1)
    }
  }

  const editColumn = {
    field: 'edit',
    headerName: 'Action',
    disableClickEventBubbling: true,

    renderCell: (params: GridCellParams) => {
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
            clinicVisitDate: getValDate('clinicVisit'),
            notes: getValString('notes'),
            externalId: getValString('externalId'),
            phoneNumber: getValPhone('phone'),
          }

          const event = await ParticipantService.getRequestInfoForParticipant(
            studyId,
            token!,
            getValString('id')!,
          )

          const hasSignedIn = event.signedInOn !== undefined

          setParticipantToEdit({
            id: getValString('id')!,
            participant,
            hasSignedIn,
            shouldWithdraw: false,
          })
        } catch (e) {
          console.log('Error in  onClick', e.message)
        }
      }

      return (
        <IconButton
          onClick={onClick}
          aria-label="edit participant"
          component="span"
        >
          <PencilIcon />
        </IconButton>
      )
    },
  }

  const participantColumns =
    gridType === 'ACTIVE'
      ? [...ACTIVE_PARTICIPANT_COLUMNS]
      : [...WITHDRAWN_PARTICIPANT_COLUMNS]

  if (enrollmentType === 'PHONE') {
    if (!participantColumns.find(col => col.field === 'phone'))
      participantColumns.splice(2, 0, phoneColumn)
  }
  if (gridType !== 'WITHDRAWN') {
    if (!participantColumns.find(col => col.field === 'edit')) {
      participantColumns.push(editColumn)
    }
  }

  const onPageSelectedChanged = (pageSelected: number) => {
    setCurrentPage(pageSelected)
  }
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([
    ...selectedParticipantIds]
  )
  React.useEffect(() => {
    setSelectionModel([...selectedParticipantIds])
  }, [selectedParticipantIds, rows])

  const allSelectedPage = () =>
    rows && !rows.find(row => !selectionModel.includes(row.id))

  return (
    <>
      <Paper elevation={0}>
        <div style={{ display: 'flex', height: '90vh' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              rows={rows}
              density="standard"
              columns={participantColumns}
              pageSize={pageSize}
              checkboxSelection
              /* onSelectionChange={(newSelection) => {
                setSelection(newSelection.rowIds);
              }}*/
              onRowSelected={(row: GridRowSelectedParams) => {
                let model: string[] = []
                if (row.isSelected) {
                  console.log()
                  model = [...selectionModel, row.data.id]
                } else {
                  model = selectionModel.filter(
                    id => id != row.data.id,
                  ) as string[]
                }

                onRowSelected(
                 // rows.filter(row => model.includes(row.id)) || [],
                 model,
                  false,
                )
              }}
              selectionModel={selectionModel}
              components={{
                Header: () => (
                  <div
                    style={{
                      position: 'absolute',
                      zIndex: 11,
                      top: 0,
                      left: 0,
                      backgroundColor: '#fff',
                    }}
                  >
                    {' '}
                    <SelectAll
                      selectionType={
                        isAllSelected
                          ? 'ALL'
                          : allSelectedPage()
                          ? 'PAGE'
                          : undefined
                      }
                      allText={`All ${totalParticipants} participants`}
                      allPageText="All on this page"
                      onSelectAllPage={() => {
                        const ids = rows.map(row => row.id)
                        onRowSelected(ids, false)
                      }}
                      onSelectAll={() => {
                        const ids = rows.map(row => row.id)
                        onRowSelected(ids, true)
                      }}
                    ></SelectAll>
                  </div>
                ),
                Footer: () => (
                  <ParticipantTablePagination
                    totalParticipants={totalParticipants}
                    onPageSelectedChanged={onPageSelectedChanged}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    numberOfPages={numberOfPages}
                    handlePageNavigationArrowPressed={
                      handlePageNavigationArrowPressed
                    }
                  />
                ),
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
            enrollmentType={enrollmentType}
            onCancel={() => setParticipantToEdit(undefined)}
            onOK={(notes: string, cvd?: Date) => {
              onUpdateParticipant(participantToEdit?.id!, notes, cvd)
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
            enrollmentType={enrollmentType}
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
