import { Box, Button, Checkbox, Menu, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'

interface StyleProps {
  helpTextWidth: number
  helpTextLeftOffset: number
  helpTextTopOffset: number
  arrowTailLength: number
  arrowRotate: number
}

const useStyles = makeStyles(theme => ({
  root: {
    '&:hover': {
      fontWeight: 'bolder',
      background: theme.palette.error.light,
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
    },
  },
  select: {
    paddingLeft: theme.spacing(2),
    minWidth: theme.spacing(6),
    borderRadius: 0,
    cursor: 'pointer',
    '&$focused': {
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
      backgroundColor: 'transparent'
    },
    '&:hover, &:active': {
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
      backgroundColor: 'transparent'
    },
    '& .MuiCheckbox-root': {
      paddingRight: 0,
      paddingLeft: 0

    }
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
  focused: {

  }
}))

export interface SelectAllProps {
  allText: string
  allPageText: string
  onSelectAllPage: Function
  onSelectAll: Function
}

const SelectAll: React.FunctionComponent<SelectAllProps> = ({
  allText,
  allPageText,
  onSelectAllPage,
  onSelectAll,

  children,
}) => {
  const classes = useStyles()
  /* const classes = useStyles({
    helpTextWidth,
    helpTextLeftOffset,
    arrowRotate,
    arrowTailLength,
    helpTextTopOffset,
  })
*/
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }
  return (
    <Box textAlign="left">
      <Button
      className={clsx(classes.select, Boolean(menuAnchor) && classes.focused)}
        aria-controls="simple-menu"
        aria-haspopup="true"
  
        onClick={handleMenuClick}
      >
        <Checkbox name="checkedI" checked={true} />{' '}
        <div className={clsx(Boolean(menuAnchor) ? classes.arrowUp: classes.arrowDown)}></div>
      </Button>
      <Menu
        id="study-menu"
        anchorEl={menuAnchor}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            //onSelectAll()
            handleMenuClose()
          }}
        >
          {allText}
        </MenuItem>
        <MenuItem
          onClick={() => {
            // onSelectAllPage()
            handleMenuClose()
          }}
        >
          {allPageText}
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default SelectAll
