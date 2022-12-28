import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {Box, Drawer, IconButton} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {theme, ThemeType} from '@style/theme'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'

interface StyleProps {
  maxWidth: number
  height: string
  collapsedHight: string
  overflow: 'auto' | 'visible' | 'hidden'
}

const useStyles = makeStyles<ThemeType>((theme: ThemeType) => ({
  drawerToolbar: {
    //  display: 'flex',
    //   height: theme.spacing(9),
    position: 'relative',
    backgroundColor: 'white',
    height: '70px',

    padding: theme.spacing(6, 0, 2.5, 4),
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // textAlign: 'center',
  },
  drawerClose: {
    overflowX: 'hidden',
    width: 0, //theme.spacing(6),
    //  [theme.breakpoints.up('sm')]: {
    // width: theme.spacing(6),
    // },
  },
  drawerPaper: {
    fontSize: '14px',
    position: 'static',
    border: 'none',
    height: 'auto',
    width: '100%',
    /// backgroundColor: '#F1F3F5',
    // boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  },

  mainAreaWrapper: {
    textAlign: 'center',
    flexGrow: 1,
  },
  mainArea: {
    margin: '0 auto',
    minHeight: '100px',
  },
  mainAreaNormal: {
    width: `${280 * 3 + 16 * 3}px`,
    [theme.breakpoints.down('lg')]: {
      width: `${280 * 2 + 16 * 2}px`,
    },
  },

  mainAreaWider: {
    width: `${280 * 4 + 16 * 3}px`,
    [theme.breakpoints.down('lg')]: {
      width: `760px`,
    },
  },
  mainAreaWide: {
    width: `${280 * 4 + 16 * 4}px`,
    [theme.breakpoints.down('lg')]: {
      width: `${280 * 3 + 16 * 3}px`,
    },
  },
}))

type CollapsibleLayoutProps = {
  isWide?: boolean
  isOpen?: boolean
  expandedWidth?: number
  isHideContentOnClose?: boolean
  isFullWidth?: boolean
  isFullHeight?: boolean
  children: React.ReactNode[]
  isDrawerHidden?: boolean
  collapseButton?: JSX.Element
  expandButton?: JSX.Element
  toggleButtonStyle?: React.CSSProperties
  onToggleClick: Function
}

const CollapsibleLayout: FunctionComponent<CollapsibleLayoutProps> = ({
  isWide,
  expandedWidth = 300,
  isFullWidth,
  isFullHeight = true,
  children,
  isHideContentOnClose,
  isDrawerHidden,
  collapseButton,
  expandButton,
  toggleButtonStyle,
  onToggleClick,
  isOpen,
}) => {
  const styleProps: StyleProps = {
    maxWidth: expandedWidth, //+ 'px',
    collapsedHight: isHideContentOnClose ? '72px' : 'auto',
    overflow: isHideContentOnClose ? 'hidden' : 'auto',
    height: isFullHeight ? '100%' : 'auto',
  }
  const classes = useStyles()
  //  const [isOpen, setIsOpen] = React.useState(false)
  const closeIcon = collapseButton || <ChevronLeftIcon />
  const openIcon = expandButton || <ChevronRightIcon />
  const toggleStyle: React.CSSProperties = toggleButtonStyle || {
    borderRadius: 0,
    width: '48px',
    height: '100%',
  }

  React.useEffect(() => {
    if (onToggleClick) {
      onToggleClick(isOpen)
    }
  }, [isOpen])
  return (
    <>
      <Box display="flex" position="relative">
        <Drawer
          variant="permanent"
          elevation={1}
          className={clsx({
            [classes.drawerClose]: !isOpen,
          })}
          classes={{
            paper: clsx(classes.drawerPaper, {
              [classes.drawerClose]: !isOpen,
            }),
          }}
          sx={{
            width: isOpen ? styleProps.maxWidth : theme.spacing(6),
            flexShrink: 0,
            height: !isOpen ? styleProps.collapsedHight : 'inherit',
            overflowY: !isOpen ? styleProps.overflow : 'inherit',
            whiteSpace: 'nowrap',
            display: isDrawerHidden ? 'none' : 'inherit',
          }}>
          <Box className={classes.drawerToolbar}>
            <IconButton
              onClick={() => onToggleClick(!isOpen)}
              style={toggleStyle}
              size="large"
              sx={{position: 'absolute', top: '0', right: '0'}}>
              {isOpen ? closeIcon : openIcon}
            </IconButton>
            {children.length === 3 && isOpen && children[2]}
          </Box>
          <Box style={isOpen ? {} : {display: 'none'}}>{children[0]}</Box>
        </Drawer>
        <Box className={classes.mainAreaWrapper}>
          <Box
            className={clsx(classes.mainArea, {
              [classes.mainAreaNormal]: isOpen,
              [classes.mainAreaWider]: isOpen && isWide,
              [classes.mainAreaWide]: !isOpen,
            })}
            style={isFullWidth ? {width: '100%'} : {}}>
            {children[1]}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default CollapsibleLayout
