import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ColDef, DataGrid, ValueGetterParams } from '@material-ui/data-grid'
import { TheatersOutlined } from '@material-ui/icons'
import React, { FunctionComponent } from 'react'
import {
  ParticipantAccountSummary,
  StringDictionary,
} from '../../../types/types'
import PageSelector from './PageSelector'

const useStyles = makeStyles(theme => ({
  root: {},
  footerWrapper: {
    height: '50px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0px 10px',
  },
  partitipantNumberText: {
    fontFamily: 'Lato',
    fontSize: '15px',
    fontStyle: 'italic',
  },
  showEntryText: {
    fontFamily: 'Lato',
    fontSize: '15px',
  },
}))

export type ParticipantTableGridProps = {
  rows: ParticipantAccountSummary[]
  studyId: string
  totalParticipants: number
}

const Footer: FunctionComponent<{
  totalParticipants: number
  onPageSelectedChanged: Function
  currentPage: number
}> = props => {
  const classes = useStyles()
  return (
    <div className={classes.footerWrapper}>
      <div
        className={classes.partitipantNumberText}
      >{`20/${props.totalParticipants} participants`}</div>
      <PageSelector
        onPageSelected={props.onPageSelectedChanged}
        currentPageSelected={props.currentPage}
        totalParticipants={props.totalParticipants}
      />
      <div className={classes.showEntryText}>{'show entries: '}</div>
    </div>
  )
}

const ParticipantTableGrid: FunctionComponent<ParticipantTableGridProps> = ({
  rows,
  studyId,
  totalParticipants,
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

  const [currentPage, setCurrentPage] = React.useState(1)

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
  const classes = useStyles()

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
            pageSize={50}
            checkboxSelection
            components={{
              Footer: () => (
                <Footer
                  totalParticipants={totalParticipants}
                  onPageSelectedChanged={onPageSelectedChanged}
                  currentPage={currentPage}
                />
              ),
            }}
          />
        </div>
      </div>
    </Paper>
  )
}

export default ParticipantTableGrid
