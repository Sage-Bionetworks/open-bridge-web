import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { ReactComponent as ArrowIcon } from '../../../assets/arrow_long.svg'
import { ReactComponent as EnvelopeImg } from '../../../assets/launch/envelope_icon.svg'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import { ThemeType } from '../../../style/theme'
import { Study } from '../../../types/types'
import DatePicker from '../../widgets/DatePicker'
import { MTBHeadingH1, MTBHeadingH2 } from '../../widgets/Headings'
import {
  SimpleTextInput,
  SimpleTextLabel,
  AlertWithText,
} from '../../widgets/StyledComponents'
import LeadInvestigatorDropdown from '../app-design/LeadInvestigatorDropdown'
import Alert_Icon from '../../../assets/alert_icon.svg'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
  },
  continueButton: {
    // display: 'block',
    marginTop: theme.spacing(7),
    '& svg': {
      marginLeft: theme.spacing(2),
      transform: 'scaleX(-1)',
      '& path': {
        fill: '#fcfcfc',
      },
    },
  },
  input: {
    height: '44px',
  },
  alertText: {
    fontSize: '18px',
    backgroundColor: 'transparent',
    color: 'black',
  },
}))

export interface IrbDetailsProps {
  study: Study
  isFinished: boolean
}

const LastScreen: React.FunctionComponent<{ study: Study }> = ({
  study,
}: {
  study: Study
}) => {
  const classes = useStyles()
  return (
    <Box textAlign="center">
      <EnvelopeImg />
      <MTBHeadingH1 style={{ margin: '24px 0', textDecoration: 'underline' }}>
        {' '}
        Almost there!{' '}
      </MTBHeadingH1>
      <p>
        Please email a copy of your IRB <br />
        Approval/Exempt letter to:
      </p>
      <p>
        <a href="mailto:ACT@synapse.org">ACT@synapse.org</a>
      </p>
      <Button
        href={'/studies/:id/study-live'.replace(':id', study.identifier)}
        variant="contained"
        className={classes.continueButton}
        color="primary"
      >
        {' '}
        Continue <ArrowIcon />
      </Button>
    </Box>
  )
}

type irbStudyDataType = {
  principleInvestigatorName: string
  nameOfIrbRecord: string
  irbRecordSameInstitutionalAffiliation: boolean
  institutionalAffiliation: string
  irbProtocolId: string
  irbProtocolTitle: string
  irbApprovalDate: Date | null
  irbApprovedUntil: Date | null
  irbExemptDate: Date | null
}

