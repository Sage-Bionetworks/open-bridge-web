import SurveyUtils from '@components/surveys/SurveyUtils'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {Box} from '@mui/material'

import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import {latoFont, theme} from '@style/theme'
import {ChoiceQuestion, ChoiceQuestionChoice, ChoiceSelectorType} from '@typedefs/surveys'
import React, {FunctionComponent} from 'react'

const PhoneBottom = styled('div', {label: 'phoneBottom'})({
  position: 'absolute',

  bottom: '0px',
  left: '5px',
  height: '48px',
  width: '283px',
  display: 'flex',
  borderRadius: '0px 0px 0px 25px',

  // borderBottom: 'none',
  '& .MuiButton-text': {
    background: theme.palette.primary.main,
    width: '100%',
    height: '100%',
    borderBottom: '3px solid #D0D4D9',
    borderLeft: '3px solid #D0D4D9',
    borderRadius: '0px 0px 0px 25px',
    '& label': {
      cursor: 'pointer',
      alignItems: 'center',
      color: '#fff',
      display: 'flex',
    },

    '&:hover': {
      background: theme.palette.primary.main,
      fontWeight: 900,
    },
  },
})

const SideMenu = styled('div', {label: 'sideMenu'})({
  marginRight: '3px',
  height: '48px',
  width: '40px',
  display: 'flex',
  backgroundColor: '#9499C7',
  borderRadius: '0px 0 25px 0',
  borderBottom: '3px solid #D0D4D9',
  borderRight: '3px solid #D0D4D9',
  '&  svg': {
    color: '#fff',
  },
})

const StyledMenu = styled(Menu, {label: 'StyledMenu'})(({theme}) => ({
  '& .MuiPaper-root': {
    borderRadius: 0,
    ' & > ul': {
      padding: 0,
    },
  },
}))

const StyledMenuItem = styled(MenuItem, {label: 'StyledMenuItem'})<{
  height?: string
  nohover?: boolean
}>(({theme, height = '48px', nohover = false}) => ({
  height: height,
  backgroundColor: '#9499C7',
  color: '#fff',
  '&:hover': {
    backgroundColor: nohover ? '#9499C7' : '#848484',
    cursor: nohover ? 'default' : 'pointer',
  },
  '&.Mui-disabled': {
    opacity: 1,
  },
}))

const Label = styled('label')({
  fontFamily: latoFont,
  fontWeight: 600,
  fontSize: '16px',
})

/* Note:
  	"type": "choiceQuestion",
  "other" : { "type" : "string" }  
  {
    "text" : "All of the above",
    "selectorType" : "all"
  },
  {
    "text" : "None of the above",
    "selectorType" : "exclusive"
  }*/
type SelectorOptionType = 'ALL' | 'NONE' | 'OTHER' | 'NO_OPTIONS'
const OPTIONS = new Map<
  SelectorOptionType,
  {
    selectDisplayLabel: string
    defaultText: string
    selectorType?: ChoiceSelectorType
  }
>([
  [
    'ALL',
    {
      selectDisplayLabel: '+ All of the above',
      defaultText: 'All of the above',
      selectorType: 'all',
    },
  ],
  [
    'NONE',
    {
      selectDisplayLabel: '+ None of the above',
      defaultText: 'None of the above',
      selectorType: 'exclusive',
    },
  ],
  [
    'OTHER',
    {
      selectDisplayLabel: '+ Add "Other"',
      defaultText: 'Other',
    },
  ],
])

const NoMenuItemOptions: FunctionComponent = () => {
  return (
    <StyledMenuItem height="80px" key={'NO_OPTIONS'} nohover={true} onClick={void 0} disabled={true}>
      <Box height="60px" >
        <Box
          sx={{
            fontFamily: latoFont,
            marginTop: '0px',
            fontSize: '16px',
            fontStyle: 'italic',
            fontWeight: '400',
            lineHeight: '19px',
            letterSpacing: '0em',
            textAlign: 'left',
            whiteSpace: 'normal',
            width: '220px',
          }}>
          There are no additional options for this combination of Question Type and Response Value.
        </Box>
      </Box>
    </StyledMenuItem>
  )
}

