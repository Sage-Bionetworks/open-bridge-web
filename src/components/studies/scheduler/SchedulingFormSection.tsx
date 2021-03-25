import { FormControl, FormLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { ReactNode } from 'react'
import { latoFont, poppinsFont } from '../../../style/theme'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: '1px solid #BBC3CD',

    '&.no-border': {
      border: 'none',
    },
  },
  formControl: {
    flexDirection: 'row',
    textAlign: 'left',

    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'flex-start',

    '&.small': {
      alignItems: 'center',
    },
  },
  label: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(4),
    lineHeight: '27px',
    width: theme.spacing(28),
    [theme.breakpoints.down('md')]: {
      width: theme.spacing(12.5),
    },
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
      fontFamily: latoFont

    },
  },
}))

export interface SchedulingFormSectionProps {
  label: ReactNode
  altLabel?: string
  children: ReactNode
  style?: React.CSSProperties
  variant?: 'small'
  border?: boolean
  isHideLabel?: boolean
}

const SchedulingFormSection: React.FunctionComponent<SchedulingFormSectionProps> = ({
  label,
  style,
  variant,
  children,
  isHideLabel,
  altLabel,
  border = true,
}: SchedulingFormSectionProps) => {
  const classes = useStyles()

  return (
    <>
      <section
        className={clsx(
          classes.root,
          variant === 'small' && 'small',
          border === false && 'no-border',
        )}
        style={style}
        title ={`section ${ typeof label === 'string'? label: altLabel}`}
     
      >
        <FormControl
          component="div"
          className={clsx(classes.formControl, variant === 'small' && 'small')}
        >
          <FormLabel
            component="label"
            className={clsx(
              typeof label === 'string' && classes.label,
              variant === 'small' && 'small',
            )}
          >
            {!isHideLabel? label: ''}
          </FormLabel>
          {children}
        </FormControl>
      </section>
    </>
  )
}

export default SchedulingFormSection
