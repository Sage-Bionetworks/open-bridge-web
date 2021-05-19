import React from 'react'
import { Box } from '@material-ui/core'
import Subsection from './Subsection'
import ReactColorPicker from '@super-effective/react-color-picker'
import { StudyAppDesign } from '../../../types/types'

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
          color={appDesignProperties.backgroundColor.foreground}
          onChange={(currentColor: string) => {
            setAppDesignProperties((prevState: StudyAppDesign) => ({
              ...prevState,
              backgroundColor: {
                ...appDesignProperties.backgroundColor,
                foreground: currentColor,
              },
            }))
            debouncedUpdateColor(currentColor)
          }}
        />
      </Box>
    </Subsection>
  )
}

export default ColorPickerSection
