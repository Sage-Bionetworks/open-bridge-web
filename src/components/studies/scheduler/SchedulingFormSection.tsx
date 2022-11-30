import {Box, styled} from '@mui/material'
import {latoFont, theme} from '@style/theme'
import React, {ReactElement, ReactNode} from 'react'

const StyledLabel = styled('label', {label: 'StyledLabel'})(({theme}) => ({
  fontFamily: latoFont,
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '16px',
  display: 'block',
  marginRight: '5px',
}))

const StyledSection = styled('section', {label: 'StyledSection'})(({theme}) => ({
  padding: theme.spacing(2, 4, 2, 0),
  textAlign: 'left',
  marginBottom: theme.spacing(2),
}))

const Header = styled(Box, {label: 'Header'})(({theme}) => ({
  display: 'flex',
  alignItem: 'center',

  justifyContent: 'space-between',
  '&> div': {
    display: 'flex',
    alignItems: 'center',
  },
}))

export interface SchedulingFormSectionProps {
  label: ReactNode
  rightElement?: ReactElement
  postLabel?: ReactElement
  isRequired?: boolean
  altLabel?: string
  children: ReactNode
  style?: React.CSSProperties

  justifyContent?: 'flex-start' | 'space-between'

  border?: boolean
  isHideLabel?: boolean

  disabled?: boolean
}

function getLabel(isRequired?: boolean, label?: ReactNode) {
  if (isRequired) {
    return (
      <Box display="flex" alignItems="center">
        {label}
        <span style={{color: theme.palette.secondary.main, marginLeft: '1px'}}>*</span>
      </Box>
    )
  }
  return label
}

const SchedulingFormSection: React.FunctionComponent<SchedulingFormSectionProps> = ({
  label,
  rightElement,
  isRequired,
  children,
  isHideLabel,
  postLabel,
  justifyContent = 'flex-start',
  style,
  border = true,

  disabled = false,
}: SchedulingFormSectionProps) => {
  console.log(style)
  return (
    <>
      <StyledSection
        sx={{
          borderBottom: border === false ? 'none' : '1px solid #EAECEE',
          opacity: disabled ? 0.3 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
          ...style,
        }}>
        <Box sx={{justifyContent: justifyContent}}>
          <Header sx={{marginBottom: rightElement || postLabel ? theme.spacing(2) : theme.spacing(0.5)}}>
            <div>
              <StyledLabel>{isHideLabel ? '' : getLabel(isRequired, label)}</StyledLabel> {postLabel}
            </div>
            {
              rightElement
              /* React.cloneElement(rightElement, {sx: {position: 'absolute', top: '-20px', right: '-10px'}})*/
            }
          </Header>
          {children}
        </Box>
      </StyledSection>
    </>
  )
}

export default SchedulingFormSection
