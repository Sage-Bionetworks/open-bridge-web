import { makeStyles } from '@material-ui/core'
import React, { useState, useEffect, FunctionComponent, useRef } from 'react'
import Editable from './Editable'

type EditableTextboxProps = {
  initValue: string
  onTriggerUpdate: Function
}

const EditableTextbox: FunctionComponent<EditableTextboxProps> = ({
  initValue,
  onTriggerUpdate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [newValue, setNewValue] = React.useState('')

  return (
    <Editable
      text={newValue}
      placeholder={initValue}
      childRef={inputRef}
      onReset={() => setNewValue(initValue)}
      onTriggerUpdate={() => onTriggerUpdate(newValue)}
      type="input"
    >
      <input
        ref={inputRef}
        type="text"
        name="task"
        placeholder={initValue}
        value={newValue}
        onBlur={e => {
          onTriggerUpdate(newValue)
        }}
        onChange={e => {
          setNewValue(e.target.value)
        }}
      />
    </Editable>
  )
}

export default EditableTextbox
