import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone'
import {Box, Paper, styled, Typography} from '@mui/material'
import {shouldForwardProp} from '@style/theme'
import {Assessment} from '@typedefs/types'
import {FunctionComponent} from 'react'
import AssessmentImage from './AssessmentImage'

const AssessmentSmallCard = styled(Paper, {label: 'StyledCard', shouldForwardProp: shouldForwardProp})<{
  $isReadOnly: boolean
  $isDragging: boolean
}>(({theme, $isReadOnly, $isDragging}) => ({
  display: 'flex',
  padding: $isDragging ? '5px' : 0,
  marginBottom: theme.spacing(1),
  boxShadow: $isReadOnly ? 'none' : '0px 2px 2px rgba(0, 0, 0, 0.25)',
  '&  svg': {display: 'none', fontSize: '12px'},
  '&:hover': {
    border: $isReadOnly ? 'none' : `2px solid ${theme.palette.accent.purple}`,
    '&  svg': {
      display: $isReadOnly ? 'none' : 'block',
      position: 'absolute',
      right: '5px',

      top: '0',
      bottom: '0',
      margin: 'auto',
    },
  },
}))

const StyledTextArea = styled(Box, {label: 'StyledTextArea'})(({theme}) => ({
  padding: theme.spacing(1),
  paddingRight: theme.spacing(3),
  backgroundColor: '#fff',
  position: 'relative',
  overflow: 'hidden',
  flexGrow: 1,
  textAlign: 'left',
}))

const StyledTImageWrapper = styled(Box, {label: 'StyledTImageWrapper'})(({theme}) => ({
  width: '104px',
  height: '96px',
  flexShrink: 0,
  display: 'flex',
  alignContent: 'space-around',
  justifyContent: 'space-around',
  overflow: 'hidden',
}))

type AssessmentSmallOwnProps = {
  assessment: Assessment
  isDragging?: boolean
  isHideDuration?: boolean
  isReadOnly?: boolean
}

type AssessmentSmallProps = AssessmentSmallOwnProps

const AssessmentSmall: FunctionComponent<AssessmentSmallProps> = ({
  assessment,
  isDragging,
  isHideDuration,
  isReadOnly = false,
  children,
}) => {
  return (
    <AssessmentSmallCard $isReadOnly={isReadOnly} $isDragging={!!isDragging}>
      <StyledTImageWrapper>
        <AssessmentImage variant="small" resources={assessment.resources} name={assessment.title}></AssessmentImage>
      </StyledTImageWrapper>
      <StyledTextArea>
        <MenuTwoToneIcon sx={{fontSize: '12px'}} />
        <Typography variant="body1">
          {assessment.title}

          {!isHideDuration && <Typography sx={{color: '#878E95'}}>{assessment.minutesToComplete} min</Typography>}
        </Typography>
        {children}
      </StyledTextArea>
    </AssessmentSmallCard>
  )
}

export default AssessmentSmall
