//import {ReactComponent as SortIcon} from '@assets/surveys/actions/sort.svg'
//import {ReactComponent as ReverseSortIcon} from '@assets/surveys/actions/sort_reverse.svg'
import ReverseSortIcon from '@mui/icons-material/LoopTwoTone'
import SortIcon from '@mui/icons-material/SortTwoTone'
import {Box, Button, ButtonProps, styled} from '@mui/material'
import {FunctionComponent} from 'react'

const StyledButton = styled((props: ButtonProps) => <Button {...props} variant="outlined" />)(({theme}) => ({
  // background: '#F9F9F9',
  //color: '#000',
  // boxShadow: ' 1px 2px 3px rgba(42, 42, 42, 0.1)',

  marginBottom: theme.spacing(2),
  textAlign: 'left',
  width: '120px',
  padding: 0,
  //height: '43px',
  // width: '104px',
  // fontWeight: 500,
  // fontSize: '16px',
  justifyContent: 'center',
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
        top: '210px',
        left: 'calc(50% + 155px + 16px)',
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
