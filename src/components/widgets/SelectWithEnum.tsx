import {
  FormControl,
  InputLabel, MenuItem, Select,



  SelectProps
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { getEnumKeys } from '../../helpers/utility'



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

  id: string
  value?: string | number
  label?: string
  style?: React.CSSProperties

  variant?: 'standard' | 'outlined' | 'filled'
  size?: 'small' | 'normal'
}

const SelectWithEnum: React.FunctionComponent<
  SelectWithEnumProps & SelectProps
> = ({
  sourceData,

  id,
  style,
  variant = 'outlined',
  size = 'small',
  value,
  label,
  ...rest
}: SelectWithEnumProps) => {
  Object.keys([...Array(5)])

  const classes = useStyles()

  const getDropdownItems= (data: Array<any> | object): JSX.Element[] => {
    if (!Array.isArray(sourceData)) {
      const result = getEnumKeys(sourceData).map(item => (
        <MenuItem value={item} key={item as keyof typeof sourceData}>
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
        {...rest}
      >
        {getDropdownItems(sourceData)}
      </Select>
    </FormControl>
  )
}

export default SelectWithEnum
