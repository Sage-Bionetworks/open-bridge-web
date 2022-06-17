import MoreVertIcon from '@mui/icons-material/MoreVert'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import {latoFont} from '@style/theme'
import React, {FunctionComponent} from 'react'

const ITEM_HEIGHT = 48

const PhoneBottom = styled('div', {label: 'phoneBottom'})({
  position: 'absolute',
  left: '0px',
  bottom: '-3px',
  height: '48px',
  width: '264px',
  display: 'flex',
  borderRadius: '0px 0px 0px 25px',

  // borderBottom: 'none',
  '& .MuiButton-text': {
    background: '#BCD5E4',
    width: '100%',
    height: '100%',
    borderBottom: '3px solid #2A2A2A',
    bordeLeft: '3px solid #2A2A2A',
    borderRadius: '0px 0px 0px 25px',

    '&:hover': {
      background: '#BCD5E4',
      fontWeight: 900,
      '& label': {
        cursor: 'pointer',
      },
    },
  },
})

const SideMenu = styled('div', {label: 'sideMenu'})({
  marginRight: '3px',
  height: '48px',
  width: '40px',
  display: 'flex',
  backgroundColor: '#565656',
  borderRadius: '0px 0 25px 0',
  borderBottom: '3px solid #2A2A2A',
  borderRight: '3px solid #2A2A2A',
  '&  svg': {
    color: '#fff',
  },
})
const Label = styled('label')({
  fontFamily: latoFont,
  fontWeight: 600,
  fontSize: '16px',
})

const QuestionPhoneBottom: FunctionComponent<{}> = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const options = ['option1', 'option2', 'option3']
  return (
    <PhoneBottom>
      {/*  <PhoneBottomDiv id="phoneBottom">*/}
      <Button variant="text">
        <Label sx={{color: '#2A2A2A'}}> + Add Response </Label>
      </Button>

      <SideMenu>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}>
          {options.map(option => (
            <MenuItem
              key={option}
              selected={option === 'Pyxis'}
              onClick={handleClose}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </SideMenu>
      {/*</PhoneBottomDiv>*/}
    </PhoneBottom>
  )
}

export default QuestionPhoneBottom
