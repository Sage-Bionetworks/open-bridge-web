import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Button from '@mui/material/Button'
import Menu, {MenuProps} from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import {theme} from '@style/theme'
import * as React from 'react'
import QUESTIONS, {QuestionTypeKey} from './QuestionConfigs'
import QuestionTypeDisplay from './QuestionTypeDisplay'

const SelectButton = styled(Button)(({theme}) => ({
  width: '100%',
  textAlign: 'left',
  backgroundColor: '#F1F3F5',
  justifyContent: 'space-between',
  color: '#353A3F',
  border: 'none',
  padding: theme.spacing(1, 2),
  height: theme.spacing(4),
  fontWeight: 400,
  fontSize: '14px',
  // minHeight: theme.spacing(4),
  paddingRight: theme.spacing(2),
  '& .MuiButton-endIcon': {
    color: '#3A3A3A',
  },

  '&:hover, :active, :focus': {
    fontWeight: 'bold',
    backgroundColor: '#F1F3F5',
    // backgroundColor: '#F2F2F2',
  },
}))

const StyledMenu = styled((props: MenuProps) => (
  // styled element with markup
  <Menu
    elevation={0}
    sx={{width: '100%'}}
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
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      padding: 0,
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        // color: 'green',
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        // backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}))

const AddQuestionMenu: React.FunctionComponent<{
  onSelectQuestion: (a: any) => void
}> = ({onSelectQuestion}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedQuestionName, setSelectedQuestionName] = React.useState<QuestionTypeKey | undefined>()
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
        {selectedQuestionName ? <QuestionTypeDisplay name={selectedQuestionName} /> : 'Select Option'}
      </SelectButton>

      <StyledMenu
        id="select-survey-question-menu"
        MenuListProps={{
          'aria-labelledby': 'select-survey-question-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        {Array.from(QUESTIONS.keys())
          .filter(key => key !== 'COMPLETION' && key !== 'OVERVIEW')
          .map(name => (
            <MenuItem key={name} onClick={() => onSelect(<QuestionTypeDisplay name={name} />, name)} disableRipple>
              <QuestionTypeDisplay name={name} />
            </MenuItem>
          ))}
      </StyledMenu>

      <Button
        sx={{marginTop: theme.spacing(2)}}
        color="primary"
        variant="contained"
        size="small"
        disabled={!selectedQuestionName}
        onClick={() => {
          onSelectQuestion(selectedQuestionName)
        }}>
        Add
      </Button>
    </>
  )
}

export default AddQuestionMenu