const IrbDetails: React.FunctionComponent<IrbDetailsProps> = ({
  study,
  isFinished,
}: IrbDetailsProps) => {
  const inputStyles = {
    width: '100%',
  } as React.CSSProperties

  const classes = useStyles()
  const { token, orgMembership } = useUserSessionDataState()
  const [studyData, setStudyData] = React.useState<irbStudyDataType>()
  const [certifyStatements, setCertifyStatement] = React.useState({
    isStudyProtocolReviewed: false,
    isStudyConsistentWithLaws: false,
  })
  const [irbDecisionIsApproved, setIrbDecisionIsApproved] = React.useState(true)
  useEffect(() => {
    const irbProtocolId = study.irbProtocolId || ''
    const studyContacts = study.contacts || []
    const principleInvestigator = studyContacts.find(
      el => el.role === 'principal_investigator',
    )
    const principleInvestigatorName = principleInvestigator?.name || ''
    const institutionalAffiliation = principleInvestigator?.affiliation || ''
    const irbRecord = studyContacts.find(el => el.role === 'irb')
    const nameOfIrbRecord = irbRecord?.name || ''
    const irbRecordSameInstitutionalAffiliation =
      nameOfIrbRecord === institutionalAffiliation
    const irbStudyData = {
      principleInvestigatorName: principleInvestigatorName,
      nameOfIrbRecord: nameOfIrbRecord,
      irbRecordSameInstitutionalAffiliation: irbRecordSameInstitutionalAffiliation,
      institutionalAffiliation: institutionalAffiliation,
      irbProtocolId: irbProtocolId,
      irbProtocolTitle: '',
      irbApprovalDate: null,
      irbApprovedUntil: null,
      irbExemptDate: null,
    }
    setStudyData(irbStudyData)
  }, [])

  const updateStudyData = (type: string) => {
    if (type === 'update_radio') {
      setStudyData({
        ...studyData!,
        irbRecordSameInstitutionalAffiliation: false,
      })
    }
  }

  return (
    <>
      {!isFinished && (
        <Box textAlign="left">
          <MTBHeadingH2>IRB Details &amp; Certification</MTBHeadingH2>
          <Box mt={2} mb={2} fontSize="16px" fontFamily="Lato">
            I certify that
          </Box>
          <Box pl={3} mb={4}>
            <FormControlLabel
              key="confirmReviewed"
              control={
                <Checkbox
                  checked={certifyStatements.isStudyProtocolReviewed}
                  onChange={event => {
                    setCertifyStatement(prevState => {
                      return {
                        ...prevState,
                        isStudyProtocolReviewed: !prevState.isStudyProtocolReviewed,
                      }
                    })
                  }}
                  name="confirmReviewed"
                  color="primary"
                />
              }
              label="The study protocol was reviewed by the IRB and /or equivalent body listed below."
            />
            <FormControlLabel
              key="confirmConsistent"
              control={
                <Checkbox
                  checked={certifyStatements.isStudyConsistentWithLaws}
                  onChange={event => {
                    setCertifyStatement(prevState => {
                      return {
                        ...prevState,
                        isStudyConsistentWithLaws: !prevState.isStudyConsistentWithLaws,
                      }
                    })
                  }}
                  name="confirmReviewed"
                  color="primary"
                />
              }
              label="The Principal Investigator has assured that this study is consistent with applicable laws and regulations as well as relevant institutional policies."
            />
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <SimpleTextLabel htmlFor="protocolTitle">
                  IRB Protocol Title*
                </SimpleTextLabel>
                <SimpleTextInput
                  value={studyData?.irbProtocolTitle || ''}
                  placeholder="Official IRB Protocol Name"
                  onChange={e => {
                    setStudyData({
                      ...studyData!,
                      irbProtocolTitle: e.target.value,
                    })
                  }}
                  id="protocolTitle"
                  rows={5}
                  className={classes.input}
                  inputProps={{
                    style: inputStyles,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <LeadInvestigatorDropdown
                token={token!}
                orgMembership={orgMembership!}
                currentInvestigatorSelected={
                  studyData?.principleInvestigatorName || ''
                }
                onChange={() => {}}
              />
            </Grid>
            <Grid item xs={6}>
              <Box fontSize="12px" mt={2}>
                Principle Investigators must be listed as the "Study
                Administrator".
                <br />
                <br />
                If your PI is not listed in the dropdown menu, please add them
                to the study and/or make them a{' '}
                <strong>Co-Study Administrator</strong>
                &nbsp;via the &nbsp;
                <NavLink
                  to={'/studies/:id/access-settings'.replace(
                    ':id',
                    study.identifier,
                  )}
                  key={'path-to-access-settings'}
                >
                  Access Settings
                </NavLink>
                &nbsp; tab on the top right hand side.
              </Box>
            </Grid>
            <Grid item xs={6} style={{ marginTop: '-32px' }}>
              <FormControl fullWidth>
                <SimpleTextLabel htmlFor="affiliation">
                  Institutional Affiliation*
                </SimpleTextLabel>
                <SimpleTextInput
                  value={studyData?.institutionalAffiliation || ''}
                  placeholder="Official IRB Protocol Name"
                  onChange={e => {
                    let irbRecordName = studyData?.nameOfIrbRecord || ''
                    if (studyData?.irbRecordSameInstitutionalAffiliation) {
                      irbRecordName = e.target.value
                    }
                    setStudyData({
                      ...studyData!,
                      institutionalAffiliation: e.target.value,
                      nameOfIrbRecord: irbRecordName,
                    })
                  }}
                  id="affiliation"
                  multiline={false}
                  className={classes.input}
                  inputProps={{
                    style: inputStyles,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              &nbsp;
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Box fontSize="14px" fontFamily="Poppins" mb={-1}>
                  What is your IRB of record?{' '}
                </Box>
                <Box pl={4} mt={2}>
                  <RadioGroup
                    aria-label="irb of record"
                    name="irbOfRecord"
                    value={
                      studyData?.irbRecordSameInstitutionalAffiliation
                        ? 'aff_same'
                        : 'aff_other'
                    }
                    onChange={e => {
                      const isSameAsInstitution = e.target.value === 'aff_same'
                      let irbRecordName = studyData?.nameOfIrbRecord || ''
                      if (isSameAsInstitution) {
                        irbRecordName =
                          studyData?.institutionalAffiliation || ''
                      }
                      setStudyData({
                        ...studyData!,
                        irbRecordSameInstitutionalAffiliation: isSameAsInstitution,
                        nameOfIrbRecord: irbRecordName,
                      })
                    }}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label="Same Institutional Affiliation"
                      value="aff_same"
                      id="aff_same_irb_record"
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label="Other:"
                      value="aff_other"
                      id="aff_other_irb_record"
                    />
                  </RadioGroup>
                  <SimpleTextInput
                    value={studyData?.nameOfIrbRecord || ''}
                    placeholder="Name IRB of record"
                    onChange={e => {
                      setStudyData({
                        ...studyData!,
                        nameOfIrbRecord: e.target.value,
                      })
                    }}
                    id="irbOfRecord"
                    rows={5}
                    className={classes.input}
                    style={{ width: '100%', marginTop: '10px' }}
                    inputProps={{
                      style: inputStyles,
                    }}
                    readOnly={studyData?.irbRecordSameInstitutionalAffiliation}
                  />
                </Box>
              </FormControl>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <FormControl>
                <SimpleTextLabel htmlFor="protocolId">
                  IRB Protocol ID
                </SimpleTextLabel>
                <SimpleTextInput
                  value={studyData?.irbProtocolId}
                  placeholder="Protocol ID"
                  onChange={e => {
                    setStudyData({
                      ...studyData!,
                      irbProtocolId: e.target.value,
                    })
                  }}
                  id="protocolId"
                  multiline={false}
                  className={classes.input}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <MTBHeadingH2>IRB Decision: </MTBHeadingH2>
              <Box pl={3} mt={2}>
                <FormControl>
                  <RadioGroup
                    aria-label="Irb Decision"
                    name="irbDecision"
                    value={
                      irbDecisionIsApproved ? 'irb_approved' : 'irb_exempt'
                    }
                    onChange={e => {
                      const isApproved = e.target.value === 'irb_approved'
                      setIrbDecisionIsApproved(isApproved)
                    }}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label="Approved"
                      labelPlacement="end"
                      value="irb_approved"
                    />
                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                      <FormControl style={{ marginRight: '8px' }}>
                        <DatePicker
                          label="Date of IRB Approval"
                          id="approvalDate"
                          value={
                            irbDecisionIsApproved
                              ? studyData?.irbApprovalDate || null
                              : null
                          }
                          onChange={e => {
                            setStudyData({
                              ...studyData!,
                              irbApprovalDate: e,
                            })
                          }}
                          disabled={!irbDecisionIsApproved}
                        ></DatePicker>
                      </FormControl>
                      <FormControl>
                        <DatePicker
                          label="Date of Approval Expiration"
                          id="expirationDate"
                          value={
                            irbDecisionIsApproved
                              ? studyData?.irbApprovedUntil || null
                              : null
                          }
                          onChange={e => {
                            setStudyData({
                              ...studyData!,
                              irbApprovedUntil: e,
                            })
                          }}
                          disabled={!irbDecisionIsApproved}
                        ></DatePicker>
                      </FormControl>
                    </Box>
                    <FormControlLabel
                      control={<Radio />}
                      label="Exempt"
                      value="irb_exempt"
                    />
                    <FormControl>
                      <DatePicker
                        label="Date of Exemption"
                        id="exemptionDate"
                        value={
                          !irbDecisionIsApproved
                            ? studyData?.irbExemptDate || null
                            : null
                        }
                        onChange={e => {
                          setStudyData({
                            ...studyData!,
                            irbExemptDate: e,
                          })
                        }}
                        disabled={irbDecisionIsApproved}
                      ></DatePicker>
                    </FormControl>
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <Box mt={2}>
            <AlertWithText
              severity="error"
              icon={
                <img
                  src={Alert_Icon}
                  style={{ height: '30px' }}
                  alt={'study-warning'}
                ></img>
              }
              className={classes.alertText}
            >
              Please note that you will <strong>no longer</strong> be able to{' '}
              <strong>make changes</strong> to your study once you’ve{' '}
              <strong>submit</strong> the information from this page.
            </AlertWithText>
          </Box>
        </Box>
      )}
      {isFinished && <LastScreen study={study}></LastScreen>}
    </>
  )
}

export default IrbDetails
