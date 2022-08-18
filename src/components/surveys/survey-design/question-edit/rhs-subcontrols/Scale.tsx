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
import {FormatOptionsInteger, ScaleQuestion, Step} from '@typedefs/surveys'
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

const ValueSelector: React.FunctionComponent<{
  value: number
  scaleType: 'likert' | 'slider'
  type: 'MIN' | 'MAX'
  gtValue?: number
  onChange: (value: number) => void
}> = ({value, scaleType, type, gtValue = -1, onChange}) => {
  const CONFIG = {
    MIN: {
      label: 'Min Value',
      labelId: 'minValueLbl',
      options: [0, 1],
    },
    MAX: {
      label: 'Max Value',
      labelId: 'maxValueLbl',
      options:
        scaleType === 'likert' ? [...Array(8).keys()] : [10, 20, 50, 100],
    },
  }

  return (
    <StyledFormControl sx={{marginRight: theme.spacing(2)}}>
      <StyledLabel14 mb={0.5} id={CONFIG[type].labelId}>
        {CONFIG[type].label}
      </StyledLabel14>
      <StyledDropDown
        labelId={CONFIG[type].labelId}
        value={value}
        height="42px"
        width="72px"
        //@ts-ignore
        onChange={(e: ChangeEvent<any>) => onChange(parseInt(e.target.value))}
        input={<OutlinedInput />}>
        {CONFIG[type].options.map(
          opt =>
            opt > gtValue && (
              <MenuItem value={opt} key={opt}>
                <StyledDropDownItem>
                  <Box paddingLeft="13px">{opt}</Box>{' '}
                </StyledDropDownItem>
              </MenuItem>
            )
        )}
      </StyledDropDown>
    </StyledFormControl>
  )
}

const Scale: React.FunctionComponent<{
  step: ScaleQuestion
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
        <ValueSelector
          type="MIN"
          scaleType={step.uiHint}
          value={step.inputItem.formatOptions.minimumValue}
          onChange={num =>
            onUpdateFormat({
              ...step.inputItem.formatOptions,
              minimumValue: num,
            })
          }
        />
        <ValueSelector
          type="MAX"
          scaleType={step.uiHint}
          gtValue={1}
          value={step.inputItem.formatOptions.maximumValue}
          onChange={num =>
            onUpdateFormat({
              ...step.inputItem.formatOptions,
              maximumValue: num,
            })
          }
        />
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

export default Scale
