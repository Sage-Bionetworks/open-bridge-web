import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {Box, Button, Menu, MenuItem} from '@mui/material'
import React from 'react'
import {useGetPlotWidth} from '../survey-branching/UseGetPlotWidth'

type MenuDropdownProps<T> = {
  items: T[]
  selectedFn: (a: T) => boolean
  displayItem: (a: T, isSelected?: boolean) => React.ReactElement
  onClick: (a: T) => void
  width?: number
}

const MenuDropdown = <T extends unknown>({items, selectedFn, onClick, displayItem, width}: MenuDropdownProps<T>) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const {width: fullWidth} = useGetPlotWidth()

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const myItems = [...items]
  const selectedItemIndex = myItems.findIndex(selectedFn)
  const selectedItem = myItems.splice(selectedItemIndex, 1)[0]

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        id="menu-button"
        variant="text"
        aria-controls={open ? 'nav-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{'&:hover': {textDecoration: 'none'}}}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        fullWidth>
        <Box sx={{display: 'flex', width: 'fit-content'}}>
          {selectedItem ? displayItem(selectedItem, true) : 'Select'}
        </Box>
      </Button>
      <Menu
        id="nav-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        marginThreshold={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        anchorReference="anchorPosition"
        anchorPosition={{top: 90, left: 0}}
        PaperProps={{
          sx: {backgroundColor: '#fff', maxWidth: '100%'},
        }}
        sx={{padding: 0}}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}>
        {myItems.map((section: any) =>
          section.enabled ? (
            <MenuItem
              key={section.path}
              selected={selectedFn(section)}
              onClick={() => onClick(section)}
              sx={{padding: 0, width: width || fullWidth, textAlign: 'center'}}>
              {displayItem(section)}
            </MenuItem>
          ) : (
            <MenuItem disabled key={section.path} sx={{padding: 0, width: width || fullWidth}}>
              {displayItem(section)}
            </MenuItem>
          )
        )}
      </Menu>
    </Box>
  )
}

export default MenuDropdown
