import { Box } from '@material-ui/core'
import ReactColorPicker from '@super-effective/react-color-picker'
import React from 'react'
import { StudyAppDesign } from '../../../types/types'
import Subsection from './Subsection'

type ColorPickerSection = {
  appDesignProperties: StudyAppDesign
  debouncedUpdateColor: Function
  setAppDesignProperties: Function
}

const ColorPickerSection: React.FunctionComponent<ColorPickerSection> = ({
  appDesignProperties,
  debouncedUpdateColor,
  setAppDesignProperties,
}) => {
  return (
    <Subsection heading="Select background color">
      <p>
        Select a background color that matches your institution or study to be
        seen beneath your logo.
      </p>
      <Box width="250px" height="230px" ml={-1.25}>
        <ReactColorPicker
          color={appDesignProperties.backgroundColor}
          onChange={(currentColor: string) => {
            setAppDesignProperties((prevState: StudyAppDesign) => ({
              ...prevState,
              backgroundColor: currentColor,
            }))
            debouncedUpdateColor(currentColor)
          }}
        />
      </Box>
    </Subsection>
  )
}

export default ColorPickerSection
