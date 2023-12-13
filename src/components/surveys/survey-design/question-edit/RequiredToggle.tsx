import {StyledToggleButton, StyledToggleButtonGroup} from '@components/widgets/StyledComponents'
import SkipIcon from '@mui/icons-material/SkipNextTwoTone'
import RequiredIcon from '@mui/icons-material/StarTwoTone'

import {ActionButtonName} from '@typedefs/surveys'
import {FunctionComponent} from 'react'

type RequiredToggleProps = {
  shouldHideActionsArray: ActionButtonName[]
  onChange: (hideActions: ActionButtonName[]) => void
}

const RequiredToggle: FunctionComponent<RequiredToggleProps> = ({shouldHideActionsArray, onChange}) => {
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
      width={300}
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
