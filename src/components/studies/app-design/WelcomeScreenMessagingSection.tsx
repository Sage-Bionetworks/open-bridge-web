import React from 'react'
import { makeStyles } from '@material-ui/core'
import Subsection from './Subsection'
import {
  Box,
  CircularProgress,
  FormControl,
  FormGroup,
  Checkbox,
} from '@material-ui/core'
import { StudyAppDesign } from '../../../types/types'
import { playfairDisplayFont, poppinsFont } from '../../../style/theme'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'
import SaveButton from '../../widgets/SaveButton'
import { AppDesignUpdateTypes } from './AppDesign'
import FormGroupWrapper from './FormGroupWrapper'

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
  appDesignProperties: StudyAppDesign
  setAppDesignProperties: Function
  updateAppDesignInfo: Function
  saveLoader: boolean
  saveInfo: Function
  SimpleTextInputStyles: React.CSSProperties
}

const WelcomeScreenMessagingSection: React.FunctionComponent<WelcomeScreenMessagingSectionProps> = ({
  appDesignProperties,
  setAppDesignProperties,
  updateAppDesignInfo,
  saveInfo,
  saveLoader,
  SimpleTextInputStyles,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="Welcome screen messaging">
      <FormGroupWrapper>
        <FormControl className={classes.firstFormElement}>
          <SimpleTextLabel htmlFor="headline-input">
            Main Header
          </SimpleTextLabel>
          <SimpleTextInput
            className={classes.headlineStyle}
            id="headline-input"
            placeholder="Welcome Headline"
            value={appDesignProperties.welcomeScreenInfo.welcomeScreenHeader}
            onChange={e => {
              const newWelcomeScreenData = {
                ...appDesignProperties.welcomeScreenInfo,
              }
              newWelcomeScreenData.welcomeScreenHeader = e.target.value
              setAppDesignProperties({
                ...appDesignProperties,
                welcomeScreenInfo: newWelcomeScreenData,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(
                AppDesignUpdateTypes.UPDATE_WELCOME_SCREEN_INFO,
              )
            }
            multiline
            rows={2}
            rowsMax={4}
            inputProps={{
              style: { fontSize: '24px', width: '100%' },
            }}
          />
        </FormControl>
        <FormControl>
          <SimpleTextLabel>Body Copy (maximum 250 characters)</SimpleTextLabel>
          <SimpleTextInput
            id="outlined-textarea"
            value={appDesignProperties.welcomeScreenInfo.welcomeScreenBody}
            onChange={e => {
              const newWelcomeScreenData = {
                ...appDesignProperties.welcomeScreenInfo,
              }
              newWelcomeScreenData.welcomeScreenBody = e.target.value
              setAppDesignProperties({
                ...appDesignProperties,
                welcomeScreenInfo: newWelcomeScreenData,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(
                AppDesignUpdateTypes.UPDATE_WELCOME_SCREEN_INFO,
              )
            }
            multiline
            rows={4}
            rowsMax={6}
            placeholder="What are the first things you want participants to know about the study."
            inputProps={{ style: { width: '100%' }, maxLength: 250 }}
          />
        </FormControl>
        <FormControl>
          <SimpleTextLabel>Salutations</SimpleTextLabel>
          <SimpleTextInput
            id="salutations"
            value={
              appDesignProperties.welcomeScreenInfo.welcomeScreenSalutation
            }
            onChange={e => {
              const newWelcomeScreenData = {
                ...appDesignProperties.welcomeScreenInfo,
              }
              newWelcomeScreenData.welcomeScreenSalutation = e.target.value
              setAppDesignProperties({
                ...appDesignProperties,
                welcomeScreenInfo: newWelcomeScreenData,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(
                AppDesignUpdateTypes.UPDATE_WELCOME_SCREEN_INFO,
              )
            }
            multiline
            rows={2}
            rowsMax={4}
            placeholder="Thank you for your contribution"
            inputProps={{ style: SimpleTextInputStyles }}
          />
        </FormControl>
        <FormControl>
          <SimpleTextLabel>From</SimpleTextLabel>
          <SimpleTextInput
            id="signature-textarea"
            value={appDesignProperties.welcomeScreenInfo.welcomeScreenFromText}
            onChange={e => {
              const newWelcomeScreenData = {
                ...appDesignProperties.welcomeScreenInfo,
              }
              newWelcomeScreenData.welcomeScreenFromText = e.target.value
              setAppDesignProperties({
                ...appDesignProperties,
                welcomeScreenInfo: newWelcomeScreenData,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(
                AppDesignUpdateTypes.UPDATE_WELCOME_SCREEN_INFO,
              )
            }
            multiline
            rows={2}
            rowsMax={4}
            placeholder="Study team name"
            inputProps={{ style: SimpleTextInputStyles }}
          />
        </FormControl>
        <Box marginTop="20px">Add optional disclaimer:</Box>
        <div className={classes.optionalDisclaimerRow}>
          <Checkbox
            checked={
              appDesignProperties.welcomeScreenInfo.useOptionalDisclaimer
            }
            inputProps={{ 'aria-label': 'primary checkbox' }}
            className={classes.checkBox}
            id="disclaimer-check-box"
            onChange={() => {
              setAppDesignProperties((prevState: StudyAppDesign) => {
                const newWelcomeScreenData = {
                  ...prevState.welcomeScreenInfo,
                }
                newWelcomeScreenData.useOptionalDisclaimer = !prevState
                  .welcomeScreenInfo.useOptionalDisclaimer
                return {
                  ...appDesignProperties,
                  welcomeScreenInfo: newWelcomeScreenData,
                }
              })
            }}
          ></Checkbox>
          <div className={classes.optionalDisclaimerText}>
            This is a research study and does not provide medical advice,
            diagnosis, or treatment.
          </div>
        </div>
      </FormGroupWrapper>
      <Box textAlign="left">
        {saveLoader ? (
          <div className="text-center">
            <CircularProgress color="primary" size={25}></CircularProgress>
          </div>
        ) : (
          <SaveButton
            onClick={() => saveInfo()}
            id="save-button-study-builder-1"
          />
        )}
      </Box>
    </Subsection>
  )
}

export default WelcomeScreenMessagingSection
