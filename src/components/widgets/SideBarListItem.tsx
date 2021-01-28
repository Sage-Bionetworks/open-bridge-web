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
  listItemActive: {},
  listItemCollapsed: {},

  link: {
    fontFamily: poppinsFont,
    color: '#282828',
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
  },
}))

export interface SideBarListItemProps {
  key: string,
  isOpen: boolean,
  isActive: boolean,
  onClick: Function
  children: React.ReactNode

}

const SideBarListItem: React.FunctionComponent<SideBarListItemProps> = ({
  key,
  isOpen,
  isActive,
  onClick,
  children
}: SideBarListItemProps) => {
  const classes = useStyles()
  return (
    <li
    key={key}
    className={clsx(classes.listItem, {
      [classes.listItemActive]: isActive,
      [classes.listItemCollapsed]: !isOpen,
    })}
  >
    <Button
      key={`${key}_button`}
      onClick={()=>onClick()}
      className={classes.link}
      classes={{ label: classes.linkLabel }}
    >
      {children}
    </Button>
  </li>
  )
}

export default SideBarListItem
