import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core'
import { getEnumKeys } from '../../helpers/utility'
import { EnumType, TextSpan } from 'typescript'

const useStyles = makeStyles({
  root: {},
})

export interface SelectWithEnumProps {
  //use the following version instead if you need access to router props
  //export interface SelectWithEnumProps  extends  RouteComponentProps {
  //Enter your props here
  sourceData: object | Array<any>
  onChange: any
  id: string
  value?: string | number
  label?: string
  className?: string
}

const SelectWithEnum: React.FunctionComponent<SelectWithEnumProps> = ({
  sourceData,
  onChange,
  id,
  value,
  label,
  className,
}: SelectWithEnumProps) => {

    console.log(typeof sourceData)
    console.log(Array.isArray(sourceData), sourceData)
    console.log(Array.isArray( (new Array(5))))

    Object.keys([...Array(5)])

  const classes = useStyles()

  const getKeys = (data: Array<any> | object) :JSX.Element[]=> {
      
     if (!Array.isArray(sourceData)) {
        const result = getEnumKeys(sourceData).map(item => (
            <MenuItem value={item } key={item as string}>
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
    <FormControl className={className}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select labelId={`${id}-label`} id={id} value={value || ''} onChange={onChange}>
        {getKeys(sourceData)}
      </Select>
    </FormControl>
  )
}

export default SelectWithEnum
