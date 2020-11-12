import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core'
import { getEnumKeys } from '../../helpers/utility'
import { EnumType, TextSpan } from 'typescript'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {},
  formControl: {
    margin: theme.spacing(1),
  },
  small: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))

export interface SelectWithEnumProps {
  //use the following version instead if you need access to router props
  //export interface SelectWithEnumProps  extends  RouteComponentProps {
  //Enter your props here
  sourceData: object | Array<any>
  onChange: any
  id: string
  value?: string | number
  label?: string
  style?: React.CSSProperties

  variant?: 'standard' | 'outlined' | 'filled'
  size?: 'small' | 'normal'
}

const SelectWithEnum: React.FunctionComponent<SelectWithEnumProps > = ({
  sourceData,
  onChange,
  id,
  style,
  variant = 'outlined',
  size = 'small',
  value,
  label,
}: SelectWithEnumProps) => {
  Object.keys([...Array(5)])

  const classes = useStyles()

  const getKeys = (data: Array<any> | object): JSX.Element[] => {
    if (!Array.isArray(sourceData)) {
      const result = getEnumKeys(sourceData).map(item => (
        <MenuItem value={item} key={item as string}>
          {sourceData[item]}
        </MenuItem>
      ))
      return result
    } else {
      const result = Object.keys(sourceData).map(item => (
        <MenuItem value={item} key={item as string}>
          {item}
        </MenuItem>
      ))
      return result
    }
  }

  return (
    <FormControl className={classes.formControl} style={style}>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Select
        variant={variant}
        classes={{ select: clsx(size === 'small' && classes.small) }}
        labelId={`${id}-label`}
        id={id}
        value={value || ''}
        onChange={onChange}
      >
        {getKeys(sourceData)}
      </Select>
    </FormControl>
  )
}

export default SelectWithEnum
