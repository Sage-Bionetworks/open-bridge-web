import { Autocomplete } from '@mui/lab'
import {
  Box,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React from 'react'
import { latoFont, ThemeType } from '../../../style/theme'
import { Study } from '../../../types/types'
import { MTBHeadingH2 } from '../../widgets/Headings'
import InfoCircleWithToolTip from '../../widgets/InfoCircleWithToolTip'
import { diseases } from './diseases'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),

    textAlign: 'left',
  },
  subhead: {
    marginTop: theme.spacing(6),
  },
  studyType: {
    padding: theme.spacing(3),
  },

  autocomplete: {
    border: '1px solid black',
    marginTop: theme.spacing(3),
    '& .MuiAutocomplete-input': {
      backgroundColor: 'transparent',
    },
    '& label': {
      display: 'none',
    },
    '& .MuiChip-root': {
      backgroundColor: '#87D2EA',
      fontSize: '14px',
      borderColor: 'transparent',
    },
    '& .MuiChip-deleteIcon': {
      // color: 'white'
    },
    '& fieldset': {
      border: 'none',
    },
  },
  descriptionText: {
    fontFamily: latoFont,
    fontSize: '16px',
    lineHeight: '19px',
    marginBottom: theme.spacing(0.5),
  },
}))

export interface AboutStudyProps {
  study: Study
  onChange: Function
  onEnableNext: Function
}

const suggestions = [
  'neurodegeneration, neurology',
  'sleep',
  'cardiorespiratory fitness',
  'physical activity',
  'heart rate',
]

const JOIN_TOKEN = '*'

const StudyTypeLabel: React.FunctionComponent<{
  type: 'observation' | 'validation' | 'intervention'
  formLabelText: string
}> = ({ type, formLabelText }) => {
  let label
  switch (type) {
    case 'intervention':
      label = (
        <Box>
          An <strong>Experimental study</strong> is a study where an intevention
          is introduced and the effect of the intervention is studied (example:
          randomized control trial).
        </Box>
      )
      break
    case 'validation':
      label = (
        <Box>
          A <strong>Validation study</strong> is a type of study where a
          comparison in accuracy of a measure is performed compared to a a gold
          standard measure.
        </Box>
      )
      break
    default:
      label = (
        <Box>
          An <strong>Observational study</strong> is a study where you are
          trying to study the effect of a risk factor, diagnostic test,
          treatment or other intervention without trying to change who is or
          isn’t exposed to it (example: cohort study, case-control study).
        </Box>
      )
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Box mr={1}>{formLabelText}</Box>{' '}
      <InfoCircleWithToolTip tooltipDescription={label} variant="info" />
    </Box>
  )
}

const AboutStudy: React.FunctionComponent<AboutStudyProps> = ({
  study,
  onChange,
  onEnableNext,
}: AboutStudyProps) => {
  const classes = useStyles()

  React.useEffect(() => {
    onEnableNext(
      study.diseases && study.keywords && study.studyDesignTypes?.length
    )
  }, [study])

  const changeDiseases = (event: any, values: any) => {
    onChange({ ...study, diseases: values })
  }
  const changeKeywords = (event: any, values: any) => {
    onChange({ ...study, keywords: values.join(JOIN_TOKEN) })
  }
  const getSplitValue = (value: string | undefined) => {
    if (!value) {
      return []
    }
    const result = value.split(JOIN_TOKEN)

    return result
  }

  return (
    <div className={classes.root}>
      <MTBHeadingH2 className={classes.subhead}>Study type:</MTBHeadingH2>

      <RadioGroup
        aria-label="Study Type"
        name="studyType"
        classes={{ root: classes.studyType }}
        value={study.studyDesignTypes ? study.studyDesignTypes[0] : ''}
        onChange={e =>
          onChange({ ...study, studyDesignTypes: [e.target.value] })
        }>
        <FormControlLabel
          value="observation"
          control={<Radio color="secondary" />}
          label={
            <StudyTypeLabel
              formLabelText="Observational/Natural History"
              type="observation"
            />
          }
        />
        <FormControlLabel
          control={
            <>
              <Radio value="intervention" color="secondary" />{' '}
            </>
          }
          label={
            <StudyTypeLabel
              formLabelText="Interventional/Experimental"
              type="intervention"
            />
          }
        />
        <FormControlLabel
          control={
            <>
              <Radio value="validate" color="secondary" />{' '}
            </>
          }
          label={
            <StudyTypeLabel formLabelText="Validation" type="validation" />
          }
        />
      </RadioGroup>

      <MTBHeadingH2 className={classes.subhead}>
        What conditions or diseases is your study targeting?
      </MTBHeadingH2>
      <p className={classes.descriptionText}>
        These are diseases that participants in your study might be diagnosed
        with (e.g. MCI, Healthy Adults, Alzheimer's Disease). Please list all
        that apply.
      </p>
      <Autocomplete
        multiple
        id="diseases"
        options={diseases}
        onChange={changeDiseases}
        value={study.diseases}
        getOptionLabel={option => option}
        defaultValue={[]}
        renderInput={params => (
          <TextField
            {...params}
            className={classes.autocomplete}
            variant="outlined"
            label="diseases or conditions"
            placeholder="Select diseases or conditions "
          />
        )}
      />
      <MTBHeadingH2 className={classes.subhead}>
        What keywords would you like to associate with this study?
      </MTBHeadingH2>
      <p className={classes.descriptionText}>
        Keywords help describe your study. Some examples of past keywords
        assigned are: "neurodegeneration, neurology" and "sleep" and
        "cardiorespiratory fitness, physical activity, heart rate".
      </p>

      <Autocomplete
        multiple
        id="keywords"
        options={suggestions.map(option => option)}
        freeSolo
        onChange={changeKeywords}
        value={getSplitValue(study.keywords)}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="keywords"
            placeholder="keywords"
            className={classes.autocomplete}
          />
        )}
      />
    </div>
  )
}

export default AboutStudy
