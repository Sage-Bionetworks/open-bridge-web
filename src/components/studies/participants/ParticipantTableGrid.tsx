import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ColDef, DataGrid, ValueGetterParams } from '@material-ui/data-grid'
import React, { FunctionComponent } from 'react'
import { ParticipantAccountSummary, StringDictionary } from '../../../types/types'

const useStyles = makeStyles(theme => ({
  root: {},

}))



export type ParticipantTableGridProps = {
  rows: ParticipantAccountSummary[]
  studyId: string,
}

const ParticipantTableGrid: FunctionComponent<ParticipantTableGridProps> = ({
  rows,
  studyId
}: ParticipantTableGridProps) => {


  function getExternalId(params: ValueGetterParams) {
    const extIds = params.getValue('externalIds') as StringDictionary<string> | undefined
    if (!extIds) {return }
    return `${extIds[studyId]}`;
  }
  
  
  const columns: ColDef[] = [
    { field: 'id', headerName: 'HealthCode',    flex: 2},
    { field: 'phone', headerName: 'Phone',    flex: 2},
    { field: 'status', headerName: 'Status' ,   flex: 1},
    { field: 'studyExternalId', headerName: 'External Id!',  valueGetter: getExternalId,  flex: 2},
  ]
  const classes = useStyles()

  return (
    <Paper style={{height: '600px'}}>
  <div style={{ display: 'flex', height: '100%' }}>
  <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={50}
          checkboxSelection
        />
        </div></div>
     </Paper>
  )
}

export default ParticipantTableGrid
