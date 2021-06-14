import { FormControl, makeStyles } from '@material-ui/core'
import React from 'react'
import { Study, StudyAppDesign } from '../../../types/types'
import FormGroupWrapper from './FormGroupWrapper'
import Subsection from './Subsection'
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
  SimpleTextInputStyles: React.CSSProperties
  onUpdate: Function
  study: Study
}

const StudySummarySection: React.FunctionComponent<StudySummarySectionProps> = ({
  appDesignProperties,
  setAppDesignProperties,
  SimpleTextInputStyles,
  onUpdate,
  study,
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
            onBlur={() => {
              const updatedStudy = { ...study }
              updatedStudy.name = appDesignProperties.studyTitle
              onUpdate(updatedStudy)
            }}
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
            onBlur={() => {
              const updatedStudy = { ...study }
              updatedStudy.details = appDesignProperties.studySummaryBody
              onUpdate(updatedStudy)
            }}
            multiline
            rows={8}
            rowsMax={10}
            placeholder="Body Copy"
            titleText="Body Copy (maximum 500 characters)*"
            maxWordCount={500}
          />
        </FormControl>
      </FormGroupWrapper>
    </Subsection>
  )
}

export default StudySummarySection
