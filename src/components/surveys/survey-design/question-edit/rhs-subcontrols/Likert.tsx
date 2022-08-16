import {
  StyledFormControl,
  StyledLabel14,
} from '@components/surveys/widgets/SharedStyled'
import {
  StyledDropDown,
  StyledDropDownItem,
} from '@components/surveys/widgets/StyledDropDown'
import {SimpleTextInput} from '@components/widgets/StyledComponents'
import {Box, MenuItem, OutlinedInput, styled} from '@mui/material'
import {theme} from '@style/theme'
import {FormatOptionsInteger, LikertQuestion, Step} from '@typedefs/surveys'
import {ChangeEvent} from 'react'

const Labels = styled('div', {label: 'labels'})(({theme}) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(2, 1.5),
  marginLeft: theme.spacing(3),
  '& > label': {
    marginBottom: theme.spacing(0.5),

    '& span': {
      width: '130px',
      display: 'inline-block',
    },
  },
}))

const Likert: React.FunctionComponent<{
  step: LikertQuestion
  onChange: (step: Step) => void
}> = ({step, onChange}) => {
  const onUpdateFormat = (fm: FormatOptionsInteger) => {
    const inputItem = {...step.inputItem, formatOptions: fm}
    onChange({...step, inputItem})
  }
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          marginTop: theme.spacing(3),
          marginLeft: theme.spacing(3),
        }}>
        <StyledFormControl sx={{marginRight: theme.spacing(2)}}>
          <StyledLabel14 mb={0.5} id="minValueLbl">
            Min Value{' '}
          </StyledLabel14>
          <StyledDropDown
            labelId="minValueLbl"
            value={step.inputItem.formatOptions.minimumValue}
            height="42px"
            width="72px"
            //@ts-ignore
            onChange={(e: ChangeEvent<any>) =>
              onUpdateFormat({
                ...step.inputItem.formatOptions,
                minimumValue: parseInt(e.target.value),
              })
            }
            input={<OutlinedInput />}>
            {[0, 1].map(opt => (
              <MenuItem value={opt} key={opt}>
                <StyledDropDownItem width="72px" height="42px">
                  <Box paddingLeft="13px">{opt}</Box>{' '}
                </StyledDropDownItem>
              </MenuItem>
            ))}
          </StyledDropDown>
        </StyledFormControl>
        <StyledFormControl mb={2}>
          <StyledLabel14 mb={0.5} id="maxValueLbl">
            Max Value
          </StyledLabel14>
          <StyledDropDown
            labelId="maxValueLbl"
            value={step.inputItem.formatOptions.maximumValue}
            height="42px"
            width="72px"
            //@ts-ignore
            onChange={(e: ChangeEvent<any>) =>
              onUpdateFormat({
                ...step.inputItem.formatOptions,
                maximumValue: parseInt(e.target.value),
              })
            }
            input={<OutlinedInput />}
            inputProps={{'aria-label': 'Set Min Value:'}}>
            {[...new Array(8)].map(
              (opt, index) =>
                index > step.inputItem.formatOptions.minimumValue && (
                  <MenuItem value={index} key={index}>
                    <StyledDropDownItem width="72px" height="42px">
                      <Box paddingLeft="13px">{index}</Box>{' '}
                    </StyledDropDownItem>
                  </MenuItem>
                )
            )}
          </StyledDropDown>
        </StyledFormControl>
      </Box>
      <Labels>
        <StyledLabel14>
          <span>Min. Value Label: </span>
          <SimpleTextInput
            value={step.inputItem.formatOptions.minimumLabel}
            onChange={e =>
              onUpdateFormat({
                ...step.inputItem.formatOptions,
                minimumLabel: e.target.value,
              })
            }
          />
        </StyledLabel14>
        <StyledLabel14>
          <span>Max. Value Label:</span>
          <SimpleTextInput
            value={step.inputItem.formatOptions.maximumLabel}
            onChange={e =>
              onUpdateFormat({
                ...step.inputItem.formatOptions,
                maximumLabel: e.target.value,
              })
            }
          />
        </StyledLabel14>
      </Labels>
    </>
  )
}

export default Likert
