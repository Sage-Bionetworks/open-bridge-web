import {SimpleTextInput} from '@components/widgets/StyledComponents'
import {Box, Button, styled} from '@mui/material'
import {theme} from '@style/theme'
import {Step} from '@typedefs/surveys'
import {FunctionComponent} from 'react'
import {StyledLabel14} from '../widgets/SharedStyled'

const StyledContainer = styled('div')(({theme}) => ({
  // backgroundColor: '#464646',
  // padding: theme.spacing(3),
  border: '1px solid black',
  width: '425px',
  height: '100%',
}))

type QuestionEditProps = {
  step?: Step
  onChange: (step: Step) => void
}

const QuestionEditRhs: FunctionComponent<QuestionEditProps> = ({
  step,
  onChange,
  children,
}) => {
  console.log('reload' + step?.identifier)

  return (
    <StyledContainer>
      <Box
        id="identifier"
        sx={{backgroundColor: '#ECECEC;', padding: theme.spacing(3, 0, 3, 4)}}>
        <StyledLabel14 htmlFor="q_id">Question Identifier</StyledLabel14>
        <SimpleTextInput
          id="q_id"
          sx={{
            margin: '0!important',
            width: '220px',
            '& input': {width: '100%'},
          }}></SimpleTextInput>
        <Button
          variant="text"
          sx={{
            width: '150px',
            fontSize: '12px',
            textAlign: 'left',
            lineHeight: '14px',
            textDecoration: 'underline',
          }}>
          Match Identifier to Question
        </Button>
      </Box>
      {children}
    </StyledContainer>
  )
}
export default QuestionEditRhs
