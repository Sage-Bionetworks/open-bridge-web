import React from 'react'
import { makeStyles } from '@material-ui/core'
import Subsection from './Subsection'
import { FormControl } from '@material-ui/core'
import { StudyAppDesign } from '../../../types/types'
import { AppDesignUpdateTypes } from './AppDesign'
import FormGroupWrapper from './FormGroupWrapper'
import TextInputWrapper from './TextInputWrapper'

const useStyles = makeStyles(theme => ({
  firstFormElement: {
    marginTop: theme.spacing(2.5),
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
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="study-name-input"
            placeholder="Headline"
            value={appDesignProperties.studyTitle}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
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
            titleText="Study Name*"
            extraClassname={classes.studyNameInput}
          />
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={{ width: '100%' } as React.CSSProperties}
            id="study-body-text"
            value={appDesignProperties.studySummaryBody}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
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
            titleText="Body Copy (maximum 500 characters)"
            maxWordCount={500}
          />
        </FormControl>
      </FormGroupWrapper>
    </Subsection>
  )
}

export default StudySummarySection
