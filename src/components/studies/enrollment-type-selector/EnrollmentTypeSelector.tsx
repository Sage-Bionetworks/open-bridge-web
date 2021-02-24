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

  const updateStudy = (clientData: {
    enrollmentType?: EnrollmentType
    isGenerateIds?: boolean
  }) => {
    let studyClientData = study.clientData || {}
    if (clientData.enrollmentType !== undefined) {
      studyClientData.enrollmentType = clientData.enrollmentType
      if(clientData.enrollmentType === 'PHONE') {
        clientData.isGenerateIds = undefined
      }
    }
    if (clientData.isGenerateIds !== undefined) {
      studyClientData.generateIds = clientData.isGenerateIds
    }
    onUpdate({ ...study, clientData: studyClientData })
  }

  return (
    <Box>
      <Paper>
        <Box px={3} py={2}>
          Enroll By: PHONE
          <Switch
            checked={study.clientData.enrollmentType === 'ID'}
            classes={{ root: classes.switchRoot }}
            onChange={e =>
              e.target.checked
                ? updateStudy({ enrollmentType: 'ID' })
                : updateStudy({ enrollmentType: 'PHONE' })
            }
            name="enrolment"
          />
          ID
          {study.clientData.enrollmentType === 'ID' && (
            <>
              &nbsp; &nbsp; &nbsp; Generate Ids:
              <Switch
                checked={study.clientData.generateIds || false}
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
