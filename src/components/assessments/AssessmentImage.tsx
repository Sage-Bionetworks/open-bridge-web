import React, { FunctionComponent, ReactNode } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { AssessmentResource } from '../../types/types'
import { CardMedia } from '@material-ui/core'
import DefaultImg from '../../assets/sage.svg'

const useStyles = makeStyles(theme =>
    createStyles({
   
  
      media: {
        height: 180,
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0 ${theme.spacing(
          2,
        )}px`,
        backgroundPositionY: 'top',
        display: 'flex',
        flexDirection: 'row',
      }
    }))

type AssessmentImageProps = {
    resources: AssessmentResource[] | undefined
    name: string
    isSmall?: boolean
    children?: ReactNode
 
  }
  
  const AssessmentImage: FunctionComponent<AssessmentImageProps> = ({
    resources,
    name,
    isSmall=false,
    children = <></>,
  }: AssessmentImageProps) => {
    const classes = useStyles()
    const screens = resources?.filter(
      resource =>
        resource.category === 'screenshot' &&
        !resource.deleted &&
        resource.upToDate &&
        resource.url,
    )
    let url = ''
    if (screens && screens.length) {

      const portrait = screens.find(
        screen => screen.title === 'Portrait screenshot',
      )
      if (portrait) {
        url = portrait.url
      } else {
        url = screens[0].url
      }
    }
  
    return  isSmall? (<img src={url ||  DefaultImg} alt={name} width="90%"/>) 
    :(
      <CardMedia className={classes.media} image={url || DefaultImg} title={name}>
        {children}
      </CardMedia>
    )
   
  }

  export default AssessmentImage