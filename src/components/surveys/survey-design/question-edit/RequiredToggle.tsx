import {ReactComponent as RequiredIcon} from '@assets/surveys/actions/require.svg'
import {ReactComponent as SkipIcon} from '@assets/surveys/actions/skip.svg'
import {styled, ToggleButton, ToggleButtonGroup} from '@mui/material'
import {latoFont} from '@style/theme'
import {ActionButtonName} from '@typedefs/surveys'
import {FunctionComponent} from 'react'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({theme}) => ({
  background: '#EDEDED',
  justifyContent: 'space-between',
  boxShadow: 'inset 0px 1px 4px rgba(0, 0, 0, 0.25)',
  width: '255px',
  borderRadius: '25px',
  padding: theme.spacing(0.25),
}))

const StyledToggleButton = styled(ToggleButton)(({theme}) => ({
  padding: theme.spacing(0.25, 1),
  borderRadius: '25px',
  fontFamily: latoFont,
  fontSize: '14px',
  border: 'none',
  '&.MuiToggleButtonGroup-grouped:not(:last-of-type), &.MuiToggleButtonGroup-grouped:not(:first-of-type)':
    {
      borderRadius: '25px',
      '&.Mui-selected': {
        backgroundColor: '#fff',
        color: '##565656',
        borderRadius: '25px',
      },
    },
}))

type RequiredToggleProps = {
  shouldHideActionsArray: ActionButtonName[]
  onChange: (hideActions: ActionButtonName[]) => void
}

const RequiredToggle: FunctionComponent<RequiredToggleProps> = ({
  shouldHideActionsArray,
  onChange,
}) => {
  const sendUpdate = (value: boolean | null) => {
    if (value === null) {
      return
    }
    if (value === true && !shouldHideActionsArray.includes('skip')) {
      onChange([...shouldHideActionsArray, 'skip'])
    }
    if (value === false && shouldHideActionsArray.includes('skip')) {
      onChange(shouldHideActionsArray.filter(a => a !== 'skip'))
    }
  }
  return (
    <StyledToggleButtonGroup
      value={shouldHideActionsArray.includes('skip')}
      exclusive
      onChange={(e, _val) => {
        sendUpdate(_val)
      }}
      aria-label="allow skipping question">
      <StyledToggleButton value={true} aria-label="make required">
        <RequiredIcon />
        &nbsp; Make Required
      </StyledToggleButton>

      <StyledToggleButton value={false} aria-label="allow skip">
        <SkipIcon />
        &nbsp; Allow Skip
      </StyledToggleButton>
    </StyledToggleButtonGroup>
  )
}

export default RequiredToggle
