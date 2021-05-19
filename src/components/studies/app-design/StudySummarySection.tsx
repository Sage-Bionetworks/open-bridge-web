import React from 'react'
import { makeStyles } from '@material-ui/core'
import Subsection from './Subsection'
import { FormControl, FormGroup, Checkbox } from '@material-ui/core'
import { StudyAppDesign } from '../../../types/types'
import { playfairDisplayFont, poppinsFont } from '../../../style/theme'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'
import { AppDesignUpdateTypes } from './AppDesign'
import clsx from 'clsx'
import FormGroupWrapper from './FormGroupWrapper'

const useStyles = makeStyles(theme => ({
  firstFormElement: {
    marginTop: theme.spacing(2.5),
  },
  informationRowStyle: {
    fontFamily: playfairDisplayFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
  },
  studyNameInput: {
    width: '70%',
  },
}))

type StudySummarySectionProps = {
  appDesignProperties: StudyAppDesign
  setAppDesignProperties: Function
  updateAppDesignInfo: Function
  SimpleTextInputStyles: React.CSSProperties
}

const StudySummarySection: React.FunctionComponent<StudySummarySectionProps> = ({
  appDesignProperties,
  setAppDesignProperties,
  updateAppDesignInfo,
  SimpleTextInputStyles,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="Study Summary">
      <FormGroupWrapper>
        <FormControl className={classes.firstFormElement}>
          <SimpleTextLabel htmlFor="study-name-input">
            Study Name*
          </SimpleTextLabel>
          <SimpleTextInput
            className={clsx(
              classes.informationRowStyle,
              classes.studyNameInput,
            )}
            id="study-name-input"
            placeholder="Headline"
            value={appDesignProperties.studyTitle}
            onChange={e => {
              setAppDesignProperties({
                ...appDesignProperties,
                studyTitle: e.target.value,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_NAME)
            }
            multiline
            rows={1}
            rowsMax={1}
            inputProps={{
              style: SimpleTextInputStyles,
            }}
          />
        </FormControl>
        <FormControl>
          <SimpleTextLabel>Body Copy (maximum 500 characters)</SimpleTextLabel>
          <SimpleTextInput
            id="study-body-text"
            value={appDesignProperties.studySummaryBody}
            onChange={e => {
              setAppDesignProperties({
                ...appDesignProperties,
                studySummaryBody: e.target.value,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_DESCRIPTION)
            }
            multiline
            rows={8}
            rowsMax={10}
            placeholder="Lorem ipsum"
            inputProps={{ style: { width: '100%' }, maxLength: 500 }}
          />
        </FormControl>
      </FormGroupWrapper>
    </Subsection>
  )
}

export default StudySummarySection
