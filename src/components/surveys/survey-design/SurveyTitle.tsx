import {Box, Button, FormControl} from '@mui/material'
import {styled} from '@mui/material/styles'
import {latoFont, poppinsFont} from '@style/theme'
import {SurveyConfig} from '@typedefs/surveys'
import {AssessmentResource} from '@typedefs/types'
import React from 'react'
import {DisappearingInput} from '../widgets/SharedStyled'
import SurveyIcon, {SURVEY_ICONS} from '../widgets/SurveyIcon'
import PhoneDisplay from './question-edit/PhoneDisplay'

const StyledStartButton = styled(Button)(({theme}) => ({
  height: theme.spacing(5),
  // backgroundColor: '#2A2A2A',
  borderRadius: '100px',
  textAlign: 'center',

  fontFamily: latoFont,
  fontWeight: 600,
  fontSize: '16px',
  // color: '#fff',
}))

const TitleIcon = styled('div')(({theme}) => ({
  height: theme.spacing(8),
  textAlign: 'left',
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(1),
  '& >img': {
    maxHeight: theme.spacing(8),
  },
}))

const IconArea = styled('div')(({theme}) => ({
  backgroundColor: '#e5e5e5',
  padding: theme.spacing(9),
  width: '380px',
  flexGrow: 0,

  '& h3': {
    fontFamily: poppinsFont,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '16px',
  },
}))
const IconGrid = styled('div')(({theme}) => ({
  display: 'grid',
  marginTop: theme.spacing(3),
  gridTemplateColumns: 'repeat(3, 64px)',
  columnGap: theme.spacing(2),
  rowGap: theme.spacing(2),
}))

type SurveyTitleProps = {
  resources?: AssessmentResource[]
  surveyConfig: SurveyConfig
  onUpdateSurveyConfig: (s: SurveyConfig) => void
  onUpdateResource: (r: AssessmentResource[]) => void
  onSave: () => void
}

const SurveyTitle: React.FunctionComponent<SurveyTitleProps> = ({
  resources,
  surveyConfig,
  onUpdateSurveyConfig,
  onUpdateResource,
  onSave,
}) => {
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

  const summaryText =
    'Summary to participants on what they should know about the survey, thanking them for their time, what type of environment they should be taking it in, etc.'
  const [selectedIcon, setSelectedIcon] = React.useState<string | undefined>()

  React.useEffect(() => {
    if (resources?.length) {
      const resource = resources.find(r => r.category === 'icon')
      setSelectedIcon(resource?.url)
    }
  }, [resources])

  //const selectedIcon = getIcon()

  return (
    <>
      <Box bgcolor={'#fff'} flexGrow={1} textAlign="center">
        <PhoneDisplay
          phoneBottom={
            <StyledStartButton
              color="primary"
              variant="contained"
              onClick={onSave}>
              Start
            </StyledStartButton>
          }>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            height="100%">
            <TitleIcon>
              {selectedIcon && (
                <img src={SURVEY_ICONS.get(selectedIcon)?.img} />
              )}
            </TitleIcon>
            <FormControl variant="standard" fullWidth sx={{mb: 1}}>
              <DisappearingInput
                area-label="title"
                sx={{fontWeight: 'bold'}}
                id="title"
                value={surveyConfig.title}
                placeholder="Title"
                onChange={e =>
                  onUpdateSurveyConfig({
                    ...surveyConfig,
                    title: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl variant="standard" fullWidth>
              <DisappearingInput
                id="summary"
                area-label="summary"
                multiline={true}
                minRows={4}
                placeholder={summaryText}
                value={surveyConfig.detail}
                onChange={e =>
                  onUpdateSurveyConfig({
                    ...surveyConfig,
                    detail: e.target.value,
                  })
                }
              />
            </FormControl>
          </Box>
        </PhoneDisplay>
      </Box>
      <IconArea>
        <h3>Customize Survey Icon:</h3>
        <IconGrid>
          {Array.from(SURVEY_ICONS.keys()).map(name => (
            <SurveyIcon
              key={name}
              name={name}
              isSelected={name === selectedIcon}
              onSelected={() => {
                const rsrs = [...(resources || [])]
                const iconIndex = rsrs.findIndex(r => r.category === 'icon')
                if (iconIndex > -1) {
                  rsrs[iconIndex].title = name
                  rsrs[iconIndex].url = name
                } else {
                  rsrs.push({category: 'icon', title: name, url: name})
                }

                onUpdateResource(rsrs)
              }}
            />
          ))}
        </IconGrid>
      </IconArea>
    </>
  )
}

export default SurveyTitle
