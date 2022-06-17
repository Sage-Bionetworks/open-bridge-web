import {ReactComponent as RequiredIcon} from '@assets/surveys/actions/require.svg'
import {ReactComponent as SkipIcon} from '@assets/surveys/actions/skip.svg'
import {styled, ToggleButton, ToggleButtonGroup} from '@mui/material'
import {latoFont} from '@style/theme'
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
  isRequired: boolean
  onChange: (r: boolean) => void
}

const RequiredToggle: FunctionComponent<RequiredToggleProps> = ({
  isRequired,
  onChange,
}) => {
  return (
    <StyledToggleButtonGroup
      value={isRequired}
      exclusive
      onChange={(e, _val) => onChange(_val)}
      aria-label="text alignment">
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
