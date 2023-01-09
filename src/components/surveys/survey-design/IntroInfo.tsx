import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import {useUserSessionDataState} from '@helpers/AuthContext'
import UtilityObject from '@helpers/utility'
import CheckIcon from '@mui/icons-material/Check'
import PauseIcon from '@mui/icons-material/PauseCircleTwoTone'

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
import {latoFont, theme} from '@style/theme'
import {ActionButtonName, BaseStep, InterruptionHandlingType, Survey, WebUISkipOptions} from '@typedefs/surveys'
import {Assessment} from '@typedefs/types'
import React from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'

import NavigationPrompt from 'react-router-navigation-prompt'
import {SimpleTextInput} from '../../widgets/StyledComponents'
import QUESTIONS from './left-panel/QuestionConfigs'

const IntroContainer = styled('div', {label: 'IntroContainer'})(({theme}) => ({
  backgroundColor: '#f8f8f8',
  width: '100%',
  padding: theme.spacing(8, 31),
}))

const StyledInputLabel = styled('label')(({theme}) => ({
  fontWeight: 600,
  fontSize: '18px',
  marginBottom: theme.spacing(1),
}))

const StyledFormControl = styled(FormControl)(({theme}) => ({
  marginBottom: theme.spacing(5),
  display: 'flex',
  width: '520px',
}))

