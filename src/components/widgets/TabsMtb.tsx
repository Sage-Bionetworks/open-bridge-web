import React, { FunctionComponent, useState } from 'react'

import {
  Tabs,
  Tab,
  makeStyles,
  Button,
  Menu,
  MenuItem, PopoverPosition, PopoverOrigin
} from '@material-ui/core'

import clsx from 'clsx'
import GroupsEditor from '../studies/session-creator/GoupsEditor'

const useStyles = makeStyles({
  tabRoot: {
    background: '#EfEfEf',
    marginRight: '20px',
  },
  tabSelected: {
    background: '#E2E2E2',
  },
  menuRoot: {
    padding: '10px 10px',
    fontSize: '14px',
  },
})

type TabProps = {
  handleChange: Function
  value: number
  tabLabels: string[]
  addNewLabel?: string
  menuItems?: {
    label: string
    fn: Function
  }[]
}

const TabsMtb: FunctionComponent<TabProps> = ({
  handleChange,
  value,
  tabLabels,
  addNewLabel,
  menuItems,
}: TabProps) => {
  const classes = useStyles()
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  )
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {

    if (newValue !== -1) {
      handleChange(newValue)
    } else {
      
      //@ts-ignore
      setMenuAnchorEl(event.currentTarget)
    }
  }
  const menuOrigin: PopoverOrigin ={
    vertical: 'top' , horizontal: 'center'
  }
  const renderMenu = (): JSX.Element => {
    return (
      <>
        <Menu 
          id="simple-menu"
          anchorEl={menuAnchorEl}
          anchorOrigin={menuOrigin}

          open={Boolean(menuAnchorEl)}
          onClose={() => setMenuAnchorEl(null)}
        >
          {menuItems!.map((item, index) => (
            <MenuItem onClick={() => {setMenuAnchorEl(null); item.fn()}} key={index} className={classes.menuRoot}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    )
  }

  return (
    <>
      <Tabs
        value={value}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="disabled tabs example"
      >
        {tabLabels.map((label, index) => (
          <Tab
            key={index}
            label={label}
            classes={{
              root: classes.tabRoot, // class name, e.g. `classes-nesting-root-x`
              selected: classes.tabSelected, // class name, e.g. `classes-nesting-label-x`
            }}
          />
        ))}
        {addNewLabel && (
          <Tab
            value={-1}
            label={addNewLabel}
            classes={{
              root: classes.tabRoot, // class name, e.g. `classes-nesting-root-x`
              selected: classes.tabSelected, // class name, e.g. `classes-nesting-label-x`
            }}
          />
        )}
      </Tabs>

      {menuItems && renderMenu()}
    </>
  )
}

export default TabsMtb
