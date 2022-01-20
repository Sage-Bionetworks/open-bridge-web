import {
  Box,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import StudyService from '@services/study.service'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'
import {useErrorHandler} from 'react-error-boundary'
import NavigationPrompt from 'react-router-navigation-prompt'
import {latoFont, poppinsFont, ThemeType} from '../../../style/theme'
import {SignInType, Study} from '../../../types/types'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
import {MTBHeadingH1} from '../../widgets/Headings'
import {useStudy, useUpdateStudyDetail} from '../studyHooks'
import ReadOnlyEnrollmentTypeSelector from './read-only-pages/ReadOnlyEnrollmentTypeSelector'

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
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: '14px',
    borderTop: '1px solid rgb(0, 0, 0)',
    marginTop: theme.spacing(2),
    marginLeft: '-10px',
    marginRight: '-10px',
    padding: theme.spacing(0, 3),
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

    width: theme.spacing(32.5),
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

  firstColumn: {
    width: theme.spacing(21),
    flexShrink: 0,
  },
  heading: {
    padding: theme.spacing(0, 6),
    textAlign: 'center',
    //display: 'block',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  notFirstColumn: {
    width: theme.spacing(32),
    '& table th > span ': {
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
  notFirstColumnDisabled: {
    width: theme.spacing(32),
    backgroundColor: '#ccc',
    opacity: 0.7,
    '& table th > span ': {
      textAlign: 'center',
      display: 'block',

      fontFamily: poppinsFont,
      fontSize: '14px',
      fontWeight: 700,
      lineHeight: '21px',
      opacity: 0.8,
    },
  },
  selectedColumn: {
    border: '10px solid #CBDEE9',
    '& th': {
      backgroundColor: '#CBDEE9',
    },

    '& $heading': {
      paddingTop: theme.spacing(3),
    },
    '& > div': {
      marginTop: '-10px',
    },
  },
}))

const ROW_HEADINGS = [
  'Anonymous enrollment',
  'Allows participant to enroll in multiple studies',
  'More secure method of verification',
  'Does not require PHI IRB approval',
]

const PHONE_SELECTIONS = [false, true, true, false]

const ID_SELECTIONS = [true, false, false, true]

export interface EnrollmentTypeSelectorProps {
  id: string
  children: React.ReactNode
}

const EnrollmentTypeSelector: React.FunctionComponent<EnrollmentTypeSelectorProps> =
  ({id, children}: EnrollmentTypeSelectorProps) => {
    const classes = useStyles()

    const {data: study, error, isLoading} = useStudy(id)

    const {
      isSuccess: scheduleUpdateSuccess,
      isError: scheduleUpdateError,
      mutateAsync: mutateStudy,
      data,
    } = useUpdateStudyDetail()

    const [hasObjectChanged, setHasObjectChanged] = React.useState(false)

    const handleError = useErrorHandler()
    const [saveLoader, setSaveLoader] = React.useState(false)

    const onUpdate = async (updatedStudy: Study) => {
      const x = await mutateStudy({study: updatedStudy})
    }

    const updateStudy = (
      signInTypes: SignInType[],
      isGenerateIds?: boolean
    ) => {
      if (!study) {
        return
      }
      let studyClientData = study.clientData || {}
      if (isGenerateIds !== undefined) {
        studyClientData.generateIds = isGenerateIds
      }

      if (!_.isEmpty(signInTypes)) {
        // studyClientData.signInType = clientData.signInType
        if (signInTypes.includes('phone_password')) {
          studyClientData.generateIds = undefined
        }
      }

      onUpdate({
        ...study,
        clientData: studyClientData,
        signInTypes: signInTypes,
      })
    }

    if (!study) {
      return <></>
    }

    if (!StudyService.isStudyInDesign(study)) {
      return (
        <ReadOnlyEnrollmentTypeSelector
          isIdGenerated={study.clientData.generateIds}
          isPhoneNumberSignInType={
            study.signInTypes && study.signInTypes[0] === 'phone_password'
          }
          children={children}
          studyId={study.identifier}
        />
      )
    }

    return (
      <>
        <NavigationPrompt when={hasObjectChanged}>
          {({onConfirm, onCancel}) => (
            <ConfirmationDialog
              isOpen={hasObjectChanged}
              type={'NAVIGATE'}
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          )}
        </NavigationPrompt>

        <Box pt={9} pr={12} pb={11} pl={6} bgcolor="#FAFAFA">
          <MTBHeadingH1>
            {' '}
            How will you enroll your participants into this study?{' '}
          </MTBHeadingH1>

          <Box display="flex" mt={9} className={classes.container}>
            <Paper
              className={clsx(classes.column, classes.firstColumn)}
              elevation={2}>
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
                classes.notFirstColumnDisabled,

                study.signInTypes &&
                  study.signInTypes[0] === 'phone_password' &&
                  classes.selectedColumn
              )}
              elevation={2}

              /*onClick={() => updateStudy(['phone_password'] as SignInType[])}*/
            >
              <div>
                <table width="100%" className={classes.table}>
                  <thead>
                    <tr>
                      <th>
                        {' '}
                        <span className={classes.heading}>
                          ENROLL WITH
                          <br /> PHONE NUMBERS
                        </span>
                        <Box
                          className={classes.additionalInfo}
                          hidden={
                            !study.signInTypes.includes('phone_password')
                          }>
                          <Box px={0} py={2}>
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
                study.signInTypes.includes('external_id_password') &&
                  classes.selectedColumn
              )}
              onClick={() => updateStudy(['external_id_password'])}>
              <div>
                <table width="100%" className={classes.table}>
                  <thead>
                    <tr>
                      <th style={{height: '186px'}}>
                        <span className={classes.heading}>
                          ENROLL WITH <br />
                          PARTICIPANT CODE
                        </span>
                        <Box
                          className={classes.additionalInfo}
                          style={{textAlign: 'left'}}
                          hidden={
                            !study.signInTypes.includes('external_id_password')
                          }>
                          <RadioGroup
                            aria-label="How to generate Id"
                            name="generateIds"
                            style={{marginTop: '8px'}}
                            value={study.clientData.generateIds || false}
                            onClick={e => e.stopPropagation()}
                            onChange={e => {
                              e.preventDefault()
                              e.stopPropagation()

                              updateStudy(
                                study.signInTypes,
                                e.target.value === 'true'
                              )
                            }}>
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