const HelpText = styled('span')(({theme}) => ({
  fontFamily: latoFont,
  fontSize: '15px',
  fontStyle: 'italic',
  fontWeight: 400,
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

const QuestionSettings = styled('div', {label: 'QuestionSettings'})(({theme}) => ({
  width: '345px',
  height: '171px',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),

  textAlign: 'left',
  '& span': {fontSize: '14px'},
  '& .MuiRadio-root': {
    padding: theme.spacing(0.5, 1.5),
  },

  backgroundColor: ' #FFF',
}))
const PauseMenuSettings = styled('div', {label: 'PauseMenuSettings'})(({theme}) => ({
  backgroundColor: '#fff',
  maxWidth: '550px',
  marginBottom: theme.spacing(6),
  padding: theme.spacing(3, 3, 1, 3),
}))

const CanSaveSettings = styled('div', {label: 'CanSaveSettings'})(({theme}) => ({
  width: 'auto',
  height: 'auto',

  backgroundColor: '#ECECEC',
  marginLeft: theme.spacing(-2),
  marginRight: theme.spacing(-2),
  padding: theme.spacing(1, 2, 2, 2),
  '& strong': {
    display: 'block',
  },
}))

const StyledInput = styled(SimpleTextInput)(({theme}) => ({
  marginRight: theme.spacing(3),
  marginBottom: '0 !important',
}))

const StyledBottomRadio = styled('div', {label: 'StyledBottomRadio'})(({theme}) => ({
  marginBottom: theme.spacing(3),
  '& strong': {
    marginBottom: theme.spacing(1),
  },
}))

const SaveButton: React.FunctionComponent<{
  assessment?: Assessment
  onClick: () => void
}> = ({assessment, onClick}) => {
  const isDisabled = !assessment?.title || !assessment?.minutesToComplete
  return !assessment?.guid ? (
    <Button variant="contained" color="primary" key="saveButton" onClick={onClick} disabled={isDisabled}>
      Title Page
    </Button>
  ) : (
    <Box sx={{marginLeft: '185px' /*position: 'fixed', right: 0, bottom: '10px'*/}}>
      <Button variant="contained" color="primary" disabled={isDisabled} onClick={onClick}>
        Save Changes
      </Button>
    </Box>
  )
}

export interface IntroInfoProps {
  surveyAssessment?: Assessment
  survey?: Survey
  children?: React.ReactNode
  onUpdate: (a: Assessment, s: Survey, act: 'UPDATE' | 'CREATE') => void
}
const getDefaultSurvey = (newSurveyId: string): Survey => ({
  config: {
    type: 'assessment',
    identifier: newSurveyId,
    shouldHideActions: [],
    interruptionHandling: {
      canResume: true,
      reviewIdentifier: 'beginning',
      canSkip: true,
      canSaveForLater: true,
    },
    steps: [QUESTIONS.get('OVERVIEW')!.default! as BaseStep, QUESTIONS.get('COMPLETION')!.default! as BaseStep],
    webConfig: {
      skipOption: 'CUSTOMIZE',
    },
  },
})
const getDefaultAssessment = (newSurveyId: string, orgMembership: string): Assessment => ({
  title: '',
  tags: [],
  version: 0,
  revision: 1,
  osName: 'Both',
  identifier: newSurveyId,
  ownerId: orgMembership,
})

const InterruptionHandlingDefault: InterruptionHandlingType = {
  canResume: true,
  reviewIdentifier: 'beginning',
  canSkip: true,
  canSaveForLater: true,
}

const IntroInfo: React.FunctionComponent<IntroInfoProps & RouteComponentProps> = ({
  surveyAssessment: _surveyAssessment,
  survey,
  children,
  onUpdate,
}: IntroInfoProps) => {
  const newSurveyId = UtilityObject.generateNonambiguousCode(6, 'CONSONANTS')
  const {orgMembership} = useUserSessionDataState()
  const [skip, setSkip] = React.useState<WebUISkipOptions | undefined>('CUSTOMIZE')
  const [hideBack, setHideBack] = React.useState(false)
  const [interruptionHandling, setInterruptionHandling] =
    React.useState<InterruptionHandlingType>(InterruptionHandlingDefault)
  const [surveyConfig, setSurveyConfig] = React.useState<Survey>(getDefaultSurvey(newSurveyId))
  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)

  const [basicInfo, setBasicInfo] = React.useState<Assessment>(getDefaultAssessment(newSurveyId, orgMembership!))

  React.useEffect(() => {
    if (_surveyAssessment) {
      setBasicInfo(_surveyAssessment)

      if (survey) {
        let skipOption: WebUISkipOptions
        if (survey.config.shouldHideActions?.includes('skip')) {
          skipOption = 'NO_SKIP'
        } else {
          skipOption = survey.config.webConfig?.skipOption || 'SKIP'
        }
        const goBackHidden = survey.config.shouldHideActions?.includes('goBackward')
        setHideBack(!!goBackHidden)
        setSkip(skipOption)
        setSurveyConfig(survey)
        if (survey.config.interruptionHandling) {
          setInterruptionHandling(survey.config.interruptionHandling)
        }
      } else {
        setSurveyConfig(getDefaultSurvey(_surveyAssessment.identifier))
      }
    }
  }, [_surveyAssessment, survey])

  const updateState = (callback: Function) => {
    setHasObjectChanged(true)
    callback()
  }
  const updateInterruptonHandling = (key: keyof InterruptionHandlingType, value: boolean) => {
    setHasObjectChanged(true)
    if (key !== 'reviewIdentifier') {
      setInterruptionHandling(prev => ({...prev, [key]: value}))
    } else {
      if (value) {
        setInterruptionHandling(prev => ({
          ...prev,
          reviewIdentifier: 'beginning',
        }))
      } else {
        setInterruptionHandling(prev => {
          const {reviewIdentifier, ...rest} = prev

          return rest
        })
      }
    }
  }

  const triggerUpdate = () => {
    const shouldHideActions: ActionButtonName[] = []
    if (skip === 'NO_SKIP') {
      shouldHideActions.push('skip')
    }
    if (hideBack) {
      shouldHideActions.push('goBackward')
    }
    surveyConfig.config.shouldHideActions = shouldHideActions
    surveyConfig.config.webConfig = {
      ...(surveyConfig.config.webConfig || {}),
      skipOption: skip,
    }
    surveyConfig.config.interruptionHandling = interruptionHandling
    setHasObjectChanged(false)

    onUpdate(basicInfo, surveyConfig, basicInfo.guid ? 'UPDATE' : 'CREATE')
  }

  return (
    <IntroContainer>
      <NavigationPrompt when={hasObjectChanged} key="nav_prompt">
        {({onConfirm, onCancel}) => (
          <ConfirmationDialog isOpen={hasObjectChanged} type={'NAVIGATE'} onCancel={onCancel} onConfirm={onConfirm} />
        )}
      </NavigationPrompt>
      {children}
      <StyledFormControl variant="standard">
        <StyledInputLabel htmlFor="survey_name">Survey Name*</StyledInputLabel>
        <Box display="flex" alignItems="center">
          <StyledInput
            className="compact"
            id="survey_name"
            sx={{'& input': {width: '250px'}}}
            value={basicInfo?.title}
            onChange={e => updateState(() => setBasicInfo(prev => ({...prev, title: e.target.value})))}
          />
          <div>
            <HelpText>This will be used to reference the survey in Survey Library.</HelpText>
          </div>
        </Box>
      </StyledFormControl>

      <StyledFormControl variant="standard">
        <StyledInputLabel htmlFor="duration">How long will this survey take?*</StyledInputLabel>
        <Box display="flex" alignItems="center">
          <StyledInput
            className="compact"
            id="duration"
            sx={{width: '60px'}}
            onChange={e =>
              updateState(() =>
                setBasicInfo(prev => ({
                  ...prev,
                  minutesToComplete: parseInt(e.target.value),
                }))
              )
            }
            value={basicInfo?.minutesToComplete || ''}
          />

          <div>minutes</div>
        </Box>
      </StyledFormControl>

      <QuestionSettings>
        <StyledInputLabel htmlFor="skip">Survey Question Settings</StyledInputLabel>
        <RadioGroup
          id="skip"
          value={skip}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            updateState(() => setSkip((event.target as HTMLInputElement).value as WebUISkipOptions))
          }>
          <FormControlLabel
            value="SKIP"
            sx={{mt: theme.spacing(1.5)}}
            control={<Radio />}
            label="Allow partcipants to skip"
          />
          <FormControlLabel value="NO_SKIP" control={<Radio />} label="Make all survey questions required" />
          <FormControlLabel value="CUSTOMIZE" control={<Radio />} label="Customize each question" />
        </RadioGroup>
      </QuestionSettings>
      <StyledFormControl>
        <FormControlLabel
          value="SKIP"
          sx={{mt: theme.spacing(1.5)}}
          control={<Checkbox checked={!hideBack} onChange={e => updateState(() => setHideBack(!e.target.checked))} />}
          label={
            <Typography sx={{fontWeight: '14px'}}>
              Allow participants to <strong>navigate back</strong>
              <br /> to previous question
            </Typography>
          }
        />
      </StyledFormControl>
      <PauseMenuSettings>
        <StyledInputLabel htmlFor="skip" sx={{marginBottom: theme.spacing(1), display: 'flex'}}>
          {' '}
          <PauseIcon />
          &nbsp;&nbsp; Pause Menu Settings
        </StyledInputLabel>
        <Typography>
          A pause menu is located in the top left corner of every survey.
          <br />
          Configure the survey's menu options below:
        </Typography>
        <StyledFormControl>
          <FormControlLabel
            sx={{mt: theme.spacing(1.5)}}
            control={<CheckIcon sx={{marginRight: '16px', marginLeft: '8px'}} />}
            label={
              <Typography sx={{fontSize: '14px'}}>
                <strong> Resume (always present)</strong>
                <br />
                Returns participant to the screen before selecting Pause.
              </Typography>
            }
          />

          <FormControlLabel
            value={interruptionHandling.reviewIdentifier}
            sx={{mt: theme.spacing(1.5)}}
            control={
              <Checkbox
                checked={interruptionHandling.reviewIdentifier !== undefined}
                onChange={e => updateInterruptonHandling('reviewIdentifier', e.target.checked)}
              />
            }
            label={
              <Typography sx={{fontSize: '14px'}}>
                <strong>Review Instructions</strong> <br /> Displays the Title Page message to participant for review.
              </Typography>
            }
          />

          <FormControlLabel
            sx={{mt: theme.spacing(1.5), fontSize: '14px'}}
            control={
              <Checkbox
                checked={interruptionHandling.canSkip}
                onChange={e => updateInterruptonHandling('canSkip', e.target.checked)}
              />
            }
            label={
              <Typography sx={{fontSize: '14px'}}>
                <strong>Skip this activity</strong>
                <br />
                Allows participant to skip the activity this one time. Survey will be marked as "declined" and displayed
                as incomplete in adherence.
              </Typography>
            }
          />
        </StyledFormControl>
        <CanSaveSettings>
          <RadioGroup
            id="exitSave"
            value={interruptionHandling.canSaveForLater.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateInterruptonHandling('canSaveForLater', e.target.value === 'true')
            }>
            <FormControlLabel
              value="true"
              sx={{mt: theme.spacing(1.5), alignItems: 'flex-start'}}
              control={<Radio />}
              label={
                <StyledBottomRadio>
                  <strong>Save &amp; continue later</strong>
                  Allows participant to save and continue where they left off within the scheduled window of a study.
                </StyledBottomRadio>
              }
            />
            <FormControlLabel
              sx={{alignItems: 'flex-start'}}
              value="false"
              control={<Radio />}
              label={
                <StyledBottomRadio>
                  <strong>Exit without saving</strong>
                  Exits the survey and restarts survey when they open it later.
                </StyledBottomRadio>
              }
            />
          </RadioGroup>
        </CanSaveSettings>
      </PauseMenuSettings>
      <StyledFormControl>
        <StyledInputLabel htmlFor="skip">
          Tags <HelpText>keywords to help locate survey. Only available to people you share it with.</HelpText>
        </StyledInputLabel>
        {}
        <Autocomplete
          multiple
          sx={{width: '550px'}}
          area-aria-label="survey tags"
          id="survey tags"
          options={[]}
          freeSolo
          onChange={(e, v) => updateState(() => setBasicInfo(prev => ({...prev, tags: v})))}
          value={[...basicInfo.tags]}
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip variant="outlined" label={option} {...getTagProps({index})} />
            ))
          }
          renderInput={params => (
            <AutoCompleteText {...params} variant="outlined" label="survey tags" placeholder="survey tags" />
          )}
        />
      </StyledFormControl>

      <SaveButton assessment={basicInfo} onClick={() => triggerUpdate()} />
    </IntroContainer>
  )
}

export default withRouter(IntroInfo)
