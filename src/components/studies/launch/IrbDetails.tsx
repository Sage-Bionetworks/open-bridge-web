import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import { ThemeType } from '../../../style/theme'
import { Study } from '../../../types/types'
import DatePicker from '../../widgets/DatePicker'
import { MTBHeadingH2 } from '../../widgets/Headings'
import {
  SimpleTextInput,
  SimpleTextLabel
} from '../../widgets/StyledComponents'
import LeadInvestigatorDropdown from '../app-design/LeadInvestigatorDropdown'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
  },
}))

export interface IrbDetailsProps {
  study: Study
  isFinished: boolean
}


const LastScreen: React.FunctionComponent = () => {
return <Button>Button</Button>
}

const IrbDetails: React.FunctionComponent<IrbDetailsProps> = ({
  study,
  isFinished,
}: IrbDetailsProps) => {
  const classes = useStyles()
  const { token, orgMembership } = useUserSessionDataState()

  return (<>
   {!isFinished && <Box textAlign="left">
      <MTBHeadingH2>IRB Details &amp; Certification</MTBHeadingH2>
      <div>I certify that</div>

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
        label="The Principal Investigator has assured that this study is consistent with applicable laws and regulations as well as relevant institutional policies.
        "
      />

      <Grid container spacing={4}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <SimpleTextLabel htmlFor="protocolTitle">
              IRB Protocol Title
            </SimpleTextLabel>
            <SimpleTextInput
              value=""
              placeholder="Official IRB Protocol Name"
              onChange={e => {}}
              id="protocolTitle"
              rows={5}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}> {/* role: 'principal_investigator', name: '' } as Contact)*/}
          <LeadInvestigatorDropdown
            token={token!}
            orgMembership={orgMembership!}
            currentInvestigatorSelected=""
            onChange={() => {}}
          />
        </Grid>
        <Grid item xs={6}>
          <Box fontSize="12px">
            Principle Investigators must be listed as the "Study Administrator".
            <br />
            <br />
            If your PI is not listed in the dropdown menu, please add them to
            the study and/or make them a <strong>Co-Study Administrator</strong>
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

        <Grid item xs={6}>
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
            />
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
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <MTBHeadingH2>IRB Decision: </MTBHeadingH2>
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
              <div>
                <FormControl>
                  <DatePicker
                    label="Date of Approval"
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
              </div>
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
        </Grid>
      </Grid>
      <Box fontSize="18px">
        Please note that you will <strong>no longer</strong> be able to{' '}
        <strong>make changes</strong> to your study once you’ve{' '}
        <strong>submit</strong> the information from this page.
      </Box>
  
    </Box>}
    {isFinished && <LastScreen></LastScreen>}

    </>
  )
}

export default IrbDetails
