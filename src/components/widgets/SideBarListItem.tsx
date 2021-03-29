import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { poppinsFont, ThemeType } from '../../style/theme'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {},

  listItem: {
    color: theme.palette.action.active,
    paddingLeft: theme.spacing(2),

    '&$listItemActive': {
      borderLeft: '4px solid #BCD5E4',
      backgroundColor: '#FAFAFA',
      paddingLeft: theme.spacing(1.5),
    },
    '&$listItemCollapsed': {
      paddingLeft: theme.spacing(1),
    },
    '&$listItemActive&$listItemCollapsed': {
      paddingLeft: theme.spacing(0.5),
    },
    '&:hover': {
      backgroundColor: '#f7f7f7',
    },
  },
  studyBuilderListItem: {
    color: theme.palette.action.active,
    paddingLeft: theme.spacing(1),
    '&$listItemActive': {
      borderLeft: '4px solid #BCD5E4',
      backgroundColor: '#FAFAFA',
      paddingLeft: theme.spacing(0.5),
    },
    '&$listItemCollapsed': {
      paddingLeft: theme.spacing(0),
    },
    '&:hover': {
      backgroundColor: '#f7f7f7',
    },
  },
  listItemDark: {
    color: theme.palette.common.white,
    '& $linkLabel': {
      color: theme.palette.common.white,
    },

    '&$listItemActive': {
      borderLeft: '4px solid #FFE500',
      backgroundColor: '#444',
    },
    '&:hover': {
      backgroundColor: '#333',
    },
  },
  listItemActive: {},
  listItemCollapsed: {},

  link: {
    fontFamily: poppinsFont,

    width: '100%',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: 'inherit',
    },

    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  linkLabel: {
    justifyContent: 'flex-start',
    color: '#282828',
  },
}))

export interface SideBarListItemProps {
  isOpen: boolean
  isActive: boolean
  onClick: Function
  children: React.ReactNode
  variant?: 'light' | 'dark'
  styleProps?: string
  inStudyBuilder?: boolean
}

const SideBarListItem: React.FunctionComponent<SideBarListItemProps> = ({
  isOpen,
  isActive,
  onClick,
  children,
  variant = 'light',
  styleProps,
  inStudyBuilder,
}: SideBarListItemProps) => {
  const classes = useStyles()
  return (
    <li
      className={clsx(
        !inStudyBuilder && classes.listItem,
        inStudyBuilder && classes.studyBuilderListItem,
        {
          [classes.listItemDark]: variant === 'dark',
          [classes.listItemActive]: isActive,
          [classes.listItemCollapsed]: !isOpen,
        },
      )}
    >
      <Button
        onClick={() => onClick()}
        className={clsx(classes.link, styleProps && styleProps)}
        classes={{ label: classes.linkLabel }}
      >
        {children}
      </Button>
    </li>
  )
}

export default SideBarListItem
