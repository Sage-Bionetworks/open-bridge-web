import { Paper, MenuItem, Menu, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ColDef, DataGrid, ValueGetterParams } from '@material-ui/data-grid'
import React, { FunctionComponent } from 'react'
import {
  ParticipantAccountSummary,
  StringDictionary,
} from '../../../types/types'
import PageSelector from './PageSelector'
import SelectWithEnum from '../../widgets/SelectWithEnum'

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
    marginRight: theme.spacing(1),
  },
  numEntriesButton: {
    width: '10px',
    height: '25px',
    border: '1px solid black',
    borderRadius: '0px',
    marginLeft: theme.spacing(0.5),
  },
  pageSizeSelectorContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
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

const Footer: FunctionComponent<{
  totalParticipants: number
  onPageSelectedChanged: Function
  currentPage: number
  pageSize: number
  setPageSize: Function
  numberOfPages: number
  handlePageNavigationArrowPressed: Function
}> = props => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  /*
        enum PageSizeEnum {
    'TWENTY_FIVE' = '25',
    'FIFTY' = '50',
    'ONE_HUNDRED' = '100',
  }
      <SelectWithEnum
          value={'numberasd sadfsadfdsafs' || 'hello'}
          style={{ backgroundColor: 'white' }}
          sourceData={PageSizeEnum}
          id="pagesize"
          onChange={e => {
            const n = e.target.value! as keyof typeof PageSizeEnum
            console.log('n is', n)
            props.setPageSize(100)
          }}
        ></SelectWithEnum>
  */

  const participantsShown = props.pageSize * props.currentPage
  return (
    <div className={classes.footerWrapper}>
      <div className={classes.partitipantNumberText}>{`${
        participantsShown > props.totalParticipants
          ? props.totalParticipants
          : participantsShown
      }/${props.totalParticipants} participants`}</div>
      <PageSelector
        onPageSelected={props.onPageSelectedChanged}
        currentPageSelected={props.currentPage}
        numberOfPages={props.numberOfPages}
        handlePageNavigationArrowPressed={
          props.handlePageNavigationArrowPressed
        }
      />
      <div className={classes.pageSizeSelectorContainer}>
        <div className={classes.showEntryText}>{'show entries: '}</div>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className={classes.numEntriesButton}
        >
          {props.pageSize}
        </Button>
        <Menu
          open={Boolean(anchorEl)}
          id="simple-menu"
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              handleClose()
              props.onPageSelectedChanged(1)
              props.setPageSize(25)
            }}
          >
            25
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              props.onPageSelectedChanged(1)
              props.setPageSize(50)
            }}
          >
            50
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              props.onPageSelectedChanged(1)
              props.setPageSize(100)
            }}
          >
            100
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
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
              Footer: () => (
                <Footer
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
            }}
          />
        </div>
      </div>
    </Paper>
  )
}

export default ParticipantTableGrid
