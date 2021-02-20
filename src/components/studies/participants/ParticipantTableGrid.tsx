import { Button, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ColDef, DataGrid, ValueGetterParams } from '@material-ui/data-grid'
import React, { FunctionComponent } from 'react'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import ParticipantService from '../../../services/participants.service'
import {
  ParticipantAccountSummary,
  StringDictionary
} from '../../../types/types'

const useStyles = makeStyles(theme => ({
  root: {},
}))

export type ParticipantTableGridProps = {
  rows: ParticipantAccountSummary[]
  studyId: string
}

const ParticipantTableGrid: FunctionComponent<ParticipantTableGridProps> = ({
  rows,
  studyId,
}: ParticipantTableGridProps) => {
  const [selected, setSelected] = React.useState<string[]>([])

  function getExternalId(params: ValueGetterParams) {
    const extIds = params.getValue('externalIds') as
      | StringDictionary<string>
      | undefined
    if (!extIds) {
      return ''
    }
    return extIds[studyId] || ''
  }

  function getPhone(params: ValueGetterParams) {
    if (params.value) {
      return (params.value as { nationalFormat: string }).nationalFormat
    } else return ''
  }

  const { token } = useUserSessionDataState()

  const columns: ColDef[] = [
    { field: 'id', headerName: 'HealthCode', flex: 2 },
    { field: 'clinicVisit', headerName: 'Clinic Visit', flex: 1 },
    { field: 'phone', headerName: 'Phone', valueGetter: getPhone, flex: 2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'studyExternalId',
      headerName: 'External Id!',
      valueGetter: getExternalId,
      flex: 2,
    },
  ]
  const classes = useStyles()

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
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={100}
            onSelectionChange={params =>
              setSelected(params.rowIds.map(id => id.toString()))
            }
            checkboxSelection
          />
        </div>
      </div>
    </Paper>
  )
}

export default ParticipantTableGrid
