import {Box} from '@material-ui/core'
import ReactColorPicker from '@super-effective/react-color-picker'
import React from 'react'
import Subsection from './widgets/Subsection'

type ColorPickerSection = {
  appBackgroundColor: string
  debouncedUpdateColor: Function
  setAppBackgroundColor: Function
}

const ColorPickerSection: React.FunctionComponent<ColorPickerSection> = ({
  appBackgroundColor,
  debouncedUpdateColor,
  setAppBackgroundColor,
}) => {
  return (
    <Subsection heading="Select background color">
      <p>
        Select a background color that matches your institution or study to be
        seen beneath your logo.
      </p>
      <Box width="250px" height="230px" ml={-1.25}>
        <ReactColorPicker
          color={appBackgroundColor}
          onChange={(currentColor: string) => {
            setAppBackgroundColor(currentColor)
            debouncedUpdateColor(currentColor)
          }}
        />
      </Box>
    </Subsection>
  )
}

export default ColorPickerSection
