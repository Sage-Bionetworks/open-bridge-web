import { Button, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ColDef, DataGrid, ValueGetterParams } from '@material-ui/data-grid'
import React, { FunctionComponent } from 'react'
import {
  ParticipantAccountSummary,
  StringDictionary,
} from '../../../types/types'
import ParticipantTablePagination from './ParticipantTablePagination'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import ParticipantService from '../../../services/participants.service'

const useStyles = makeStyles(theme => ({
  root: {},
  showEntryText: {
    fontFamily: 'Lato',
    fontSize: '15px',
    marginRight: theme.spacing(1),
  },
}))

export type ParticipantTableGridProps = {
  rows: ParticipantAccountSummary[]
  studyId: string
  totalParticipants: number
  currentPage: number
  setCurrentPage: Function
  pageSize: number
  setPageSize: Function
}

const ParticipantTableGrid: FunctionComponent<ParticipantTableGridProps> = ({
  rows,
  studyId,
  totalParticipants,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
}: ParticipantTableGridProps) => {
  const { token } = useUserSessionDataState()

  const [selected, setSelected] = React.useState<string[]>([])

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

  const columns: ColDef[] = [
    {
      field: 'externalId',
      headerName: 'Participant ID',
      flex: 2,
    },
    { field: 'id', headerName: 'HealthCode', flex: 2 },
    { field: 'clinicVisit', headerName: 'Clinic Visit', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
  ]

  function getPhone(params: ValueGetterParams) {
    if (params.value) {
      return (params.value as { nationalFormat: string }).nationalFormat
    } else return ''
  }

  const onPageSelectedChanged = (pageSelected: number) => {
    setCurrentPage(pageSelected)
  }

  const makeTestGroup = async () => {
    /* for (let i = 0; i < selected.length; i++) {

    const result = await ParticipantService.updateParticipantGroup(studyId, token!,selected[i], ['test_user'])
    }*/
  }

  const deleteParticipants = async () => {
    for (let i = 0; i < selected.length; i++) {
      const result = await ParticipantService.deleteParticipant(
        studyId,
        token!,
        selected[i],
        ['test_user'],
      )
    }
  }

  return (
    <Paper style={{ height: '600px' }}>
      <Button onClick={() => makeTestGroup()}>Make test group</Button>
      <Button onClick={() => deleteParticipants()}>Delete</Button>
      <div style={{ display: 'flex', height: '94%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            checkboxSelection
            components={{
              Footer: () => null,
            }}
            onSelectionChange={params =>
              setSelected(params.rowIds.map(id => id.toString()))
            }
          />
          <ParticipantTablePagination
            totalParticipants={totalParticipants}
            onPageSelectedChanged={onPageSelectedChanged}
            currentPage={currentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            numberOfPages={numberOfPages}
            handlePageNavigationArrowPressed={handlePageNavigationArrowPressed}
          />
        </div>
      </div>
    </Paper>
  )
}

export default ParticipantTableGrid
