import {Typography} from '@mui/material'
import {styled} from '@mui/material/styles'
import {poppinsFont, theme} from '@style/theme'
import {BaseStep} from '@typedefs/surveys'
import React from 'react'

import SurveyIcon, {SURVEY_ICONS} from '@components/surveys/widgets/SurveyIcon'

const IconArea = styled('div')(({theme}) => ({
  backgroundColor: '#ececec',
  padding: theme.spacing(3, 2),
  marginBottom: theme.spacing(5),
  height: '100%',

  '& h3': {
    textAlign: 'center',
    fontFamily: poppinsFont,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '16px',
  },
}))
const IconGrid = styled('div')(({theme}) => ({
  display: 'grid',
  margin: theme.spacing(3),

  gridTemplateColumns: 'repeat(4, 78px)',
  columnGap: theme.spacing(3),
  rowGap: theme.spacing(2),
}))

type SurveyTitleProps = {
  step: BaseStep
  onChange: (s: BaseStep) => void
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
              onSelected={() =>
                onChange({
                  ...step,
                  image: {imageName: name, type: 'sageResource'},
                })
              }
            />
          ))}
        </IconGrid>
      </IconArea>
    </>
  )
}

export default SurveyTitle
