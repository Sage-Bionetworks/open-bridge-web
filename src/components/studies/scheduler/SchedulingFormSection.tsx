import React, { ReactNode } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { useErrorHandler } from 'react-error-boundary'
import { Box, FormControl, FormLabel } from '@material-ui/core'
import { poppinsFont } from '../../../style/theme'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: '1px solid #BBC3CD'
  },
  formControl: {
    flexDirection: 'row',
    textAlign:'left',

    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'flex-start',
  },
  label: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(4),
    width: theme.spacing(28),
    fontFamily: poppinsFont,
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 600,

    textAlign: 'left',

    '&.small': {
      paddingRight: theme.spacing(2),
      width: theme.spacing(12),
      lineHeight: 1.4,
      fontWeight: 400,
      fontSize: '16px',

    }
  },

}))

export interface SchedulingFormSectionProps {
  label: string | Element
  children: ReactNode
  style?: React.CSSProperties
  variant?: 'small'
}

const SchedulingFormSection: React.FunctionComponent<SchedulingFormSectionProps> = ({
  label,
  style,
  variant,
  children,
 
}: SchedulingFormSectionProps) => {
  const classes = useStyles()
  console.log('style', style)

  return (
    <>
      <Box className={clsx(classes.root, variant==="small"&& 'small')} style={style} >
        <FormControl component="div" className={classes.formControl}>
          <FormLabel component="label" className={clsx(classes.label, variant==="small"&& 'small')} >
            {label}
          </FormLabel>
          {children}
        </FormControl>
      </Box>
    </>
  )
}

export default SchedulingFormSection
