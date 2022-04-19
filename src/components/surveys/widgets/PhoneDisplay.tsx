import MoreVertIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import {latoFont, theme} from '@style/theme'
import React, {FunctionComponent} from 'react'

const ITEM_HEIGHT = 48

const PhoneDiv = styled('div')(({theme}) => ({
  position: 'relative',
  height: '504px',
  width: '264px',
  border: '3px solid #2A2A2A',
  background: '#f9f9f9',
  borderRadius: '25px',
  padding: theme.spacing(3),
  boxShadow: '-27px 23px 18px rgba(42, 42, 42, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: '40px',
}))

const Label = styled('label')({
  fontFamily: latoFont,
  fontWeight: 600,
  fontSize: '16px',
})
const PhoneBottom = styled('div')({
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
  },
})

const SideMenu = styled('div')({
  marginRight: '3px',
  height: '48px',
  width: '40px',
  display: 'flex',
  backgroundColor: '#565656',
  borderRadius: '0px 0 25px 0',
  borderBottom: '3px solid #2A2A2A',
  borderRight: '3px solid #2A2A2A',
})

type PhoneDisplayProps = {}

const PhoneDisplay: FunctionComponent<PhoneDisplayProps> = ({children}) => {
  //const classes = useStyles()
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
    <PhoneDiv>
      <div>{children}</div>
      <Box
        sx={{
          height: theme.spacing(5),
          backgroundColor: '#2A2A2A',
          borderRadius: '100px',
          textAlign: 'center',
          color: '#fff',
          lineHeight: theme.spacing(5),
        }}>
        <Label>Start</Label>
        <PhoneBottom>
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
        </PhoneBottom>
      </Box>
    </PhoneDiv>
  )
}
export default PhoneDisplay
