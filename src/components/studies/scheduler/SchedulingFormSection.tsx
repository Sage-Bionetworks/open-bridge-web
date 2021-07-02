import {FormControl, FormLabel} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import clsx from 'clsx'
import React, {ReactNode} from 'react'
import {latoFont, poppinsFont} from '../../../style/theme'

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

    alignContent: 'center',
    alignItems: 'flex-start',

    '&.small': {
      alignItems: 'center',
      margin: '0 40px',
    },
  },
  label: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(4),
    lineHeight: '27px',
    width: theme.spacing(28),

    fontFamily: poppinsFont,
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 600,
    flexShrink: 0,
    textAlign: 'left',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
      width: theme.spacing(10),
    },
    '&.Mui-focused': {
      color: 'inherit',
    },

    '&.small': {
      paddingRight: theme.spacing(2),
      width: theme.spacing(12),
      lineHeight: 1.4,
      fontWeight: 400,
      fontSize: '14px',
      fontFamily: latoFont,
      [theme.breakpoints.down('md')]: {
        '&.collapseLabelSmall': {
          width: 0,
        },
      },
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
  isCollapseLabelSmall?: boolean
  justifyContent?: 'flex-start' | 'space-between'
}

const SchedulingFormSection: React.FunctionComponent<SchedulingFormSectionProps> =
  ({
    label,
    style,
    variant,
    children,
    isHideLabel,
    altLabel,
    isCollapseLabelSmall,
    border = true,
    justifyContent = 'flex-start',
  }: SchedulingFormSectionProps) => {
    const classes = useStyles()

    return (
      <>
        <section
          className={clsx(
            classes.root,
            variant === 'small' && 'small',
            border === false && 'no-border'
          )}
          style={style}
          title={`section ${typeof label === 'string' ? label : altLabel}`}>
          <FormControl
            component="div"
            style={{justifyContent: justifyContent}}
            className={clsx(
              classes.formControl,
              variant === 'small' && 'small'
            )}>
            <FormLabel
              component="label"
              className={clsx(
                /*typeof label === 'string'*/ true && classes.label,
                variant === 'small' && 'small',
                isCollapseLabelSmall && 'collapseLabelSmall'
              )}>
              {!isHideLabel ? label : ''}
            </FormLabel>
            {children}
          </FormControl>
        </section>
      </>
    )
  }

export default SchedulingFormSection
