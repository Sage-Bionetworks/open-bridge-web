import {FormControl, makeStyles} from '@material-ui/core'
import React from 'react'
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
  SimpleTextInputStyles: React.CSSProperties
  onUpdate: (studyTitle: string, studySummaryBody: string) => void
  studyTitle: string
  studySummaryBody: string
  studySummaryCopyHasError: boolean
  studyTitleHasError: boolean
}

const StudySummarySection: React.FunctionComponent<StudySummarySectionProps> = ({
  SimpleTextInputStyles,
  onUpdate,
  studyTitle,
  studySummaryBody,
  studySummaryCopyHasError,
  studyTitleHasError,
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
            value={studyTitle}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              onUpdate(e.target.value, studySummaryBody)
            }}
            titleText="Study Name*"
            extraClassname={classes.studyNameInput}
            hasError={studyTitleHasError}
          />
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={{width: '100%'} as React.CSSProperties}
            id="study-body-text"
            value={studySummaryBody}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              onUpdate(studyTitle, e.target.value)
            }}
            multiline
            rows={8}
            rowsMax={10}
            placeholder="Body Copy"
            titleText="Body Copy (maximum 500 characters)*"
            maxWordCount={500}
            hasError={studySummaryCopyHasError}
          />
        </FormControl>
      </FormGroupWrapper>
    </Subsection>
  )
}

export default StudySummarySection
