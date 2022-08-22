import {
  FakeInput,
  StyledLabel12,
} from '@components/surveys/widgets/SharedStyled'
import {styled} from '@mui/material'
import {theme} from '@style/theme'

const StyledContainer = styled('div', {label: 'StyledContainer'})(({}) => ({
  height: '100%',
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '> div': {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'flex-end',
    '> div:first-of-type': {
      marginRight: theme.spacing(1.5),
    },
  },
}))

const DurationTime: React.FunctionComponent<{
  type?: 'DURATION' | 'TIME'
}> = ({type = 'DURATION'}) => {
  return (
    <StyledContainer>
      <div>
        <div>
          <StyledLabel12 mb={0.5}>Hours</StyledLabel12>
          <FakeInput width={48} />
        </div>
        <div>
          <StyledLabel12 mb={0.5}>Mins</StyledLabel12>
          <FakeInput width={48} />
        </div>
        {type === 'TIME' && (
          <div style={{marginLeft: '8px', marginTop: '12px'}}>
            <StyledLabel12 mb={0.5}>AM</StyledLabel12>
            <FakeInput width={40} height={18} sx={{backgroundColor: '#8FD6FF'}}>
              <StyledLabel12 mb={0}>PM</StyledLabel12>
            </FakeInput>
          </div>
        )}
      </div>
    </StyledContainer>
  )
}

export default DurationTime
