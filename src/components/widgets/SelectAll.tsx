import { Box, Button, Checkbox, Menu, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'left',
  },
  select: {
    paddingLeft: theme.spacing(2),
    minWidth: theme.spacing(6),
    borderRadius: 0,
    cursor: 'pointer',
    '&$focused': {
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
      backgroundColor: 'transparent',
    },
    '&:hover, &:active': {
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
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

export type SelectionType = 'ALL' | 'PAGE' | undefined

export interface SelectAllProps {
  allText: string
  allPageText: string
  onSelectAllPage: Function
  onSelectAll: Function
  selectionType: SelectionType
}

const SelectAll: React.FunctionComponent<SelectAllProps> = ({
  allText,
  allPageText,
  onSelectAllPage,
  onSelectAll,
  selectionType,
}) => {
  const classes = useStyles()

  const [selection, setSelection] = React.useState<SelectionType>(selectionType)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }
  const setSelect = (type: 'ALL' | 'PAGE') => {
    setSelection(type)
    handleMenuClose()
    type === 'ALL' ? onSelectAll() : onSelectAllPage()
  }

  return (
    <Box className={classes.root}>
      <Button
        className={clsx(classes.select, Boolean(menuAnchor) && classes.focused)}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        <Checkbox
          name="selectAllCheckbox"
          checked={selection === 'ALL'}
          indeterminate={selection === 'PAGE'}
        />{' '}
        <div
          className={clsx(
            Boolean(menuAnchor) ? classes.arrowUp : classes.arrowDown,
          )}
        ></div>
      </Button>
      <Menu
        id="study-menu"
        anchorEl={menuAnchor}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        getContentAnchorEl={null}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setSelect('ALL')}>{allText}</MenuItem>
        <MenuItem onClick={() => setSelect('PAGE')}>{allPageText}</MenuItem>
      </Menu>
    </Box>
  )
}

export default SelectAll
