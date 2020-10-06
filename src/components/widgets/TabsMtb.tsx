import React, { FunctionComponent, useRef, useState } from 'react'

import {
  Tabs,
  Tab,
  makeStyles,
  Button,
  Menu,
  MenuItem,
  PopoverPosition,
  PopoverOrigin,
  Popover,
  TextField,
} from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import clsx from 'clsx'
import GroupsEditor from '../studies/session-creator/GoupsEditor'
import Editable from './Editable'

const useStyles = makeStyles({
  tabRoot: {
    background: '#EfEfEf',
    marginRight: '20px',
  },
  tabSelected: {
    background: '#E2E2E2',
    position: 'relative',
  },
  menuRoot: {
    padding: '10px 10px',
    fontSize: '14px',
  },

  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: '.8em',
  },
  TE: {
    position: 'absolute',
    background: '#E2E2E2',
    width: '100%',

    padding: '0 20px',
  },
  textInput: {
    '& .Mui-focused': {
      backgroundColor: '#fff',
    },
    '& input': {
      textAlign: 'center',
      textTransform: 'uppercase',
    },

    '& input:focused': {
      backgroundColor: 'blue',
    },
  },
  editIcon: {
    position: 'absolute',
    top: 5,

    width: '.8em',
    right: 20,
  },
})

type TabProps = {
  handleChange: Function
  value: number
  tabDataObjects: { label: string; id?: string }[]
  addNewLabel?: string
  onDelete?: Function
  onRenameTab?: Function
  menuItems?: {
    label: string
    fn: Function
  }[]
}

const TabsMtb: FunctionComponent<TabProps> = ({
  handleChange,
  value,
  tabDataObjects,
  addNewLabel,
  menuItems,
  onDelete,
  onRenameTab = () => null,
}: TabProps) => {
  const classes = useStyles()
  const inputRef = useRef<HTMLInputElement>(null)
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  )
  const [newGroupName, setNewGroupName] = React.useState('')
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue !== -10) {
      console.log('newValue', newValue)
      if (newValue === -1) {
        newValue = 0
      }
      handleChange(newValue)
    } else {
      //@ts-ignore
      setMenuAnchorEl(event.currentTarget)
    }
  }

  const menuOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'center',
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
            <MenuItem
              onClick={() => {
                setMenuAnchorEl(null)
                item.fn()
              }}
              key={index}
              className={classes.menuRoot}
            >
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
        {tabDataObjects.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            icon={
              index === value && onDelete ? (
                <>
                  <DeleteIcon
                    className={classes.deleteIcon}
                    onClick={() => onDelete(tab.id)}
                  ></DeleteIcon>
                  <div className={classes.TE}>
                    <Editable
                      text={newGroupName}
                      placeholder={tab.label}
                      childRef={inputRef}
                      onReset={() => setNewGroupName(tab.label)}
                      onTriggerUpdate={() => onRenameTab(tab.id, newGroupName)}
                      type="input"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        name="task"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                        placeholder={tab.label}
                        value={newGroupName}
                        onBlur={e => {
                          onRenameTab(tab.id, newGroupName)
                        }}
                        onChange={e => {
                          setNewGroupName(e.target.value)
                        }}
                      />
                    </Editable>
                  </div>
                </>
              ) : (
                <></>
              )
            }
            classes={{
              root: classes.tabRoot, // class name, e.g. `classes-nesting-root-x`
              selected: classes.tabSelected, // class name, e.g. `classes-nesting-label-x`
            }}
          />
        ))}
        {addNewLabel && (
          <Tab
            value={-10}
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
