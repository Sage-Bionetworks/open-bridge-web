import {Box} from '@mui/material'
import {theme} from '@style/theme'
import React from 'react'
import PhoneDisplay from '../widgets/PhoneDisplay'
import SurveyIcon, {SURVEY_ICONS} from '../widgets/SurveyIcon'

const SurveyTitle: React.FunctionComponent<{}> = ({}) => {
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
  const [selectedIcon, setSelectedIcon] = React.useState<string | undefined>()
  return (
    <>
      <Box bgcolor={'#fff'} flexGrow={1} textAlign="center">
        <PhoneDisplay>
          {' '}
          Title
          {selectedIcon && (
            <img width="100%" src={SURVEY_ICONS.get(selectedIcon)?.img} />
          )}
        </PhoneDisplay>
      </Box>
      <Box bgcolor={'#e5e5e5'} p={9} width="380px" flexGrow={0}>
        Customize survey icon
        {}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 64px)',
            columnGap: theme.spacing(2),
            rowGap: theme.spacing(2),
          }}>
          {Array.from(SURVEY_ICONS.keys()).map(name => (
            <SurveyIcon
              key={name}
              name={name}
              isSelected={name === selectedIcon}
              onSelected={() => setSelectedIcon(name)}
            />
          ))}
        </Box>
      </Box>
    </>
  )
}

export default SurveyTitle
