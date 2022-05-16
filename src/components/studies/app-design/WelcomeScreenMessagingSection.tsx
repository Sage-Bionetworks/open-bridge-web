import {Box, Checkbox, FormControl} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {playfairDisplayFont} from '@style/theme'
import React from 'react'
import FormGroupWrapper from './widgets/FormGroupWrapper'
import TextInputWrapper from './widgets/TextInputWrapper'

const useStyles = makeStyles(theme => ({
  firstFormElement: {
    marginTop: theme.spacing(2.5),
  },
  headlineStyle: {
    fontFamily: playfairDisplayFont,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: '21px',
    lineHeight: '28px',
    whiteSpace: 'pre-line',
  },
  optionalDisclaimerRow: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(1.25),
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
  },
  checkBox: {
    width: '20px',
    height: '20px',
  },
  optionalDisclaimerText: {
    marginLeft: theme.spacing(2),
    fontSize: '14px',
    lineHeight: '20px',
    fontFamily: 'Lato',
  },
}))

type WelcomeScreenMessagingSectionProps = {
  SimpleTextInputStyles: React.CSSProperties
  onUpdate: (
    welcomeStringHeader: string,
    welcomeScreenBody: string,
    welcomeScreenSalutation: string,
    welcomeScreenFromText: string,
    useOptionalDisclaimer: boolean
  ) => void
  welcomeScreenHeader: string
  welcomeScreenBody: string
  welcomeScreenSalutation: string
  welcomeScreenFromText: string
  useOptionalDisclaimer: boolean
}

const WelcomeScreenMessagingSection: React.FunctionComponent<WelcomeScreenMessagingSectionProps> =
  ({
    SimpleTextInputStyles,
    onUpdate,
    welcomeScreenHeader,
    welcomeScreenBody,
    welcomeScreenSalutation,
    welcomeScreenFromText,
    useOptionalDisclaimer,
  }) => {
    const classes = useStyles()

    return (
      <FormGroupWrapper>
        <FormControl className={classes.firstFormElement}>
          <TextInputWrapper
            SimpleTextInputStyles={
              {fontSize: '24px', width: '100%'} as React.CSSProperties
            }
            id="headline-input"
            placeholder="Main Header"
            value={welcomeScreenHeader}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              onUpdate(
                e.target.value,
                welcomeScreenBody,
                welcomeScreenSalutation,
                welcomeScreenFromText,
                useOptionalDisclaimer
              )
            }}
            multiline
            rows={2}
            rowsMax={4}
            titleText="Main Header"
            alternativeTextInputClassName={classes.headlineStyle}
          />
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={{width: '100%'} as React.CSSProperties}
            id="outlined-textarea"
            value={welcomeScreenBody}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              onUpdate(
                welcomeScreenHeader,
                e.target.value,
                welcomeScreenSalutation,
                welcomeScreenFromText,
                useOptionalDisclaimer
              )
            }}
            multiline
            rows={4}
            rowsMax={6}
            placeholder="What are the first things you want participants to know about the study."
            titleText="Body Copy (maximum 250 characters)"
            alternativeTextInputClassName={'none'}
            maxWordCount={250}
          />
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="salutations"
            value={welcomeScreenSalutation}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              onUpdate(
                welcomeScreenHeader,
                welcomeScreenBody,
                e.target.value,
                welcomeScreenFromText,
                useOptionalDisclaimer
              )
            }}
            placeholder="Thank you for your contribution"
            titleText="Salutations"
          />
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="signature-textarea"
            value={welcomeScreenFromText}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              onUpdate(
                welcomeScreenHeader,
                welcomeScreenBody,
                welcomeScreenSalutation,
                e.target.value,
                useOptionalDisclaimer
              )
            }}
            placeholder="Study team name"
            titleText="From"
          />
        </FormControl>
        <Box mt={2.5}>Add optional disclaimer:</Box>
        <div className={classes.optionalDisclaimerRow}>
          <Checkbox
            checked={useOptionalDisclaimer}
            inputProps={{'aria-label': 'primary checkbox'}}
            className={classes.checkBox}
            id="disclaimer-check-box"
            onChange={() => {
              onUpdate(
                welcomeScreenHeader,
                welcomeScreenBody,
                welcomeScreenSalutation,
                welcomeScreenFromText,
                !useOptionalDisclaimer
              )
            }}></Checkbox>
          <div className={classes.optionalDisclaimerText}>
            This is a research study and does not provide medical advice,
            diagnosis, or treatment.
          </div>
        </div>
      </FormGroupWrapper>
    )
  }

export default WelcomeScreenMessagingSection
