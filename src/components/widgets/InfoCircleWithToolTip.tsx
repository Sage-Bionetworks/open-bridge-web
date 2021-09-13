import {Box, makeStyles, Tooltip} from '@material-ui/core'
import React, {CSSProperties} from 'react'
import ItalicI from '../../assets/italic_i_icon.svg'
import {latoFont, ThemeType} from '../../style/theme'

enum VariantEnum {
  info = '#8FD6FF',
  warning = '#8FD6FF',
}
interface StyleProps {
  variant: keyof typeof VariantEnum
}

const useStyles = makeStyles<ThemeType, StyleProps>(theme => ({
  container: props => ({
    backgroundColor: VariantEnum[props.variant],
    width: '18px',
    height: '18px',
    borderRadius: '9px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'italic',
    boxShadow: '0 2px 2px rgb(0, 0, 0, 0.25)',
  }),
  toolTip: props => ({
    backgroundColor: VariantEnum[props.variant],
    boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.2)',
  }),
  arrow: props => ({
    backgroundColor: 'transparent',
    color: VariantEnum[props.variant],
    fontSize: '15px',
  }),
  descriptionContainer: props => ({
    backgroundColor: VariantEnum[props.variant],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontFamily: latoFont,
    fontStyle: 'italic',
    fontSize: '15px',
    lineHeight: '18px',
    padding: theme.spacing(1.25, 1.25),
  }),
}))

const InfoCircleWithToolTip: React.FunctionComponent<
  {
    tooltipDescription: React.ReactNode

    style?: CSSProperties
  } & StyleProps
> = ({tooltipDescription, style, variant = 'info'}) => {
  const classes = useStyles({variant: 'info'})
  return (
    <Box style={style}>
      <Tooltip
        placement="right"
        arrow
        title={
          <Box className={classes.descriptionContainer}>
            {tooltipDescription}
          </Box>
        }
        classes={{
          tooltip: classes.toolTip,
          arrow: classes.arrow,
        }}>
        <Box className={classes.container}>
          <img src={ItalicI} alt="italic_i_icon"></img>
        </Box>
      </Tooltip>
    </Box>
  )
}

export default InfoCircleWithToolTip
