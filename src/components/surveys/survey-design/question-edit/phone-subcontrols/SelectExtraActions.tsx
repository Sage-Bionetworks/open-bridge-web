import {ReactComponent as SortIcon} from '@assets/surveys/actions/sort.svg'
import {ReactComponent as ReverseSortIcon} from '@assets/surveys/actions/sort_reverse.svg'
import {Box, Button, styled} from '@mui/material'
import {FunctionComponent} from 'react'

const StyledButton = styled(Button)(({theme}) => ({
  background: '#F9F9F9',
  color: '#000',
  boxShadow: ' 1px 2px 3px rgba(42, 42, 42, 0.1)',

  marginBottom: theme.spacing(2),
  textAlign: 'left',
  height: '43px',
  width: '104px',
  fontWeight: 500,
  fontSize: '16px',
  justifyContent: 'flex-start',
  '& svg': {
    marginRight: theme.spacing(0.75),
  },
}))

const SelectExtraActions: FunctionComponent<{onSort: (d: -1 | 1) => void}> = ({onSort}) => {
  return (
    <Box
      sx={{
        position: 'absolute',

        width: '104px',
        top: '230px',
        left: 'calc(50% + 130px + 16px)',
        textAlign: 'left',
      }}>
      <StyledButton aria-label="sort alpha" onClick={() => onSort(1)}>
        <SortIcon /> A-Z
      </StyledButton>
      <StyledButton aria-label="sort reverse" onClick={() => onSort(-1)}>
        <ReverseSortIcon /> Reverse
      </StyledButton>
    </Box>
  )
}

export default SelectExtraActions
