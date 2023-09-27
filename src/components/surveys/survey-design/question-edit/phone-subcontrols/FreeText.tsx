import { Box } from "@mui/material"
import { latoFont } from "@style/theme"
import { Question } from "@typedefs/surveys"

const FreeText: React.FunctionComponent<{
    step: Question
  }> = ({step}) => {
    return (
        <Box
          sx={{
            fontFamily: latoFont,
            fontSize: '14px',
            fontStyle: 'italic',
            fontWeight: '400',
            textAlign: 'left',
          }}>
          {step.inputItem?.placeholder}
        </Box>
      ) // Mobile devices do not support more than 250 characters of free text.
  }
  
  export default FreeText