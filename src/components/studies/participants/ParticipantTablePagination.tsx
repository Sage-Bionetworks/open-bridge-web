import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { MenuItem, TextField } from '@material-ui/core'
import PageSelector from './PageSelector'

const useStyles = makeStyles(theme => ({
  footerWrapper: {
    height: '50px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(2.25),
    marginTop: theme.spacing(0.5),
  },
  partitipantNumberText: {
    fontFamily: 'Lato',
    fontSize: '15px',
    fontStyle: 'italic',
    minWidth: '175px',
  },
  showEntryText: {
    fontFamily: 'Lato',
    fontSize: '15px',
    marginRight: theme.spacing(1),
  },
  pageSizeSelectorContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rootStyles: {
    backgroundColor: 'white',
    border: '1px solid black',
    width: '60px',
  },
}))

const ParticipantTablePagination: React.FC<{
  totalParticipants: number
  onPageSelectedChanged: Function
  currentPage: number
  pageSize: number
  setPageSize: Function
  numberOfPages: number
  handlePageNavigationArrowPressed: Function
}> = props => {
  const classes = useStyles()

  const pageSizes = [
    {
      value: 25,
      label: '25',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 100,
      label: '100',
    },
  ]

  let participantsShown = props.pageSize * props.currentPage
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
        <TextField
          id="standard-select-currency"
          select
          value={props.pageSize}
          onChange={event => {
            props.onPageSelectedChanged(1)
            props.setPageSize(event.target.value)
          }}
          classes={{
            root: classes.rootStyles,
          }}
          InputProps={{ disableUnderline: true }}
        >
          {pageSizes.map(pagesize => (
            <MenuItem key={pagesize.value} value={pagesize.value}>
              {pagesize.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </div>
  )
}

export default ParticipantTablePagination
