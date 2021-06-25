import {
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete'
import React from 'react'
import { ThemeType } from '../../../style/theme'
import { Study } from '../../../types/types'
import { MTBHeadingH2 } from '../../widgets/Headings'
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
const AboutStudy: React.FunctionComponent<AboutStudyProps> = ({
  study,
  onChange,
  onEnableNext,
}: AboutStudyProps) => {
  const classes = useStyles()

  React.useEffect(() => {
    onEnableNext(study.diseases && study.keywords && study.studyDesignTypes?.length)
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
        value={study.studyDesignTypes? study.studyDesignTypes[0] : ''}
        onChange={e => onChange({ ...study, studyDesignTypes: [e.target.value] })}
      >
        <FormControlLabel
          value="observation"
          control={<Radio />}
          label="Observational/Natural History"
        />
        <FormControlLabel
          control={
            <>
              <Radio value="intervention" />{' '}
            </>
          }
          label="Interventional/Experimental"
        />
      </RadioGroup>

      <MTBHeadingH2 className={classes.subhead}>
        What diseases or conditions is your study targeting?{' '}
      </MTBHeadingH2>

      <Autocomplete
        multiple
        limitTags={2}
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
      <p>
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
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
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
