import { CardMedia } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { FunctionComponent, ReactNode } from 'react'
import DefaultImg from '../../assets/sage.svg'
import { AssessmentResource } from '../../types/types'

const useStyles = makeStyles(theme =>
  createStyles({
    media: {
      height: 180,
      padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0 ${theme.spacing(
        2,
      )}px`,
      backgroundPositionY: 'top',
      display: 'flex',
      flexShrink: 0,
      flexDirection: 'row',
    },
  }),
)

type AssessmentImageProps = {
  resources: AssessmentResource[] | undefined
  name: string
  isSmall?: boolean
  children?: ReactNode
}

const AssessmentImage: FunctionComponent<AssessmentImageProps> = ({
  resources,
  name,
  isSmall = false,
  children = <></>,
}: AssessmentImageProps) => {
  const classes = useStyles()
  const screen = resources?.find(
    resource =>
      resource.category === 'icon' &&
      !resource.deleted &&
      resource.upToDate &&
      resource.title.includes('_square') &&
      resource.url,
  )
  // let url = ''
  /* if (screens && screens.length) {
    const prefferred = screens.find(
      screen =>
        screen.title ===
        (variant === 'PORTRAIT'
          ? 'Portrait screenshot'
          : 'Landscape screenshot'),
    )
    if (prefferred) {
      url = prefferred.url
    } else {
      url = screens[0].url
    }
  }*/

  return isSmall ? (
    <img src={screen?.url || DefaultImg} alt={name} width="90%" />
  ) : (
    <CardMedia
      className={classes.media}
      image={screen?.url || DefaultImg}
      title={name}
    >
      {children}
    </CardMedia>
  )
}

export default AssessmentImage
