import {ReactComponent as MoreArrow} from '@assets/static/more_arrow.svg'
import {styled} from '@mui/material/styles'
import {colors} from '@style/staticPagesTheme'
import {Link, LinkProps} from 'react-router-dom'

const StyledLink = styled(Link)(({theme}) => ({
  color: colors.accent,
  fontSize: '14px',
  textDecoration: 'none',
  width: 'fit-content',
  display: 'flex',
  lineHeight: '14px',
  flexDirection: 'row',
  alignItems: 'center',

  '&:hover': {
    color: colors.primaryDarkBlue,
    '> svg path': {
      fill: colors.primaryDarkBlue,
    },
  },
  '&:focus': {
    color: colors.neutralsBlack,
    '> svg path': {
      fill: colors.neutralsBlack,
    },
  },
  '&:disabled': {
    color: colors.neutralsWhiteBlue,
    '> svg path': {
      fill: colors.neutralsWhiteBlue,
    },
  },
}))

const BlueStyledLink: React.FunctionComponent<LinkProps> = ({
  children,
  ...rest
}) => {
  return (
    <StyledLink {...rest}>
      {children}&nbsp;&nbsp;
      <MoreArrow />
    </StyledLink>
  )
}

export default BlueStyledLink
