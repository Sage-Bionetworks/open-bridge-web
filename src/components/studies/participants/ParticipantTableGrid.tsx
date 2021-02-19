import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ColDef, DataGrid, ValueGetterParams } from '@material-ui/data-grid'
import React, { FunctionComponent } from 'react'
import {
  ParticipantAccountSummary,
  StringDictionary,
} from '../../../types/types'
import ParticipantTablePagination from './ParticipantTablePagination'

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
  function getExternalId(params: ValueGetterParams) {
    const extIds = params.getValue('externalIds') as
      | StringDictionary<string>
      | undefined
    if (!extIds) {
      return
    }
    return `${extIds[studyId]}`
  }

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
      field: 'studyExternalId',
      headerName: 'Participant ID',
      valueGetter: getExternalId,
      flex: 2,
    },
    { field: 'id', headerName: 'HealthCode', flex: 2 },
    { field: 'clinicVisit', headerName: 'Clinic Visit', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
  ]

  const onPageSelectedChanged = (pageSelected: number) => {
    setCurrentPage(pageSelected)
  }

  return (
    <Paper style={{ height: '600px' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            checkboxSelection
            components={{
              Footer: () => null,
            }}
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
