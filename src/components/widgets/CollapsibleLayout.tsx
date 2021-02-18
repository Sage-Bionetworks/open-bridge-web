import { Box, Drawer, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { ThemeType } from '../../style/theme'

interface StyleProps {
  maxWidth: string
  height: string
  collapsedHight: string
  overflow: 'auto' | 'visible' | 'hidden'
}

const useStyles = makeStyles<ThemeType, StyleProps>((theme: ThemeType) => ({
  drawer: props => ({
    width: props.maxWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  }),
  drawerOpen: props => ({
    width: props.maxWidth,
    /*transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),*/
  }),
  drawerToolbar: {
    display: 'flex',
    height: theme.spacing(6),
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
  },
  drawerClose: props => ({
    /* transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),*/
    height: props.collapsedHight,
    overflowY: props.overflow,
    overflowX: 'hidden',
    width: theme.spacing(6),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(6),
    },
  }),
  drawerPaper: {
    fontSize: '14px',
    position: 'static',
    border: 'none',
    height: 'auto',
    backgroundColor: '#F2F2F2',
    boxShadow:
      '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
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
    [theme.breakpoints.down('md')]: {
      width: `${280 * 2 + 16 * 2}px`,
    },
  },

  mainAreaWider: {
    width: `${280 * 4 + 16 * 3}px`,
    [theme.breakpoints.down('md')]: {
      width: `760px`,
    },
  },
  mainAreaWide: {
    width: `${280 * 4 + 16 * 4}px`,
    [theme.breakpoints.down('md')]: {
      width: `${280 * 3 + 16 * 3}px`,
    },
  },
}))

type CollapsibleLayoutProps = {
  isWide?: boolean
  expandedWidth?: number
  isHideContentOnClose?: boolean
  isFullWidth?: boolean
  isFullHeight?: boolean
  children: React.ReactNode[]
  isDrawerHidden?: boolean
}

const CollapsibleLayout: FunctionComponent<CollapsibleLayoutProps> = ({
  isWide,
  expandedWidth = 300,
  isFullWidth,
  isFullHeight = true,
  children,
  isHideContentOnClose,
  isDrawerHidden,
}) => {
  const styleProps: StyleProps = {
    maxWidth: expandedWidth + 'px',
    collapsedHight: isHideContentOnClose ? '48px' : 'auto',
    overflow: isHideContentOnClose ? 'hidden' : 'auto',
    height: isFullHeight ? '100%' : 'auto',
  }
  const classes = useStyles(styleProps)
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <Box paddingTop={2} display="flex" position="relative">
        <Drawer
          variant="permanent"
          elevation={1}
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: isOpen,
            [classes.drawerClose]: !isOpen,
          })}
          classes={{
            paper: clsx(classes.drawerPaper, {
              [classes.drawerOpen]: isOpen,
              [classes.drawerClose]: !isOpen,
            }),
          }}
          style={isDrawerHidden ? { display: 'none' } : {}}
        >
          <Box className={classes.drawerToolbar}>
            {children.length === 3 && isOpen && children[2]}
            <IconButton
              onClick={() => setIsOpen(prev => !prev)}
              style={{ borderRadius: 0, width: '48px', height: '100%' }}
            >
              {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
          {children[0]}
        </Drawer>
        <Box className={classes.mainAreaWrapper}>
          <Box
            className={clsx(classes.mainArea, {
              [classes.mainAreaNormal]: isOpen,
              [classes.mainAreaWider]: isOpen && isWide,
              [classes.mainAreaWide]: !isOpen,
            })}
            style={isFullWidth ? { width: '100%' } : {}}
          >
            {children[1]}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default CollapsibleLayout
