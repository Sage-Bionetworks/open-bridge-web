import React, { FunctionComponent, useState } from 'react'

import { Tabs, Tab, makeStyles } from '@material-ui/core'

import clsx from 'clsx'

const useStyles = makeStyles({
  root: {
    background: '#EfEfEf',
    marginRight: '20px',
  },
  selected: {
    background: '#E2E2E2',
  },
})

type TabProps = {
  handleChange: Function
  value: number
  tabLabels: string[]
  addNewLabel?: string
}

const TabsMtb: FunctionComponent<TabProps> = ({
  handleChange,
  value,
  tabLabels,
  addNewLabel,
}: TabProps) => {
  const classes = useStyles()

  return (
    <Tabs
      value={value}
      onChange={(event: React.ChangeEvent<{}>, newValue: number) =>
        handleChange(newValue)
      }
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
            root: classes.root, // class name, e.g. `classes-nesting-root-x`
            selected: classes.selected, // class name, e.g. `classes-nesting-label-x`
          }}
        />
      ))}
      {addNewLabel && (
        <Tab
          label={addNewLabel}
          classes={{
            root: classes.root, // class name, e.g. `classes-nesting-root-x`
            selected: classes.selected, // class name, e.g. `classes-nesting-label-x`
          }}
        />
      )}
    </Tabs>
  )
}

export default TabsMtb
