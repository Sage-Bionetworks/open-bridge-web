import DefaultImg from '@assets/sage.svg'
import {Box, styled, SxProps} from '@mui/material'
import {theme} from '@style/theme'
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
    backgroundColor: 'pink',
  },
  '> div': {
    height: '150px',
    width: '100%',
    padding: theme.spacing(2, 3),
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
        <Box
          sx={{
            padding: theme.spacing(0),
            '& img': {
              width: '100%',
            },
          }}>
          <img src={screen?.url || DefaultImg} alt={name} height="100%" style={smallVariantProperties} />
        </Box>
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
