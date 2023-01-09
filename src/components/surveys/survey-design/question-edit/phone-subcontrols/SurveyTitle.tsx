import {DisappearingInput} from '@components/surveys/widgets/SharedStyled'
import {SURVEY_ICONS} from '@components/surveys/widgets/SurveyIcon'
import {Box, FormControl} from '@mui/material'
import {styled} from '@mui/material/styles'
import {BaseStep} from '@typedefs/surveys'
import React from 'react'

const TitleIcon = styled('div', {label: 'TitleIcon'})(({theme}) => ({
  height: theme.spacing(8),
  textAlign: 'left',
  marginBottom: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  '& >img': {
    maxHeight: theme.spacing(8),
  },
}))

type SurveyTitleProps = {
  step: BaseStep
  onChange: (s: BaseStep) => void
}

const SurveyTitle: React.FunctionComponent<SurveyTitleProps> = ({step, onChange}) => {
  /*{
	"type": "assessment",
	"identifier": "foo",
	"title": "Name of Survey",
	"steps": [{
		"type": "overview",
		"identifier": "overview",
		"title": "Survey Title",
		"detail": "Summary to participants on what they should know about the survey, thanking them for their time, what type of environment they should be taking it in, etc.",
		"image": {
			"type": "sageResource",
			"imageName": "survey"
		}
	}]
}*/

  return (
    <Box display="flex" flexDirection="column" justifyContent="flex-start" paddingTop="120px" height="100%">
      <TitleIcon>
        {step.image?.imageName && (
          <img
            src={SURVEY_ICONS.get(step.image?.imageName)?.img}
            alt={SURVEY_ICONS.get(step.image?.imageName)?.title}
          />
        )}
      </TitleIcon>
      <FormControl variant="standard" fullWidth sx={{mb: 0}}>
        <DisappearingInput
          area-label="title"
          sx={{fontWeight: 'bold'}}
          id="title"
          value={step.title}
          placeholder="Title"
          onChange={e => onChange({...step, title: e.target.value})}
        />
      </FormControl>
      <FormControl variant="standard" fullWidth>
        <DisappearingInput
          id="summary"
          area-label="summary"
          multiline={true}
          minRows={4}
          sx={{fontSize: '12px'}}
          placeholder={step.detail}
          value={step.detail}
          onChange={e => onChange({...step, detail: e.target.value})}
        />
      </FormControl>
    </Box>
  )
}

export default SurveyTitle
