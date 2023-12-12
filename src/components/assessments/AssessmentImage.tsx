import assDetailFrame from '@assets/assessments/assessment_detail_frame.svg'
import DefaultImg from '@assets/sage.svg'
import { SURVEY_ICONS } from '@components/surveys/widgets/SurveyIcon'
import {Box, styled, SxProps} from '@mui/material'
import {Assessment} from '@typedefs/types'
import React, {FunctionComponent, ReactNode} from 'react'

const CardTop = styled(Box, {label: 'StyledCardMedia'})(({theme}) => ({
  height: 150,
  padding: 0, //`${theme.spacing(2)} ${theme.spacing(2)} 0 ${theme.spacing(2)}`,
  backgroundPositionY: 'top',
  display: 'flex',
  flexShrink: 0,
  textAlign: 'left',
  flexDirection: 'row',
  '& img': {
    width: '150px',
  },
  '> div': {
    height: '150px',
    width: '100%',
    backgroundColor: '#f6f6f6',
    padding: theme.spacing(2, 3),
  },
}))

const DetailImageContainer = styled(Box, {label: 'DetailImageContainer'})(({theme}) => ({
  padding: '9px 0px 16px 0px',
  backgroundImage: `url(${assDetailFrame})`,
  backgroundRepeat: 'no-repeat',
  height: '270px',
  width: '530px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '& img': {
    width: '100%',
  },
}))

type AssessmentImageProps = {
  assessment: Assessment
  name: string
  variant: 'small' | 'detail' | 'card' | 'normal'
  children?: ReactNode
  smallVariantProperties?: React.CSSProperties
}

const AssessmentImage: FunctionComponent<AssessmentImageProps & SxProps> = ({
  assessment,
  name,
  variant = 'normal',
  children = <></>,
  smallVariantProperties,
  ...sxProps
}: AssessmentImageProps) => {
  const screen = assessment.resources?.find(
    resource =>
      resource.category === 'icon' &&
      !resource.deleted &&
      resource.upToDate &&
      resource.title.includes('_square') &&
      resource.url
  )
  const surveyImageName = assessment.imageResource?.name
  const surveyImage = surveyImageName ? SURVEY_ICONS.get(surveyImageName)?.img : null
  const imageSrc = screen?.url || surveyImage || DefaultImg
  const imgHeight = !screen ? "70%" : "100%"
  const iconImage = <img src={imageSrc} alt={name} height={imgHeight} style={smallVariantProperties} />

  let image

  switch (variant) {
    case 'small': {
      image = (
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          {iconImage}
        </div>
      )
      break
    }
    case 'detail': {
      image = (
        <DetailImageContainer>
          {iconImage}
        </DetailImageContainer>
      )
      break
    }
    case 'card': {
      image = (
        <CardTop title={name} {...sxProps}>
          <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            {iconImage}
          </div>
        </CardTop>
      )
      break
    }
    default: {
      image = (
        <CardTop title={name} {...sxProps}>
          {iconImage}
          <div>{children}</div>
        </CardTop>
      )
    }
  }
  return image
}

export default AssessmentImage
