import SurveyUtils from '@components/surveys/SurveyUtils'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {Box, Typography} from '@mui/material'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import {latoFont} from '@style/theme'
import {ChoiceQuestion, ChoiceQuestionChoice, ChoiceSelectorType} from '@typedefs/surveys'
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
  backgroundColor: '#565656',
  color: '#fff',
  '&:hover': {
    backgroundColor: nohover ? '#565656' : '#848484',
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
type SelectorOptionType = 'ALL' | 'NONE' | 'OTHER'
const OPTIONS = new Map<
  SelectorOptionType,
  {
    selectDisplayLabel: string
    defaultText: string
    selectorType: ChoiceSelectorType
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
])

// 'other' option is disabled when the question type is integer
const DisabledOtherMenuItem: FunctionComponent = () => {
  return (
    <StyledMenuItem height="120px" key={'OTHER'} nohover={true} onClick={void 0} disabled={true}>
      <Box height="100px" marginTop="16px">
        <Typography sx={{opacity: 0.3, color: '#fff'}}> +Add "Other"</Typography>
        <Box
          sx={{
            fontFamily: latoFont,
            marginTop: '16px',
            fontSize: '16px',
            fontStyle: 'italic',
            fontWeight: '400',
            lineHeight: '19px',
            letterSpacing: '0em',
            textAlign: 'left',
            whiteSpace: 'normal',
            width: '170px',
          }}>
          Other is only available when Reponse Value Pairing is set to String
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

  const isDisabled = (optionKey: string): boolean => {
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

  const getOptions = (): SelectorOptionType[] => {
    const keyArray = Array.from(OPTIONS.keys())
    //for single choice only add other. If it's an integer value 'other' is disabled
    if (step.singleChoice) {
      const result = keyArray.filter(optionKey => optionKey === 'OTHER')

      return result
    }
    return keyArray
  }

  return (
    <PhoneBottom>
      <Button
        variant="text"
        onClick={() => {
          addResponse()
        }}>
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
          {getOptions().map(optionKey => (
            <StyledMenuItem
              key={optionKey}
              disabled={isDisabled(optionKey)}
              onClick={() => addGenericResponse(optionKey)}>
              {OPTIONS.get(optionKey)?.selectDisplayLabel}
            </StyledMenuItem>
          ))}
          {step.baseType === 'string' ? (
            <StyledMenuItem key="OTHER" disabled={isDisabled('OTHER')} onClick={() => addGenericResponse('OTHER')}>
              + Add "Other"
            </StyledMenuItem>
          ) : (
            <DisabledOtherMenuItem />
          )}
        </StyledMenu>
      </SideMenu>
    </PhoneBottom>
  )
}

export default SelectPhoneBottomMenu
