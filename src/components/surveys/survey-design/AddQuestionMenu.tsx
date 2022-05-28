import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Button from '@mui/material/Button'
import Menu, {MenuProps} from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {alpha, styled} from '@mui/material/styles'
import * as React from 'react'
import QuestionTypeDisplay, {
  QUESTION_TYPE_ICONS,
} from '../widgets/QuestionTypeDisplay'

const SelectButton = styled(Button)(({theme}) => ({
  backgroundColor: '#F2F2F2',
  color: '#3A3A3A',
  border: 'none',
  padding: 0,
  minHeight: theme.spacing(6),
  paddingRight: theme.spacing(2),
  '& .MuiButton-endIcon': {
    color: '#3A3A3A',
  },

  '&:hover': {
    fontWeight: 'bold',
    backgroundColor: '#F2F2F2',
    border: '1px solid black',
    //color: 'blue',
  },
}))

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({theme}) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      padding: 0,
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: 'green',
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}))

const AddQuestionMenu: React.FunctionComponent = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selected, setSelected] = React.useState<null | React.ReactNode>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onSelect = (option: React.ReactNode) => {
    setSelected(option)
    handleClose()
  }

  return (
    <div>
      <SelectButton
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowUpIcon />}>
        {selected || 'Select Option'}
      </SelectButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        {Array.from(QUESTION_TYPE_ICONS.keys()).map(name => (
          <MenuItem
            key={name}
            onClick={() =>
              onSelect(<QuestionTypeDisplay name={name} isSelected={false} />)
            }
            disableRipple>
            <QuestionTypeDisplay name={name} isSelected={false} />
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  )
}

export default AddQuestionMenu