const SelectPhoneBottomMenu: FunctionComponent<{
  step: ChoiceQuestion
  onChange: (s: ChoiceQuestion) => void
}> = ({step, onChange}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const addAfterRegularQuestions = (
    choices: ChoiceQuestionChoice[],
    newChoice: ChoiceQuestionChoice
  ): ChoiceQuestionChoice[] => {
    const numbRegularQuestions = SurveyUtils.getNumberOfRegularSelectChoices(choices)

    choices.splice(numbRegularQuestions, 0, newChoice)
    return choices
  }

  const addGenericResponse = (optionKey: SelectorOptionType) => {
    if (optionKey === 'OTHER') {
      onChange({...step, other: {type: 'string'}})
    } else {
      const c = OPTIONS.get(optionKey)!
      let newChoices: ChoiceQuestionChoice[]
      const choiceQ = {text: c.defaultText, selectorType: c.selectorType}
      if (optionKey === 'ALL') {
        newChoices = addAfterRegularQuestions([...(step.choices || [])], choiceQ)
      } else {
        // NONE is always the last
        newChoices = [...(step.choices || []), choiceQ]
      }

      onChange({...step, choices: newChoices})
    }

    setAnchorEl(null)
  }

  const addResponse = () => {
    const numberOfChoices = SurveyUtils.getNumberOfRegularSelectChoices(step.choices)

    const nextLetter = String.fromCharCode(numberOfChoices + 65)
    const text = `Choice ${nextLetter.toUpperCase()}`

    const newChoice = {
      text,
      value: step.baseType === 'string' ? text : numberOfChoices,
    }

    const choices = addAfterRegularQuestions([...(step.choices || [])], newChoice)

    onChange({...step, choices})
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isOptionAlreadyAdded = (optionKey: SelectorOptionType): boolean => {
    switch (optionKey) {
      case 'ALL':
        return step.choices?.find(q => q.selectorType === 'all') !== undefined
      case 'NONE':
        return step.choices?.find(q => q.selectorType === 'exclusive') !== undefined
      case 'OTHER':
        return step.other !== undefined
      default: {
        return false
      }
    }
  }

  const isOptionSupported = (optionKey: SelectorOptionType): boolean => {
    if (step.singleChoice ?? true) {
      // If this is a single choice step then *only* other is supported 
      return optionKey === 'OTHER' && step.baseType === 'string'
    } else {
      // If this is multiple answer then everything *but* Other is supported
      return optionKey !== 'OTHER'
    }
  }

  const getOptions = (): SelectorOptionType[] => {
    return Array.from(OPTIONS.keys()).filter(optionKey => isOptionSupported(optionKey) && !isOptionAlreadyAdded(optionKey))
  }

  const SpecialOptionsMenuItems: FunctionComponent = () => {
    let options = getOptions()
    return options.length === 0 ? <NoMenuItemOptions /> :
    <>
      {options.map(optionKey => (
        <StyledMenuItem
          key={optionKey}
          disabled={isOptionAlreadyAdded(optionKey)}
          onClick={() => addGenericResponse(optionKey)}>
          {OPTIONS.get(optionKey)?.selectDisplayLabel}
        </StyledMenuItem>
      ))}
    </>
  }

  return (
    <PhoneBottom>
      <Button
        variant="text"
        onClick={() => {
          addResponse()
        }}>
        <Label>
          <AddCircleTwoToneIcon />
          &nbsp; Add Response{' '}
        </Label>
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
          <SpecialOptionsMenuItems />
        </StyledMenu>
      </SideMenu>
    </PhoneBottom>
  )
}

export default SelectPhoneBottomMenu
