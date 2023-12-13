import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone'
import {Box, SxProps, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import React, {CSSProperties} from 'react'

enum VariantEnum {
  info = '#8FD6FF',
  warning = '#8FD6FF',
}
interface StyleProps {
  variant: keyof typeof VariantEnum
}
const useStyles = makeStyles(theme => ({
  root: {},
  container: {
    /* backgroundColor: VariantEnum.info,
    width: '18px',
    height: '18px',
    borderRadius: '9px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'italic',
    boxShadow: '0 2px 2px rgb(0, 0, 0, 0.25)',*/
  },
  toolTip: {
    backgroundColor: VariantEnum.info,
    boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.2)',
  },
  arrow: {
    backgroundColor: 'transparent',
    color: VariantEnum.info,
    fontSize: '15px',
  },
  descriptionContainer: {
    backgroundColor: VariantEnum.info,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontFamily: latoFont,
    fontStyle: 'italic',
    fontSize: '15px',
    lineHeight: '18px',
    padding: theme.spacing(1.25, 1.25),
  },
}))

const InfoCircleWithToolTip: React.FunctionComponent<
  {
    tooltipDescription: React.ReactNode

    style?: CSSProperties
    sx?: SxProps
  } & StyleProps
> = ({tooltipDescription, style = {}, variant = 'info', sx = {}}) => {
  const classes = useStyles({variant: 'info'})
  return (
    <Box style={style} sx={sx}>
      <Tooltip
        placement="right"
        arrow
        title={<Box className={classes.descriptionContainer}>{tooltipDescription}</Box>}
        classes={{
          tooltip: classes.toolTip,
          arrow: classes.arrow,
        }}>
        <Box className={classes.container}>
          <InfoTwoToneIcon />
        </Box>
      </Tooltip>
    </Box>
  )
}

export default InfoCircleWithToolTip
