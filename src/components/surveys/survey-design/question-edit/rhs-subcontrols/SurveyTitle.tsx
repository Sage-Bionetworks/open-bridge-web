import {Button, Typography} from '@mui/material'
import {styled} from '@mui/material/styles'
import {latoFont, poppinsFont, theme} from '@style/theme'
import {BaseStep} from '@typedefs/surveys'
import React from 'react'

import SurveyIcon, {SURVEY_ICONS} from '@components/surveys/widgets/SurveyIcon'

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
  backgroundColor: '#ececec',
  padding: theme.spacing(3, 2),
  height: '100%',

  '& h3': {
    fontFamily: poppinsFont,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '16px',
  },
}))
const IconGrid = styled('div')(({theme}) => ({
  display: 'grid',
  margin: theme.spacing(3),

  gridTemplateColumns: 'repeat(4, 64px)',
  columnGap: theme.spacing(3),
  rowGap: theme.spacing(2),
}))

type SurveyTitleProps = {
  step: BaseStep
  onChange: (s: BaseStep) => void
  //resources?: AssessmentResource[]
  //  surveyConfig: SurveyConfig
  // onUpdateSurveyConfig: (s: SurveyConfig) => void
  //onUpdateResource: (r: AssessmentResource[]) => void
  //  onSave: () => void
}

const SurveyTitle: React.FunctionComponent<SurveyTitleProps> = ({
  /* resources,
  surveyConfig,
  onUpdateSurveyConfig,
  onUpdateResource,
  onSave,*/
  step,
  onChange,
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

  /*

  React.useEffect(() => {
    if (resources?.length) {
      const resource = resources.find(r => r.category === 'icon')
      setSelectedIcon(resource?.url)
    }
  }, [resources])*/

  //const selectedIcon = getIcon()

  return (
    <>
      <IconArea>
        <Typography component="h4" sx={{paddingLeft: theme.spacing(2)}}>
          Customize Survey Icon:
        </Typography>
        <IconGrid>
          {Array.from(SURVEY_ICONS.keys()).map(name => (
            <SurveyIcon
              key={name}
              name={name}
              isSelected={name === step.image?.imageName} //selectedIcon}
              onSelected={
                () =>
                  onChange({
                    ...step,
                    image: {imageName: name, type: 'sageResource'},
                  })
                /*{
                const rsrs = [...(resources || [])]
                const iconIndex = rsrs.findIndex(r => r.category === 'icon')
                if (iconIndex > -1) {
                  rsrs[iconIndex].title = name
                  rsrs[iconIndex].url = name
                } else {
                  rsrs.push({category: 'icon', title: name, url: name})
                }

                onUpdateResource(rsrs)*/
              }
            />
          ))}
        </IconGrid>
        {/* <QuestionEditToolbarContainer sx={{backgroundColor: '#ececec'}}>
          <ActionButton
            startIcon={<SaveIcon />}
            onClick={onSave}
            variant="text">
            Save Changes
          </ActionButton>
            </QuestionEditToolbarContainer>*/}
      </IconArea>
    </>
  )
}

export default SurveyTitle
