import React from 'react'
import {Box, makeStyles, Tooltip} from '@material-ui/core'
import ItalicI from '../../assets/italic_i_icon.svg'
import {latoFont, ThemeType} from '../../style/theme'

interface StyleProps {
  backgroundColor: string
}

const useStyles = makeStyles<ThemeType, StyleProps>(theme => ({
  container: {
    backgroundColor: '#8FD6FF',
    width: '18px',
    height: '18px',
    borderRadius: '9px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'italic',
    boxShadow: '0 2px 2px rgb(0, 0, 0, 0.25)',
  },
  toolTip: props => ({
    backgroundColor: props.backgroundColor,
    boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.2)',
  }),
  arrow: {
    backgroundColor: 'transparent',
    color: '#8FD6FF',
    fontSize: '15px',
  },
  descriptionContainer: {
    backgroundColor: '#8FD6FF',
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

const InfoCircleWithToolTip: React.FunctionComponent<{
  tooltipDescription: React.ReactNode
  backgroundColor?: string
}> = ({tooltipDescription, backgroundColor}) => {
  const classes = useStyles({backgroundColor: backgroundColor || '#8FD6FF'})
  return (
    <Box>
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
