import assDetailFrame from '@assets/assessments/assessment_detail_frame.svg'
import DefaultImg from '@assets/sage.svg'
import {Box, styled, SxProps} from '@mui/material'
import {AssessmentResource} from '@typedefs/types'
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
    height: '150px',
    // backgroundColor: 'pink',
  },
  '> div': {
    height: '150px',
    width: '100%',
    padding: theme.spacing(2, 3),
  },
}))

const DetailImageContainer = styled(Box, {label: 'DetailImageContainer'})(({theme}) => ({
  padding: theme.spacing(0),
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
  resources: AssessmentResource[] | undefined
  name: string
  variant: 'small' | 'detail' | 'normal'
  children?: ReactNode
  smallVariantProperties?: React.CSSProperties
}

const AssessmentImage: FunctionComponent<AssessmentImageProps & SxProps> = ({
  resources,
  name,
  variant = 'normal',
  children = <></>,
  smallVariantProperties,
  ...sxProps
}: AssessmentImageProps) => {
  const screen = resources?.find(
    resource =>
      resource.category === 'icon' &&
      !resource.deleted &&
      resource.upToDate &&
      resource.title.includes('_square') &&
      resource.url
  )
  let image

  switch (variant) {
    case 'small': {
      image = <img src={screen?.url || DefaultImg} alt={name} height="100%" style={smallVariantProperties} />
      break
    }
    case 'detail': {
      image = (
        <DetailImageContainer>
          <img src={screen?.url || DefaultImg} alt={name} height="100%" style={smallVariantProperties} />
        </DetailImageContainer>
      )
      break
    }
    default: {
      image = (
        <CardTop title={name} {...sxProps}>
          <img src={screen?.url || DefaultImg} alt={name} />
          <div>{children}</div>
        </CardTop>
      )
    }
  }
  return image
}

export default AssessmentImage
