import {getStyledToolbarLinkStyle} from '@components/widgets/StyledComponents'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {Box, Button, Hidden, Menu, MenuItem, styled, Toolbar, Typography} from '@mui/material'
import {shouldForwardProp, theme} from '@style/theme'
import React from 'react'
import {useGetPlotWidth} from '../survey-branching/UseGetPlotWidth'

const StyledStudyToolbar = styled(Toolbar, {label: 'StyledStudyToolbar'})(({theme}) => ({
  alignItems: 'center',
  minHeight: 'unset !important',
  display: 'flex',
  maxWidth: 'fit-content',
  margin: '0 auto',

  justifyContent: 'space-between',
  marginTop: theme.spacing(2),

  '&:last-child': {
    paddingRight: 0,
  },
  '&:first-child': {
    paddingLeft: 0,
  },
}))

const StyledToolbarLink = styled(Button, {label: 'StyledToolbarLink', shouldForwardProp: shouldForwardProp})<{
  $isSelected: boolean
}>(({theme, $isSelected}) => ({
  ...getStyledToolbarLinkStyle(theme),
  textTransform: 'capitalize',

  boxShadow: $isSelected ? 'inset 0px -4px 0px 0px #9499C7' : 'none',
  fontWeight: $isSelected ? 600 : 400,
  '&:hover': {textDecoration: 'none'},
}))
const StyledToolbarLinkDisabled = styled(Typography, {label: 'StyledToolbarLinkDisabled'})(({theme}) => ({
  ...getStyledToolbarLinkStyle(theme),
  opacity: 0.45,
  textTransform: 'capitalize',
}))

type MenuDropdownProps<T> = {
  items: T[]
  selectedFn: (a: T) => boolean
  onClick: (a: T) => void
  width?: number
}

export const MenuDesktop = <T extends unknown>({
  items,
  selectedFn,
  onClick,
  displayItem,
  width,
}: MenuDropdownProps<T> & {displayItem: (a: T, isSelected?: boolean) => React.ReactElement}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const {width: fullWidth} = useGetPlotWidth()

  const open = Boolean(anchorEl)

  return (
    <Box id="hight">
      <StyledStudyToolbar>
        {items.map((section: any) =>
          section.enabled ? (
            <StyledToolbarLink key={section.id} onClick={() => onClick(section)} $isSelected={selectedFn(section)}>
              {displayItem(section)}
            </StyledToolbarLink>
          ) : (
            <StyledToolbarLinkDisabled key={section.id}>{displayItem(section)}</StyledToolbarLinkDisabled>
          )
        )}
      </StyledStudyToolbar>
    </Box>
  )
}

export const MenuDropdown = <T extends unknown>({
  items,
  selectedFn,
  onClick,
  displayItem,
  width,
}: MenuDropdownProps<T> & {displayItem: (a: T, isSelected?: boolean) => React.ReactElement}) => {
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

  const wrapItem = (item: React.ReactElement, isSelected: boolean) => (
    <Box
      sx={{
        textTransform: 'capitalize',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        width: '100%',
        fontSize: isSelected ? '18px' : '18px',
        fontWeight: isSelected ? 900 : 400,
        color: isSelected ? theme.palette.grey.A100 : theme.palette.grey[700],
        height: theme.spacing(6),
      }}>
      {item}
    </Box>
  )

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
          {selectedItem ? wrapItem(displayItem(selectedItem, true), true) : 'Select'}
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
              key={section.id}
              selected={selectedFn(section)}
              onClick={() => {
                handleClose()
                onClick(section)
              }}
              sx={{padding: 0, width: width || fullWidth, textAlign: 'center'}}>
              {wrapItem(displayItem(section), false)}
            </MenuItem>
          ) : (
            <MenuItem disabled key={section.id} sx={{padding: 0, width: width || fullWidth}}>
              {wrapItem(displayItem(section), false)}
            </MenuItem>
          )
        )}
      </Menu>
    </Box>
  )
}

const CollapsableMenu = <T extends unknown>(
  props: MenuDropdownProps<T> & {
    displayMobileItem: (a: T, isSelected?: boolean) => React.ReactElement
    displayDesktopItem: (a: T, isSelected?: boolean) => React.ReactElement
  }
) => {
  return (
    <>
      <Hidden lgDown>
        <MenuDesktop {...props} displayItem={props.displayDesktopItem} />
      </Hidden>
      <Hidden lgUp>
        <MenuDropdown {...props} displayItem={props.displayMobileItem} />
      </Hidden>
    </>
  )
}

export default CollapsableMenu
