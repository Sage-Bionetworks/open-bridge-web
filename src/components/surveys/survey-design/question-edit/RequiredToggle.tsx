import {ReactComponent as RequiredIcon} from '@assets/surveys/actions/require.svg'
import {ReactComponent as SkipIcon} from '@assets/surveys/actions/skip.svg'
import {StyledToggleButton, StyledToggleButtonGroup} from '@components/widgets/StyledComponents'

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
