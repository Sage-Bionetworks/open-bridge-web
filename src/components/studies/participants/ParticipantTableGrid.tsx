import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Paper
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  CellParams,
  ColDef,
  DataGrid,
  GridOverlay,
  ValueGetterParams
} from '@material-ui/data-grid'
import React, { FunctionComponent } from 'react'
import { ReactComponent as PencilIcon } from '../../../assets/edit_pencil.svg'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import { latoFont } from '../../../style/theme'
import {
  EditableParticipantData,
  EnrollmentType,
  ParticipantAccountSummary
} from '../../../types/types'
import DialogTitleWithClose from '../../widgets/DialogTitleWithClose'
import { AddEditParticipantForm } from './AddSingleParticipant'
import ParticipantTablePagination from './ParticipantTablePagination'

const useStyles = makeStyles(theme => ({
  root: {},
  showEntryText: {
    fontFamily: latoFont,
    fontSize: '15px',
    marginRight: theme.spacing(1),
  },
}))

export type ParticipantTableGridProps = {
  rows: ParticipantAccountSummary[]
  enrollmentType: EnrollmentType
  studyId: string
  totalParticipants: number
  currentPage: number
  setCurrentPage: Function
  onRowSelected: (ids: string[]) => void
  onEdit: (id: string, p: EditableParticipantData) => void
  pageSize: number
  setPageSize: Function
  isPhoneEnrollmentType: boolean
  isEdit?: boolean
  status: 'PENDING' | 'RESOLVED' | 'IDLE'
}

const ParticipantTableGrid: FunctionComponent<ParticipantTableGridProps> = ({
  rows,
  studyId,
  totalParticipants,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  isPhoneEnrollmentType,
  status,
  isEdit,
  enrollmentType,
  onEdit,
  onRowSelected,
}: ParticipantTableGridProps) => {
  const { token } = useUserSessionDataState()

  // const [isDone, setIsDone] = React.useState(true)
  //const [selected, setSelected] = React.useState<string[]>([])
  //const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [participantToEdit, setParticipantToEdit] = React.useState<
    { id: string; participant: EditableParticipantData } | undefined
  >(undefined)

  // This is the total number of pages needed to list all participants based on the
  // page size selected
  const numberOfPages = Math.ceil(totalParticipants / pageSize)

  const handlePageNavigationArrowPressed = (type: string) => {
    // "FF" = forward to last page
    // "F" = forward to next page
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

  function getPhone(params: ValueGetterParams) {
    if (params.value) {
      return (params.value as { nationalFormat: string }).nationalFormat
    } else return ''
  }

  function getClinicVisit(params: ValueGetterParams) {
    if (params.value) {
      return new Date(params.value as string).toLocaleDateString()
    } else return ''
  }

  const editColumn = {
    field: 'edit',
    headerName: 'Action',
    disableClickEventBubbling: true,
    renderCell: (params: CellParams) => {
      const onClick = () => {
        const getValString = (column: string): string | undefined => {
          const result = params.getValue(column)?.toString()

          return result
        }

        const getValDate = (column: string): Date | undefined => {
          const result = params.getValue(column)?.toString()
          const d = result ? new Date(result) : undefined
          return d
        }

        const getValPhone = (column: string): string | undefined => {
          const result = params.getValue(column)?.toString()
          return result?.replace('+1', '') || ''
        }

        const participant: EditableParticipantData = {
          clinicVisitDate: getValDate('clinicVisit'),
          notes: getValString('notes'),
          externalId: getValString('externalId'),
          phoneNumber: getValPhone('phone'),
        }

        setParticipantToEdit({
          id: getValString('id')!,
          participant,
        })
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

  const columns: ColDef[] = [
    {
      field: 'externalId',
      headerName: 'Participant ID',
      flex: 2,
    },
    // { field: 'id', headerName: 'HealthCode', flex: 2 },
    {
      field: 'clinicVisit',
      headerName: 'Clinic Visit',
      valueGetter: getClinicVisit,
      flex: 1,
    },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
  ]
  if (isPhoneEnrollmentType) {
    columns.splice(2, 0, {
      field: 'phone',
      headerName: 'Phone Number',
      flex: 1,
      valueGetter: getPhone,
    })
  }
  if (isEdit) {
    columns.push(editColumn)
  }

  const onPageSelectedChanged = (pageSelected: number) => {
    setCurrentPage(pageSelected)
  }

  const updateParticipant = (p: EditableParticipantData) => {
    setParticipantToEdit(prev => {
      if (!prev) {
        return undefined
      }

      return { ...prev, participant: p }
    })
  }

  const handleClose = () => {
    ;<Button onClick={handleClose} color="primary">
      Cancel
    </Button>
  }

  const makeTestGroup = async () => {
    /* for (let i = 0; i < selected.length; i++) {

    const result = await ParticipantService.updateParticipantGroup(studyId, token!,selected[i], ['test_user'])
    }*/
  }

  /* TMP not used const deleteParticipants = async () => {
    setIsDone(false)
    for (let i = 0; i < selected.length; i++) {
      await ParticipantService.deleteParticipant(studyId, token!, selected[i])
    }
    setIsDone(true)
  }*/

  return (
    <>
      <Paper elevation={0}>
        {/*<Button onClick={() => makeTestGroup()}>Make test group</Button>
      <Button onClick={() => deleteParticipants()} disabled={!isDone}>
        Delete
  </Button>*/}
        <div style={{ display: 'flex', height: '90vh' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              rows={rows}
              density="standard"
              columns={columns}
              pageSize={pageSize}
              checkboxSelection
              onSelectionChange={selectedRows => {
                console.log(selectedRows.rowIds)
              }}
              // onRowSelected={(params)=> {console.log(params); onRowSelected(params.data.id.toString(), params.isSelected)}}

              components={{
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
                      <CircularProgress></CircularProgress>
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
        <DialogTitleWithClose onCancel={() => setParticipantToEdit(undefined)}>
          <>
            <PencilIcon style={{ width: '25px' }}></PencilIcon>
            <span style={{ paddingLeft: '8px' }}>Edit Participant Detail</span>
          </>
        </DialogTitleWithClose>

        <DialogContent>
          <AddEditParticipantForm
            onChange={updateParticipant}
            participant={participantToEdit?.participant || {}}
            enrollmentType={enrollmentType}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Withdraw from Study
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ParticipantTableGrid
