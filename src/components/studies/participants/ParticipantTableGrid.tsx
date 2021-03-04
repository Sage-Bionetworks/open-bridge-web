import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Paper
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  CellParams,
  ColDef,
  DataGrid,
  GridOverlay,
  ValueGetterParams,
} from '@material-ui/data-grid'
import React, { FunctionComponent } from 'react'
import { ReactComponent as PencilIcon } from '../../../assets/edit_pencil.svg'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import ParticipantService from '../../../services/participants.service'
import { latoFont } from '../../../style/theme'
import {
  EditableParticipantData,
  EnrollmentType,
  ParticipantAccountSummary
} from '../../../types/types'
import DialogTitleWithClose from '../../widgets/DialogTitleWithClose'
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

const activeParticipantsColumns: ColDef[] = [
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

export type ParticipantTableGridProps = {
  rows: ParticipantAccountSummary[]
  enrollmentType: EnrollmentType
  studyId: string
  totalParticipants: number
  currentPage: number
  setCurrentPage: Function
  onRowSelected: (ids: string[]) => void
  onUpdate: Function
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
  onUpdate,
  onRowSelected,
}: ParticipantTableGridProps) => {
  const { token } = useUserSessionDataState()

  // const [isDone, setIsDone] = React.useState(true)
  //const [selected, setSelected] = React.useState<string[]>([])

  //when we are editing the record this is where the info is stored
  const [participantToEdit, setParticipantToEdit] = React.useState<
    | {
        id: string
        participant: EditableParticipantData
        hasSignedIn: boolean
        shouldWithdraw?: boolean
      }
    | undefined
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

  const editColumn = {
    field: 'edit',
    headerName: 'Action',
    disableClickEventBubbling: true,
    renderCell: (params: CellParams) => {
      const onClick = async () => {
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

  if (isPhoneEnrollmentType) {
    activeParticipantsColumns.splice(2, 0, {
      field: 'phone',
      headerName: 'Phone Number',
      flex: 1,
      valueGetter: getPhone,
    })
  }
  if (isEdit) {
    activeParticipantsColumns.push(editColumn)
  }

  const onPageSelectedChanged = (pageSelected: number) => {
    setCurrentPage(pageSelected)
  }

  const handleClose = () => {}

  const saveChangesToParticipant = async (
    participantId: string,
    notes: string,
    clinicVisitDate?: Date,
  ) => {
    await ParticipantService.updateParticipant(studyId, token!, participantId, {
      notes,
      clinicVisitDate: clinicVisitDate,
    })

    onUpdate()
    setParticipantToEdit(undefined)
  }

  const withdrawParticipant = async (participantId: string, note: string) => {
    await ParticipantService.withdrawParticipant(
      studyId,
      token!,
      participantId,
      note,
    )

    onUpdate()
    setParticipantToEdit(undefined)
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
              columns={activeParticipantsColumns}
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
        open={
          participantToEdit !== undefined && !participantToEdit?.shouldWithdraw
        }
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
        <EditParticipantForm
          enrollmentType={enrollmentType}
          onCancel={() => setParticipantToEdit(undefined)}
          onOK={(notes: string, cvd?: Date) =>
            saveChangesToParticipant(participantToEdit?.id!, notes, cvd)
          }
          participant={participantToEdit?.participant || {}}
        >
          <Button
            onClick={() =>
              setParticipantToEdit(prev => ({ ...prev!, shouldWithdraw: true }))
            }
            color="primary"
          >
            Withdraw from study
          </Button>
        </EditParticipantForm>
      </Dialog>

      <Dialog
        open={
          participantToEdit !== undefined && !!participantToEdit.shouldWithdraw
        }
        maxWidth="sm"
        fullWidth
        aria-labelledby="edit participant"
      >
        <DialogTitleWithClose onCancel={() => setParticipantToEdit(undefined)}>
          <>
            <PencilIcon style={{ width: '25px' }}></PencilIcon>
            <span style={{ paddingLeft: '8px' }}>Withdraw</span>
          </>
        </DialogTitleWithClose>

        <WithdrawParticipantForm
          enrollmentType={enrollmentType}
          onCancel={() => setParticipantToEdit(undefined)}
          onOK={(note: string) =>
            withdrawParticipant(participantToEdit?.id!, note)
          }
          participant={participantToEdit?.participant || {}}
        ></WithdrawParticipantForm>
      </Dialog>
    </>
  )
}

export default ParticipantTableGrid
