import {useUserSessionDataState} from '@helpers/AuthContext'
import UtilityObject from '@helpers/utility'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import {styled} from '@mui/material/styles'
import {latoFont, poppinsFont, theme} from '@style/theme'
import {Survey} from '@typedefs/surveys'
import {Assessment} from '@typedefs/types'
import React from 'react'
import {SimpleTextInput} from '../../widgets/StyledComponents'

const IntroContainer = styled('div')(({theme}) => ({
  backgroundColor: '#fff',
  width: '100%',
  padding: theme.spacing(8, 31),
}))

const StyledInputLabel = styled('label')(({theme}) => ({
  fontFamily: poppinsFont,
  fontWeight: 600,
  fontSize: '18px',
  marginBottom: theme.spacing(1),
}))

const StyledFormControl = styled(FormControl)(({theme}) => ({
  marginBottom: theme.spacing(5),
  display: 'flex',
}))

const HelpText = styled('span')(({theme}) => ({
  fontFamily: latoFont,
  fontSize: '15px',
  fontStyle: 'italic',
  fontWeight: 400,
}))

const StyledCheckbox = styled(Checkbox)(({theme}) => ({
  '& svg': {
    fontSize: '24px',
  },
  '&.Mui-checked': {
    '& svg': {
      color: 'black',
    },
  },
}))

const AutoCompleteText = styled(TextField)(({theme}) => ({
  border: '1px solid black',
  marginTop: 0,

  '& .MuiAutocomplete-input': {
    backgroundColor: 'transparent',
  },
  '& label': {
    display: 'none',
  },
  '& .MuiChip-root': {
    backgroundColor: '#8FD6FF',
    fontSize: '16px',
    fontFamily: latoFont,
    borderColor: 'transparent',
    height: theme.spacing(5),
    borderRadius: '20px',
  },
  '& .MuiChip-deleteIcon': {
    // color: 'white'
  },
  '& fieldset': {
    border: 'none',
  },
}))

const QuestionSettings = styled('div')(({theme}) => ({
  width: '345px',
  height: '171px',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),

  textAlign: 'left',
  '& span': {fontSize: '14px', fontFamily: poppinsFont},
  '& .MuiRadio-root': {
    padding: theme.spacing(0.5, 1.5),
  },

  backgroundColor: ' #BCD5E4',
}))

type SkipOptions = 'SKIP' | 'NO_SKIP' | 'CUSTOM'

const StyledInput = styled(SimpleTextInput)(({theme}) => ({
  marginRight: theme.spacing(3),
  marginBottom: '0 !important',
}))

export interface IntroInfoProps {
  surveyAssessment?: Assessment
  onUpdate: (a: Assessment, act: 'UPDATE' | 'CREATE') => void
}

const IntroInfo: React.FunctionComponent<IntroInfoProps> = ({
  surveyAssessment: _surveyAssessment,
  onUpdate,
}: IntroInfoProps) => {
  const {orgMembership} = useUserSessionDataState()
  const [skip, setSkip] = React.useState<SkipOptions | undefined>('SKIP')
  const [hideBack, setHideBack] = React.useState(false)
  const [suveyConfig, setSurveyConfig] = React.useState<Survey | null>()
  const [basicInfo, setBasicInfo] = React.useState<Assessment>({
    title: '',
    tags: [],
    version: 0,
    revision: 1,
    osName: 'Both',
    identifier: UtilityObject.generateNonambiguousCode(6, 'CONSONANTS'),
    ownerId: orgMembership!,
  })
  React.useEffect(() => {
    console.log('setting basic info')
    if (_surveyAssessment) {
      setBasicInfo(_surveyAssessment)
    }
  }, [_surveyAssessment])

  const triggerUpdate = () => {
    onUpdate(basicInfo, basicInfo.guid ? 'UPDATE' : 'CREATE')
  }

  return (
    <IntroContainer>
      <StyledFormControl variant="standard">
        <StyledInputLabel htmlFor="survey_name">Survey Name*</StyledInputLabel>
        <Box display="flex" alignItems="center">
          <StyledInput
            className="compact"
            defaultValue=""
            id="survey_name"
            fullWidth
            value={basicInfo?.title}
            onChange={e =>
              setBasicInfo(prev => ({...prev, title: e.target.value}))
            }
          />
          <div>
            <HelpText>
              This will be used to reference the survey in Survey Library.
            </HelpText>
          </div>
        </Box>
      </StyledFormControl>

      <StyledFormControl variant="standard">
        <StyledInputLabel htmlFor="duration">
          How long will this survey take?*
        </StyledInputLabel>
        <Box display="flex" alignItems="center">
          <StyledInput
            className="compact"
            defaultValue=""
            id="duration"
            sx={{width: '60px'}}
            onChange={e =>
              setBasicInfo(prev => ({
                ...prev,
                minutesToComplete: parseInt(e.target.value),
              }))
            }
            value={basicInfo?.minutesToComplete || ''}
          />

          <div>minutes</div>
        </Box>
      </StyledFormControl>

      <QuestionSettings>
        <StyledInputLabel htmlFor="skip">
          Survey Question Settings
        </StyledInputLabel>
        <RadioGroup
          id="skip"
          value={skip}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSkip((event.target as HTMLInputElement).value as SkipOptions)
          }>
          <FormControlLabel
            value="SKIP"
            sx={{mt: theme.spacing(1.5)}}
            control={<Radio />}
            label="Allow partcipants to skip"
          />
          <FormControlLabel
            value="NO_SKIP"
            control={<Radio />}
            label="Make all survey questions required"
          />
          <FormControlLabel
            value="CUSTOMIZE"
            control={<Radio />}
            label="Customize each question"
          />
        </RadioGroup>
      </QuestionSettings>
      <StyledFormControl>
        <FormControlLabel
          value="SKIP"
          sx={{mt: theme.spacing(1.5)}}
          control={
            <StyledCheckbox
              checked={!hideBack}
              size="medium"
              onChange={e => setHideBack(!e.target.checked)}
            />
          }
          label={
            <Typography sx={{fontFamily: poppinsFont, fontWeight: '14px'}}>
              Allow participants to <strong>navigate back</strong> to previous
              question
            </Typography>
          }
        />
      </StyledFormControl>
      <StyledFormControl>
        <StyledInputLabel htmlFor="skip">
          Tags{' '}
          <HelpText>
            Keywords to help locate survey. Only available to people you share
            it with.
          </HelpText>
        </StyledInputLabel>
        {}
        <Autocomplete
          multiple
          id="keywords"
          options={[]}
          freeSolo
          onChange={(e, v) => setBasicInfo(prev => ({...prev, tags: v}))}
          value={[...basicInfo.tags]}
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({index})}
              />
            ))
          }
          renderInput={params => (
            <AutoCompleteText
              {...params}
              variant="outlined"
              label="keywords"
              placeholder="keywords"
            />
          )}
        />
      </StyledFormControl>

      <Button
        /* className={classes.continueButton}*/
        variant="contained"
        color="primary"
        key="saveButton"
        onClick={triggerUpdate}
        disabled={!basicInfo?.title}>
        Title Page
      </Button>
    </IntroContainer>
  )
}

export default IntroInfo
