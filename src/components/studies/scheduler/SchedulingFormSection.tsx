import { Box, FormControl, FormLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { ReactNode } from 'react'
import { poppinsFont } from '../../../style/theme'


const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: '1px solid #BBC3CD',

    '&.no-border': {
      border: 'none'
    }

  },
  formControl: {
    flexDirection: 'row',
    textAlign:'left',

    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'flex-start',

    '&.small': {
      alignItems: 'center',
    }
  },
  label: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(4),
    width: theme.spacing(28),
    fontFamily: poppinsFont,
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 600,
    flexShrink: 0,


    textAlign: 'left',

    '&.small': {
      paddingRight: theme.spacing(2),
      width: theme.spacing(12),
      lineHeight: 1.4,
      fontWeight: 400,
      fontSize: '14px',

    }
  },

}))

export interface SchedulingFormSectionProps {
  label: ReactNode
  children: ReactNode
  style?: React.CSSProperties
  variant?: 'small'
  border?: boolean
}

const SchedulingFormSection: React.FunctionComponent<SchedulingFormSectionProps> = ({
  label,
  style,
  variant,
  children,
  border=true
 
}: SchedulingFormSectionProps) => {
  const classes = useStyles()


  return (
    <>
      <Box className={clsx(classes.root, variant==="small"&& 'small', border===false && 'no-border')} style={style} >
        <FormControl component="div" className={clsx(classes.formControl, variant==="small"&& 'small')}>
          <FormLabel component="label" className={clsx((typeof label === "string" && classes.label), variant==="small"&& 'small')} >
            {label}
          </FormLabel>
          {children}
        </FormControl>
      </Box>
    </>
  )
}

export default SchedulingFormSection
