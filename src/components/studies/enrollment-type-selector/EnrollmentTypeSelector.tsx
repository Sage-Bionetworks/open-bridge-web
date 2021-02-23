import { Box, Paper, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ThemeType } from '../../../style/theme'
import {
  EnrollmentType,
  Study,
  StudyBuilderComponentProps
} from '../../../types/types'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
  },
  switchRoot: {},
}))

export interface EnrollmentTypeSelectorProps {
  study: Study
}

const EnrollmentTypeSelector: React.FunctionComponent<
  EnrollmentTypeSelectorProps & StudyBuilderComponentProps
> = ({
  study,
  onUpdate,
  hasObjectChanged,
  saveLoader,
  children,
}: EnrollmentTypeSelectorProps & StudyBuilderComponentProps) => {
  const classes = useStyles()

  const updateStudy = (options: {
    enrollmentType?: EnrollmentType
    isGenerateIds?: boolean
  }) => {
    let studyOptions = study.options || {}
    if (options.enrollmentType !== undefined) {
      studyOptions.enrollmentType = options.enrollmentType
      if(options.enrollmentType === 'PHONE') {
        options.isGenerateIds = undefined
      }
    }
    if (options.isGenerateIds !== undefined) {
      studyOptions.generateIds = options.isGenerateIds
    }
    onUpdate({ ...study, options: studyOptions })
  }

  return (
    <Box>
      <Paper>
        <Box px={3} py={2}>
          Enroll By: PHONE
          <Switch
            checked={study.options?.enrollmentType === 'ID'}
            classes={{ root: classes.switchRoot }}
            onChange={e =>
              e.target.checked
                ? updateStudy({ enrollmentType: 'ID' })
                : updateStudy({ enrollmentType: 'PHONE' })
            }
            name="enrolment"
          />
          ID
          {study.options?.enrollmentType === 'ID' && (
            <>
              &nbsp; &nbsp; &nbsp; Generate Ids:
              <Switch
                checked={study.options.generateIds || false}
                classes={{ root: classes.switchRoot }}
                onChange={e => updateStudy({ isGenerateIds: e.target.checked })}
                name="enrolment"
              />
            </>
          )}
        </Box>
      </Paper>
      {children}
    </Box>
  )
}

export default EnrollmentTypeSelector
