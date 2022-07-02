import SurveyUtils from '@components/surveys/SurveyUtils'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import {latoFont} from '@style/theme'
import {ChoiceQuestion, ChoiceQuestionChoice} from '@typedefs/surveys'
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

const StyledMenuItem = styled(MenuItem, {label: 'StyledMenuItem'})(
  ({theme}) => ({
    height: '48px',
    backgroundColor: '#565656',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#848484',
    },
  })
)

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

const OPTIONS = new Map([
  ['ALL', '+ All of the above'],
  ['NONE', '+ None of the above'],
  ['OTHER', '+ Add "Other"'],
])

const QuestionPhoneBottomMenu: FunctionComponent<{
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
    const numbRegularQuestions =
      SurveyUtils.getNumberOfRegularQuestions(choices)

    choices.splice(numbRegularQuestions, 0, newChoice)
    return choices
  }

  const addGenericResponse = (optionKey: string) => {
    switch (optionKey) {
      case 'ALL':
        const choices = addAfterRegularQuestions([...(step.choices || [])], {
          text: 'All of the above',
          selectorType: 'all',
        })
        onChange({...step, choices})
        break
      case 'NONE':
        // NONE is always the last
        let newChoicesNone: ChoiceQuestionChoice[] = [
          ...(step.choices || []),
          {text: 'None of the above', selectorType: 'exclusive'},
        ]

        onChange({...step, choices: newChoicesNone})
        break
      case 'OTHER':
        onChange({...step, other: {type: 'string'}})
        break
    }
    setAnchorEl(null)
  }

  const addResponse = () => {
    const numberOfChoices = SurveyUtils.getNumberOfRegularQuestions(
      step.choices
    )
    const nextLetter = String.fromCharCode(numberOfChoices + 65)
    const text = `Choice ${nextLetter.toUpperCase()}`

    const choices = addAfterRegularQuestions([...(step.choices || [])], {
      text: text,
      value: text,
    })

    onChange({...step, choices})
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isDisabled = (optionKey: string): boolean => {
    switch (optionKey) {
      case 'ALL':
        return (
          step.choices?.find(q => q.text === 'All of the above') !== undefined
        )
      case 'NONE':
        return (
          step.choices?.find(q => q.text === 'None of the above') !== undefined
        )
      case 'OTHER':
        return step.other !== undefined
      default: {
        return false
      }
    }
  }

  const getOptions = (): string[] => {
    const keyArray = Array.from(OPTIONS.keys())
    if (step.singleChoice) {
      console.log(keyArray)
      const result = keyArray.filter(optionKey => optionKey === 'OTHER')
      console.log('result', result)
      return result
    }
    return keyArray
  }

  return (
    <PhoneBottom>
      {/*  <PhoneBottomDiv id="phoneBottom">*/}
      <Button variant="text">
        <Label sx={{color: '#2A2A2A'}} onClick={() => addResponse()}>
          {' '}
          + Add Response{' '}
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
          {getOptions().map(optionKey => (
            <StyledMenuItem
              key={optionKey}
              disabled={isDisabled(optionKey)}
              onClick={() => addGenericResponse(optionKey)}>
              {OPTIONS.get(optionKey)}
            </StyledMenuItem>
          ))}
        </StyledMenu>
      </SideMenu>
      {/*</PhoneBottomDiv>*/}
    </PhoneBottom>
  )
}

export default QuestionPhoneBottomMenu
