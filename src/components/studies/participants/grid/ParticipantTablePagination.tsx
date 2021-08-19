import {MenuItem, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
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

type ParticpantTablePaginationProps = {
  totalParticipants: number
  onPageSelectedChanged: Function
  currentPage: number
  pageSize: number
  setPageSize: Function

  handlePageNavigationArrowPressed: Function
}

const ParticipantTablePagination: React.FunctionComponent<ParticpantTablePaginationProps> =
  ({
    totalParticipants,
    onPageSelectedChanged,
    currentPage,
    pageSize,
    setPageSize,

    handlePageNavigationArrowPressed,
  }) => {
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

    let participantsShown = pageSize * currentPage
    if (totalParticipants === 0) {
      return <></>
    }
    return (
      <div className={classes.footerWrapper}>
        <div
          id="participant_page_data"
          className={classes.partitipantNumberText}>{`${
          participantsShown > totalParticipants
            ? totalParticipants
            : participantsShown
        }/${totalParticipants} participants`}</div>
        <PageSelector
          onPageSelected={onPageSelectedChanged}
          currentPageSelected={currentPage}
          numberOfPages={Math.ceil(totalParticipants / pageSize)}
          handlePageNavigationArrowPressed={handlePageNavigationArrowPressed}
        />
        <div className={classes.pageSizeSelectorContainer}>
          <div className={classes.showEntryText}>{'show entries: '}</div>
          <TextField
            id="page-selector"
            select
            value={pageSize}
            onChange={event => {
              onPageSelectedChanged(1)
              setPageSize(event.target.value)
            }}
            classes={{
              root: classes.rootStyles,
            }}
            InputProps={{disableUnderline: true}}
            data-testid="button-select">
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
