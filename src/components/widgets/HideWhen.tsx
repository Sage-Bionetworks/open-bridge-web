import React from 'react'

import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles({
  root: {},
})

export interface HideWhenProps {
  hideWhen: boolean
}

const HideWhen: React.FunctionComponent<HideWhenProps> = props => {
  const children = React.Children.toArray(props.children)

  if (children.length === 1) {
    const visibility = props.hideWhen ? 'hidden' : 'visible'
    const style = {
      ...(children[0] as React.ReactElement<any>).props.style,
      visibility,
    }
    console.log(style, 'style')

    return React.cloneElement(children[0] as React.ReactElement<any>, {
      style: style,
    })
  }

  if (children.length === 2) {
    return props.hideWhen
      ? (children[1] as React.ReactElement<any>)
      : (children[0] as React.ReactElement<any>)
  }

  return <></>
}

export default HideWhen
