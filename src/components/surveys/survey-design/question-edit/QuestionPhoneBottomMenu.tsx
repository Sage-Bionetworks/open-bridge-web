import MoreVertIcon from '@mui/icons-material/MoreVert'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import {latoFont} from '@style/theme'
import {Step} from '@typedefs/surveys'
import React, {FunctionComponent} from 'react'

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

const StyledMenu = styled(Menu, {label: 'StyledMenu'})(({theme}) => ({
  '& .MuiPaper-root > ul': {
    padding: 0,
  },
}))
const Label = styled('label')({
  fontFamily: latoFont,
  fontWeight: 600,
  fontSize: '16px',
})
const OPTIONS = new Map([
  ['ALL', '+ All of the above'],
  ['NONE', '+ None of the above'],
  ['OTHER', '+ Add "Other"'],
])

const QuestionPhoneBottomMenu: FunctionComponent<{question: Step}> = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (optionKey: string) => {
    switch (optionKey) {
      case 'ALL':
        break
      case 'NONE':
        break
      case 'OTHER':
        break
    }
    setAnchorEl(null)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  /* 	"type": "choiceQuestion",
  "other" : { "type" : "string" }  
  {
    "text" : "All of the above",
    "selectorType" : "all"
  },
  {
    "text" : "None of the above",
    "selectorType" : "exclusive"
  }*/
  const OPTIONS = new Map([
    ['ALL', '+ All of the above'],
    [' NONE', '+ None of the above'],
    [' OTHER', '+ Add "Other"'],
  ])

  return (
    <PhoneBottom>
      {/*  <PhoneBottomDiv id="phoneBottom">*/}
      <Button variant="text">
        <Label sx={{color: '#2A2A2A'}}> + Add Response </Label>
      </Button>

      <SideMenu sx={{borderRadius: anchorEl ? '0' : '0px 0 25px 0'}}>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <StyledMenu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          sx={{padding: 0}}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            style: {
              padding: 0,
            },
          }}>
          {Array.from(OPTIONS.keys()).map(optionKey => (
            <MenuItem
              key={optionKey}
              sx={{
                height: '48px',
                backgroundColor: '#565656',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#848484',
                },
              }}
              onClick={() => handleMenuItemClick(optionKey)}>
              {OPTIONS.get(optionKey)}
            </MenuItem>
          ))}
        </StyledMenu>
      </SideMenu>
      {/*</PhoneBottomDiv>*/}
    </PhoneBottom>
  )
}

export default QuestionPhoneBottomMenu
