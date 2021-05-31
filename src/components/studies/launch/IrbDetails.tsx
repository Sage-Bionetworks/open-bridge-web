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
import React from 'react'
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

const IrbDetails: React.FunctionComponent<IrbDetailsProps> = ({
  study,
  isFinished,
}: IrbDetailsProps) => {
  const classes = useStyles()
  const { token, orgMembership } = useUserSessionDataState()

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
                  checked={true}
                  onChange={event => {
                    if (event.target.checked) {
                    }
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
                  checked={true}
                  onChange={event => {
                    if (event.target.checked) {
                    }
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
                  value=""
                  placeholder="Official IRB Protocol Name"
                  onChange={e => {}}
                  id="protocolTitle"
                  rows={5}
                  className={classes.input}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <LeadInvestigatorDropdown
                token={token!}
                orgMembership={orgMembership!}
                currentInvestigatorSelected=""
                onChange={() => {}}
              />
            </Grid>
            <Grid item xs={6}>
              <Box fontSize="12px">
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
            <Grid item xs={6} style={{ marginTop: '-24px' }}>
              <FormControl fullWidth>
                <SimpleTextLabel htmlFor="affiliation">
                  Institutional Affiliation*
                </SimpleTextLabel>
                <SimpleTextInput
                  value=""
                  placeholder="Official IRB Protocol Name"
                  onChange={e => {}}
                  id="affiliation"
                  multiline={false}
                  className={classes.input}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              &nbsp;
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <SimpleTextLabel htmlFor="notes">
                  What is your IRB of record?{' '}
                </SimpleTextLabel>
                <Box pl={3} mt={1}>
                  <RadioGroup
                    style={{ marginTop: '16px' }}
                    aria-label="irb of record"
                    name="irbOfRecord"
                    value=""
                    onChange={e => {}}
                  >
                    <FormControlLabel
                      control={<Radio value={'SAME'} />}
                      label="Same Institutional Affiliation"
                    />
                    <FormControlLabel
                      control={<Radio value={'OTHER'} />}
                      label="Other:"
                    />
                  </RadioGroup>
                  <SimpleTextInput
                    value=""
                    placeholder="Name IRB of record"
                    onChange={e => {}}
                    id="irbOfRecord"
                    rows={5}
                    className={classes.input}
                    style={{ width: '100%' }}
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
                  value=""
                  placeholder="Protocol ID"
                  onChange={e => {}}
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
                    value=""
                    onChange={e => {}}
                  >
                    <FormControlLabel
                      control={<Radio value={'APPROVED'} />}
                      label="Approved"
                      labelPlacement="end"
                    />
                    <Box>
                      <FormControl>
                        <DatePicker
                          label="Date of IRB Approval"
                          id="approvalDate"
                          value={null}
                          onChange={e => {}}
                        ></DatePicker>
                      </FormControl>
                      <FormControl>
                        <DatePicker
                          label="Date of Approval Expiration"
                          id="expirationDate"
                          value={null}
                          onChange={e => {}}
                        ></DatePicker>
                      </FormControl>
                    </Box>
                    <FormControlLabel
                      control={<Radio value={'EXEMPT'} />}
                      label="Exempt"
                    />
                    <FormControl>
                      <DatePicker
                        label="Date of Exemption"
                        id="exemptionDate"
                        value={null}
                        onChange={e => {}}
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
              style={{ fontSize: '18px', backgroundColor: 'transparent' }}
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
