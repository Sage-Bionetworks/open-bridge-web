import {Box, Button, Checkbox, Menu, MenuItem} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import {SelectionType} from '@typedefs/types'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'left',
  },
  check: {
    padding: theme.spacing(0.5, 0, 0.5, 1.25),
  },
  icon: {
    marginLeft: '-10px',
    width: '16px',
    '& svg': {
      width: '15px',
      marginTop: '5px',
    },
  },
  select: {
    paddingLeft: 0,
    paddingRight: 0,
    minWidth: 'auto',
    borderRadius: 0,
    cursor: 'pointer',
    '&$focused': {
      // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
      backgroundColor: 'transparent',
    },
    '&:hover, &:active': {
      // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
      backgroundColor: 'transparent',
    },
    '& .MuiCheckbox-root': {
      paddingRight: 0,
      paddingLeft: 0,
    },
  },
  arrowDown: {
    width: '0px',
    height: '0px',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid #2f2f2f',
  },
  arrowUp: {
    width: '0px',
    height: '0px',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid #2f2f2f',
  },
  focused: {},
}))

export interface SelectAllProps {
  allText: string
  allPageText: string
  onSelectAllPage: Function
  onSelectAll: Function
  onDeselect: Function
  selectionType: SelectionType
}

const SelectAll: React.FunctionComponent<SelectAllProps> = ({
  allText,
  allPageText,
  onSelectAllPage,
  onSelectAll,
  onDeselect,
  selectionType,
}) => {
  const classes = useStyles()
  console.log('st', selectionType)
  const [selection, setSelection] = React.useState<SelectionType>(selectionType)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }
  const setSelect = (type: SelectionType) => {
    setSelection(type)
    handleMenuClose()

    switch (type) {
      case 'ALL': {
        onSelectAll()
        break
      }
      case 'PAGE': {
        onSelectAllPage()
        break
      }
      default: {
        return
      }
    }
  }
  const menuItems = [
    {
      value: 'ALL',
      label: allText,
    },
    {
      value: 'PAGE',
      label: allPageText,
    },
  ]

  return (
    <Box className={classes.root}>
      <Checkbox
        name="selectAllCheckbox"
        className={classes.check}
        checked={selectionType === 'ALL' || selectionType === 'PAGE'}
        indeterminate={selectionType === 'SOME'}
        onClick={() => {
          if (
            selectionType === 'ALL' ||
            selectionType === 'PAGE' ||
            selectionType === 'SOME'
          ) {
            onDeselect()
          } else {
            setSelect('ALL')
          }
        }}
      />{' '}
      <Button
        className={clsx(classes.select, Boolean(menuAnchor) && classes.focused)}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}>
        <div
          className={clsx(
            Boolean(menuAnchor) ? classes.arrowUp : classes.arrowDown
          )}></div>
      </Button>
      <Menu
        id="study-menu"
        anchorEl={menuAnchor}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}>
        {menuItems.map(item => (
          <MenuItem
            onClick={() => setSelect(item.value as SelectionType)}
            key={item.value}>
            <div className={classes.icon}>
              {selectionType == item.value && <CheckIcon />}
            </div>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default SelectAll
