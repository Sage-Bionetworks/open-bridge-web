import {
  Box,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import clsx from 'clsx'
import React from 'react'
import NavigationPrompt from 'react-router-navigation-prompt'
import { latoFont, poppinsFont, ThemeType } from '../../../style/theme'
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
    backgroundImage: 'linear-gradient(#b6b6b6 1px, transparent 1px)',
    backgroundSize: '20px 60px',
    paddingTop: '180px',
    backgroundClip: 'content-box',
  },
  additionalInfo: {
    fontFamily: latoFont,
    fontSize: '14px',
    borderTop: '1px solid rgb(0, 0, 0)',
    marginTop: theme.spacing(2),
    marginLeft: '-10px',
    marginRight: '-10px',
    padding: theme.spacing(0, 2),
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
    },
  },
  column: {
    marginTop: '-185px',
    marginRight: '10px',

    width: theme.spacing(32),
    '&$firstColumn': {
      background: 'none',
      boxShadow: 'none',
      textAlign: 'left',
      marginLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      '& table th': {
        fontFamily: latoFont,
        fontSize: '16px',
        fontWeight: 700,
      },
      '& table td': {
        textAlign: 'left',
        fontFamily: poppinsFont,
        fontSize: '12px',
        lineHeight: '18px',
      },
    },
  },

  firstColumn: {},
  notFirstColumn: {
    '& table th > span ': {
      padding: theme.spacing(0, 6),
      textAlign: 'center',
      display: 'block',
      fontFamily: poppinsFont,
      fontSize: '14px',
      fontWeight: 700,
      lineHeight: '21px',
    },
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

const ROW_HEADINGS = [
  'Anonymous enrollment',
  'Participant receives SMS with link to download app',
  'Allows participant to enroll in multiple studies',
  'More secure method of verification',
  'Does not require PHI IRB approval',
]

const PHONE_SELECTIONS = [false, true, true, true, false]

const ID_SELECTIONS = [true, false, false, false, true]

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

  return (
    <>
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
                  {ROW_HEADINGS.map(item => (
                    <tr key={item}>
                      <td>{item}</td>
                    </tr>
                  ))}
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
                      <span>
                        ENROLL WITH
                        <br /> PHONE NUMBERS
                      </span>
                      <Box
                        className={classes.additionalInfo}
                        hidden={study.clientData.enrollmentType !== 'PHONE'}
                      >
                        <Box px={1} py={2}>
                          In using phone numbers, I confirm that I have
                          participant consent to add their numbers.
                        </Box>
                      </Box>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PHONE_SELECTIONS.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item ? (
                          <CheckIcon titleAccess={ROW_HEADINGS[index]} />
                        ) : (
                          ' '
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Paper>

          <Paper
            className={clsx(
              classes.column,
              classes.notFirstColumn,
              study.clientData.enrollmentType === 'ID' &&
                classes.selectedColumn,
            )}
            onClick={() => updateStudy({ enrollmentType: 'ID' })}
          >
            <div>
              <table width="100%" className={classes.table}>
                <thead>
                  <tr>
                    <th style={{ height: '186px' }}>
                      <span>
                        ENROLL WITH <br />
                        PARTICIPANT CODE
                      </span>
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
                          onClick={e => e.stopPropagation()}
                          onChange={e => {
                            e.preventDefault()
                            e.stopPropagation()

                            updateStudy({
                              isGenerateIds: e.target.value === 'true',
                            })
                          }}
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
                  {ID_SELECTIONS.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item ? (
                          <CheckIcon titleAccess={ROW_HEADINGS[index]} />
                        ) : (
                          ' '
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Paper>
        </Box>
      </Box>
      {children}
    </>
  )
}

export default EnrollmentTypeSelector
