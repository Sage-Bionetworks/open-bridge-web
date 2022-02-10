import {MenuItem, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import Pluralize from 'react-pluralize'
import PageSelector, {PageSelectorValues} from './PageSelector'

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

const PAGE_SIZES = [
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

/*** general functions */
const getCurrentPageFromPageNavigationArrowPressed = (
  type: PageSelectorValues,
  currentPage: number,
  totalItems: number,
  pageSize: number
): number => {
  // "FF" = forward to last page
  // "F" = forward to next pages
  // "B" = back to previous page
  // "BB" = back to beginning

  const numberOfPages = Math.ceil(totalItems / pageSize)
  if (type === 'F' && currentPage !== numberOfPages) {
    return currentPage + 1
  } else if (type === 'FF' && currentPage !== numberOfPages) {
    return numberOfPages - 1
  } else if (type === 'B' && currentPage !== 0) {
    return currentPage - 1
  } else if (type === 'BB' && currentPage !== 0) {
    return 0
  }
  return currentPage //should not happen
}

type TablePaginationProps = {
  totalItems: number
  onPageSelectedChanged: Function
  currentPage: number
  pageSize: number
  setPageSize: Function
  // handlePageNavigationArrowPressed: Function
  counterTextSingular: string
  counterTextPlural?: string
}

const TablePagination: React.FunctionComponent<TablePaginationProps> = ({
  totalItems,
  onPageSelectedChanged,
  currentPage,
  pageSize,
  setPageSize,
  // handlePageNavigationArrowPressed,
  counterTextSingular,
  counterTextPlural,
}) => {
  const classes = useStyles()
  let itemsShownMin = pageSize * currentPage + 1
  let itemsShownMax = Math.min(pageSize + itemsShownMin - 1, totalItems)
  if (totalItems === 0) {
    return <></>
  }
  return (
    <div className={classes.footerWrapper}>
      <div id="item_page_data" className={classes.partitipantNumberText}>
        {itemsShownMin} - {itemsShownMax}/
        <Pluralize
          singular={counterTextSingular}
          count={totalItems}
          plural={counterTextPlural || counterTextSingular + 's'}
        />{' '}
      </div>
      <PageSelector
        onPageSelected={onPageSelectedChanged}
        currentPageSelected={currentPage}
        numberOfPages={Math.ceil(totalItems / pageSize)}
        handlePageNavigationArrowPressed={(val: PageSelectorValues) =>
          onPageSelectedChanged(
            getCurrentPageFromPageNavigationArrowPressed(
              val,
              currentPage,
              totalItems,
              pageSize
            )
          )
        }
      />
      <div className={classes.pageSizeSelectorContainer}>
        <div className={classes.showEntryText}>{'show entries: '}</div>
        <TextField
          id="page-selector"
          select
          value={pageSize}
          onChange={event => {
            onPageSelectedChanged(0)
            setPageSize(event.target.value)
          }}
          classes={{
            root: classes.rootStyles,
          }}
          InputProps={{disableUnderline: true}}
          data-testid="button-select">
          {PAGE_SIZES.map(pagesize => (
            <MenuItem key={pagesize.value} value={pagesize.value}>
              {pagesize.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </div>
  )
}

export default TablePagination
