import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Switch
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import NavigationPrompt from 'react-router-navigation-prompt'
import { ThemeType } from '../../../style/theme'
import {
  EnrollmentType,
  Study,
  StudyBuilderComponentProps
} from '../../../types/types'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
import { MTBHeadingH1 } from '../../widgets/Headings'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
  },
  container: {
    /* backgroundImage: 'linear-gradient(0deg, #b6b6b6 0.94%, #ffffff 0.94%, #ffffff 50%, #b6b6b6 50%, #b6b6b6 50.94%, #ffffff 50.94%, #ffffff 100%)',
     backgroundSize: '106.00px 106.00px'*/
    backgroundImage: 'linear-gradient(#b6b6b6 1px, transparent 1px)',
    backgroundSize: '20px 60px',
    paddingTop: '180px',
    backgroundClip: 'content-box',
  },
  additionalInfo: {
    borderTop: '1px solid rgb(0, 0, 0)',
    marginTop: '32px',
    marginLeft: '-10px',
    marginRight: '-10px',
    padding: '0 10px',
  },
  table: {
    width: '100%',
    borderSpacing: '0',

    '& th': {
      borderBottom: '1px solid #b6b6b6 ',
      height: '186px',
    },
    '& td': {
      borderBottom: '1px solid #b6b6b6 ',
      textAlign: 'center',
      height: theme.spacing(7.5),
    },
    '& tr:last-child td': {
      borderBottom: 'none',
      padding: '20px',
    },
  },
  column: {
    marginTop: '-185px',
    marginRight: '10px',
    paddingBottom: '8px',
    width: theme.spacing(32),
    '&$firstColumn': {
      background: 'none',
      boxShadow: 'none',
      textAlign: 'left',
      paddingLeft: '10px',
      '& table td': { textAlign: 'left' },
    },
  },

  header1: {
    backgroundColor: 'white',
    verticalAlign: 'top',
    padding: 0,
  },

  firstColumn: {},
  notFirstColumn: {
    '&:hover ': {
      border: '10px solid #CBDEE9',
      cursor: 'pointer',

      '& > div': {
        marginTop: '-10px',
      },
    },
  },
  selectedColumn: {
    border: '10px solid #CBDEE9',
    '& th': {
      backgroundColor: '#CBDEE9',
    },
    '& > div': {
      marginTop: '-10px',
    },
  },
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
      if (clientData.enrollmentType === 'PHONE') {
        clientData.isGenerateIds = undefined
      }
    }
    if (clientData.isGenerateIds !== undefined) {
      studyClientData.generateIds = clientData.isGenerateIds
    }
    onUpdate({ ...study, clientData: studyClientData })
  }

  return (<>
       <NavigationPrompt when={hasObjectChanged}>
          {({ onConfirm, onCancel }) => (
            <ConfirmationDialog
              isOpen={hasObjectChanged}
              type={'NAVIGATE'}
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          )}
        </NavigationPrompt>
        
    <Box pt={9} pr={11} pb={11} pl={14} bgcolor="#FAFAFA">
      <MTBHeadingH1>
        {' '}
        How will you enroll your participants into this study?{' '}
      </MTBHeadingH1>

      <Box display="flex" mt={4} className={classes.container}>
        <Paper
          className={clsx(classes.column, classes.firstColumn)}
          elevation={2}
        >
          <div>
            <table width="100%" className={classes.table}>
              <thead>
                <tr>
                  <th>Select enrollment type:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Anonymous enrollment</td>
                </tr>
                <tr>
                  <td>Participant receives SMS with link to download app</td>
                </tr>
                <tr>
                  <td>Allows participant to enroll in multiple studies</td>
                </tr>
                <tr>
                  <td>More secure method of verification</td>
                </tr>
                <tr>
                  <td>Does not require PHI IRB approval</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Paper>
        <Paper
          className={clsx(
            classes.column,
            classes.notFirstColumn,
            study.clientData.enrollmentType === 'PHONE' &&
              classes.selectedColumn,
          )}
          elevation={2}
          onClick={() => updateStudy({ enrollmentType: 'PHONE' })}
        >
          <div>
            <table width="100%" className={classes.table}>
              <thead>
                <tr>
                  <th>
                    {' '}
                    <span>ENROLL WITH PHONE NUMBERS</span>
                    <Box
                      className={classes.additionalInfo}
                      style={{ textAlign: 'left' }}
                      hidden={study.clientData.enrollmentType !== 'PHONE'}
                    >
                      <FormControlLabel
                      style={{marginTop: "16px", alignItems: "start"}}
                      labelPlacement="end"
                      
                        control={
                          <Checkbox
                          style={{paddingTop: "3px"}}
                            checked={study.clientData.enrollmentType === 'ID'}
                            onChange={e =>
                              e.target.checked
                                ? updateStudy({ enrollmentType: 'ID' })
                                : updateStudy({ enrollmentType: 'PHONE' })
                            }
                          />
                        }
                        label=" I confirm that I have participant consent to add their
            numbers."
                      />
                    </Box>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <td>x</td>
                </tr>
                <tr>
                  <td>x</td>
                </tr>
                <tr>
                  <td>x</td>
                </tr>
                <tr>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>{' '}
        </Paper>

        <Paper
          className={clsx(
            classes.column,
            classes.notFirstColumn,
            study.clientData.enrollmentType === 'ID' && classes.selectedColumn,
          )}
          onClick={() => updateStudy({ enrollmentType: 'ID' })}
        >
          <div>
            <table width="100%" className={classes.table}>
              <thead>
                <tr>
                  <th style={{ height: '186px' }}>
                    {' '}
                    <span>ENROLL WITH PARTICIPANT CODE</span>
                    <Box
                      className={classes.additionalInfo}
                      style={{ textAlign: 'left' }}
                      hidden={study.clientData.enrollmentType !== 'ID'}
                    >
                      <RadioGroup
                        aria-label="How to generate Id"
                        name="generateIds"
                        style={{ marginTop: '5px' }}
                        value={study.clientData.generateIds}
                        onChange={e =>
                          updateStudy({
                            isGenerateIds: Boolean(e.target.value),
                          })
                        }
                      >
                        <FormControlLabel
                          value={false}
                          control={<Radio size="small" />}
                          label="Define my own IDs"
                        />

                        <FormControlLabel
                          value={true}
                          control={<Radio size="small" />}
                          label="Generate IDs for me"
                        />
                      </RadioGroup>
                    </Box>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>hi</td>
                </tr>
                <tr>
                  <td>hi</td>
                </tr>
                <tr>
                  <td>hi</td>
                </tr>
                <tr>
                  <td>hi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Paper>
      </Box>
      <Box px={3} py={2}>
        Enroll By: PHONE
        <Switch
          checked={study.clientData.enrollmentType === 'ID'}
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
              onChange={e => updateStudy({ isGenerateIds: e.target.checked })}
              name="enrolment"
            />
          </>
        )}
      </Box>

      {children}
    </Box>
  
  </>)
}

export default EnrollmentTypeSelector
