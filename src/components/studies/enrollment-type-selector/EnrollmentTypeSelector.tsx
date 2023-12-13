import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import {BorderedTableCell} from '@components/widgets/StyledComponents'
import CheckIcon from '@mui/icons-material/Check'
import {
  Box,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import StudyService from '@services/study.service'
import {useStudy, useUpdateStudyDetail} from '@services/studyHooks'
import {theme} from '@style/theme'
import {SignInType, Study} from '@typedefs/types'
import _ from 'lodash'
import React from 'react'
import NavigationPrompt from 'react-router-navigation-prompt'

import {BuilderWrapper} from '../StudyBuilder'
import ReadOnlyEnrollmentTypeSelector from './read-only-pages/ReadOnlyEnrollmentTypeSelector'

const StyledTable = styled(Table, {label: 'StyledTable'})(({theme}) => ({
  borderSpacing: '0',
  width: '430px',
  boxShadow: '0px 4px 4px #EAECEE',
  '&:first-of-type': {
    width: '390px',
    '& .MuiTableCell-head ': {
      backgroundColor: 'transparent',
    },
    '& .MuiTableCell-root.MuiTableCell-body': {
      textAlign: 'left',
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      borderBottom: '1px solid #fff',
      fontWeight: 700,
    },
  },

  '& .MuiTableCell-head ': {
    backgroundColor: '#EDEEF2',
    height: '160px',
    padding: theme.spacing(2, 4),
    '& .MuiRadio-root': {
      padding: theme.spacing(0.5, 0.75),
      marginLeft: theme.spacing(2.75),
    },
    '& h3': {
      fontWeight: '800',
      fontSize: '18px',
      lineHeight: '22px',
    },
  },
  '& .MuiTableCell-root': {
    borderBottom: '1px solid #EAECEE',
    textAlign: 'center',

    '&.MuiTableCell-body': {
      height: '65px',
      padding: 0,
      verticalAlign: 'middle',
    },
  },
  '& TableRow:last-child .MuiTableCell': {
    borderBottom: 'none',
  },
}))

const ROW_HEADINGS = [
  'Anonymous enrollment',
  'Allows participant to enroll in multiple studies',
  'More secure method of verification',
  'Does not require PHI IRB approval',
]

// TODO: syoung 12/08/2023 Uncomment when/if we ever support phone sign-in
// const PHONE_SELECTIONS = [false, true, true, false]

const ID_SELECTIONS = [true, false, false, true]

export interface EnrollmentTypeSelectorProps {
  id: string
  children: React.ReactNode
}

const EnrollmentTypeSelector: React.FunctionComponent<EnrollmentTypeSelectorProps> = ({
  id,
  children,
}: EnrollmentTypeSelectorProps) => {
  const {data: study} = useStudy(id)
  const {mutateAsync: mutateStudy} = useUpdateStudyDetail()

  const [hasObjectChanged] = React.useState(false)
  const onUpdate = async (updatedStudy: Study) => {
    await mutateStudy({study: updatedStudy})
  }

  const updateStudy = (signInTypes: SignInType[], isGenerateIds?: boolean) => {
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
        isPhoneNumberSignInType={study.signInTypes && study.signInTypes[0] === 'phone_password'}
        children={children}
        studyId={study.identifier}
      />
    )
  }

  return (
    <>
      <NavigationPrompt when={hasObjectChanged}>
        {({onConfirm, onCancel}) => (
          <ConfirmationDialog isOpen={hasObjectChanged} type={'NAVIGATE'} onCancel={onCancel} onConfirm={onConfirm} />
        )}
      </NavigationPrompt>
      <BuilderWrapper sectionName="Participant Study Enrollment">
        <Typography variant="h3" sx={{marginBottom: theme.spacing(1), textAlign: 'left'}}>
          {' '}
          How Will You Enroll Your Participants Into This Study?{' '}
        </Typography>

        <Typography variant="h4" paragraph textAlign="left">
          All Studies Require A Smart Phone Device.{' '}
        </Typography>
        <Container maxWidth="md">
          <Box display="flex" mt={5}>
            <StyledTable
              sx={{
                boxShadow: 'none',
                textAlign: 'left',
                width: '390px',
                flexShrink: {
                  lg: 0,
                },
              }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{}}>&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ROW_HEADINGS.map((item, index) => (
                  <TableRow key={item}>
                    <BorderedTableCell
                      $isDark={index % 2 === 1}
                      sx={{
                        backgroundColor: index % 2 === 1 ? '#f4f4f7' : '#f8f8fa',
                      }}>
                      {item}
                    </BorderedTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>

            {/* TODO: syoung 10/23/2023 Revisit whether or not we ever need/want to support using a phone number to enroll participants.
            <StyledTable
              sx={{
                marginRight: theme.spacing(2),
                opacity: 0.5,
                outline: study.signInTypes && study.signInTypes[0] === 'phone_password' ? '2px solid blue' : 'none',
              }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {' '}
                    <Typography variant="h3">
                      Enroll With <br />
                      Phone Numbers
                    </Typography>
                    <Box hidden={!study.signInTypes.includes('phone_password')}>
                      <Box px={0} py={2}>
                        In using phone numbers, I confirm that I have participant consent to add their numbers.
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {PHONE_SELECTIONS.map((item, index) => (
                  <TableRow key={index}>
                    <BorderedTableCell $isDark={index % 2 === 1}>
                      {item ? (
                        <CheckIcon titleAccess={ROW_HEADINGS[index]} sx={{color: '#63A650', fontSize: '42px'}} />
                      ) : (
                        ' '
                      )}
                    </BorderedTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable> 
            */}

            <StyledTable
              onClick={() => updateStudy(['external_id_password'])}
              sx={{
                outline: study.signInTypes.includes('external_id_password') ? '6px solid #9499C7' : 'none',
              }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h3">
                      Enroll With <br />
                      Participant Code
                    </Typography>
                    <Box style={{textAlign: 'left'}} hidden={!study.signInTypes.includes('external_id_password')}>
                      <RadioGroup
                        aria-label="How to generate Id"
                        name="generateIds"
                        value={study.clientData.generateIds || false}
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                          e.preventDefault()
                          e.stopPropagation()

                          updateStudy(study.signInTypes, e.target.value === 'true')
                        }}>
                        <FormControlLabel
                          value={false}
                          control={<Radio color="secondary" size="small" />}
                          label="Define my own IDs"
                        />

                        <FormControlLabel
                          value={true}
                          control={<Radio color="secondary" size="small" />}
                          label="Generate IDs for me"
                        />
                      </RadioGroup>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ID_SELECTIONS.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item ? (
                        <CheckIcon sx={{color: '#63A650', fontSize: '42px'}} titleAccess={ROW_HEADINGS[index]} />
                      ) : (
                        ' '
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </Box>
        </Container>
      </BuilderWrapper>
      {children}
    </>
  )
}

export default EnrollmentTypeSelector
