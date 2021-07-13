import React from 'react'
import {makeStyles} from '@material-ui/core'
import Subsection from './Subsection'
import {FormControl} from '@material-ui/core'
import {Contact} from '../../../types/types'
import LeadInvestigatorDropdown from './LeadInvestigatorDropdown'
import FormGroupWrapper from './FormGroupWrapper'
import TextInputWrapper from './TextInputWrapper'
import {ContactType} from './AppDesign'

const useStyles = makeStyles(theme => ({
  firstFormElement: {
    marginTop: theme.spacing(2.5),
  },
  principleInvestigatorsParagraph: {
    fontSize: '12px',
    marginLeft: theme.spacing(2),
    lineHeight: '14px',
    marginTop: theme.spacing(2),
  },
}))

type StudyLeadInformationSectionProps = {
  SimpleTextInputStyles: React.CSSProperties
  getContactPersonObject: (type: ContactType) => Contact
  orgMembership: string | undefined
  token: string | undefined
  irbNameSameAsInstitution: boolean
  leadPrincipalInvestigator: Contact
  ethicsBoardContact: Contact
  funder: Contact
  getContactName: Function
  onUpdate: (
    leadPrincipalInvestigator: Contact,
    funder: Contact,
    ethicsBoardContact: Contact
  ) => void
}

const StudyLeadInformationSection: React.FunctionComponent<StudyLeadInformationSectionProps> = ({
  SimpleTextInputStyles,
  getContactPersonObject,
  orgMembership,
  token,
  irbNameSameAsInstitution,
  leadPrincipalInvestigator,
  ethicsBoardContact,
  funder,
  onUpdate,
  getContactName,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="Information about the Study Leads">
      <FormGroupWrapper>
        <FormControl className={classes.firstFormElement}>
          <LeadInvestigatorDropdown
            orgMembership={orgMembership!}
            token={token!}
            onChange={(investigatorSelected: string) => {
              const newStudyLeadObject = getContactPersonObject(
                'principal_investigator'
              )
              newStudyLeadObject.name = investigatorSelected
              onUpdate(newStudyLeadObject, funder, ethicsBoardContact)
            }}
            currentInvestigatorSelected={getContactName(
              leadPrincipalInvestigator?.name
            )}></LeadInvestigatorDropdown>
          <p className={classes.principleInvestigatorsParagraph}>
            Principle Investigators are required to be part of the study as a
            “Study Administrator”.
            <br></br>
            <br></br>
            If your PI is not listed in the dropdown, please add them to the
            study and/or make them a <strong>Co-Study Administrator</strong> via
            the{' '}
            <strong>
              <u>Access Settings</u>
            </strong>{' '}
            tab on the top right hand side.{' '}
          </p>
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="institution-input"
            placeholder="Name of Institution"
            value={getContactName(leadPrincipalInvestigator.affiliation)}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              const newStudyLeadObject = getContactPersonObject(
                'principal_investigator'
              )
              newStudyLeadObject.affiliation = e.target.value
              const newEthicsBoardObject = getContactPersonObject('irb')
              newEthicsBoardObject.name = irbNameSameAsInstitution
                ? e.target.value
                : newEthicsBoardObject.name
              onUpdate(newStudyLeadObject, funder, newEthicsBoardObject)
            }}
            titleText="Institutional Affiliation*"
          />
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="funder-input"
            placeholder="Name of Funder(s)"
            value={getContactName(funder?.name)}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              const newFunderObject = getContactPersonObject('sponsor')
              newFunderObject.name = e.target.value
              onUpdate(
                leadPrincipalInvestigator,
                newFunderObject,
                ethicsBoardContact
              )
            }}
            titleText="Funder"
          />
        </FormControl>
      </FormGroupWrapper>
    </Subsection>
  )
}

export default StudyLeadInformationSection
