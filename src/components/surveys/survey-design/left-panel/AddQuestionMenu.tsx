import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Button from '@mui/material/Button'
import Menu, {MenuProps} from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {alpha, styled} from '@mui/material/styles'
import * as React from 'react'
import QUESTIONS, {QuestionTypeKey} from './QuestionConfigs'
import QuestionTypeDisplay from './QuestionTypeDisplay'

const SelectButton = styled(Button)(({theme}) => ({
  flexGrow: 1,
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
  },
}))

const StyledButton = styled(Button)(({theme}) => ({
  width: '94px',
  height: '49px',
  margin: 0,
  borderRadius: 0,
  backgroundColor: theme.palette.primary.dark,
  '&:hover': {
    fontWeight: 'bolder',
    backgroundColor: theme.palette.primary.dark,
  },
  fontFamily: 'Lato',
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

const AddQuestionMenu: React.FunctionComponent<{
  onSelectQuestion: (a: any) => void
}> = ({onSelectQuestion}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedQuestionName, setSelectedQuestionName] = React.useState<
    QuestionTypeKey | undefined
  >()
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onSelect = (option: React.ReactNode, name: QuestionTypeKey) => {
    setSelectedQuestionName(name)
    handleClose()
  }

  return (
    <>
      <SelectButton
        id="select-survey-question"
        aria-controls={open ? 'select-survey-question' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowUpIcon />}>
        {selectedQuestionName ? (
          <QuestionTypeDisplay name={selectedQuestionName} />
        ) : (
          'Select Option'
        )}
      </SelectButton>
      <StyledMenu
        id="select-survey-question-menu"
        MenuListProps={{
          'aria-labelledby': 'select-survey-question-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        {Array.from(QUESTIONS.keys()).map(name => (
          <MenuItem
            key={name}
            onClick={() => onSelect(<QuestionTypeDisplay name={name} />, name)}
            disableRipple>
            <QuestionTypeDisplay name={name} />
          </MenuItem>
        ))}
      </StyledMenu>
      <StyledButton
        color="primary"
        disabled={!selectedQuestionName}
        onClick={() => {
          onSelectQuestion(selectedQuestionName)
        }}>
        Add
      </StyledButton>
    </>
  )
}

export default AddQuestionMenu
