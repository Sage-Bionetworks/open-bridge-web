import {FormControl, Link, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {theme} from '@style/theme'
import React from 'react'
import constants from '../../../types/constants'
import {Contact} from '../../../types/types'
import {ContactType} from './AppDesign'
import LeadInvestigatorDropdown from './LeadInvestigatorDropdown'
import FormGroupWrapper from './widgets/FormGroupWrapper'
import Subsection from './widgets/Subsection'
import TextInputWrapper from './widgets/TextInputWrapper'

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
  onUpdate: (leadPrincipalInvestigator: Contact, funder: Contact, ethicsBoardContact: Contact) => void
  principleInvestigatorNameHasError: boolean
  principleInvestigatorAffiliationHasError: boolean
  studyIdentifier: string
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
  principleInvestigatorNameHasError,
  principleInvestigatorAffiliationHasError,
  studyIdentifier,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="Information About The Study Leads" variant="h5">
      <FormGroupWrapper>
        <FormControl className={classes.firstFormElement}>
          <LeadInvestigatorDropdown
            hasError={principleInvestigatorNameHasError}
            orgMembership={orgMembership!}
            token={token!}
            onChange={(investigatorSelected: string) => {
              const newStudyLeadObject = getContactPersonObject('principal_investigator')
              newStudyLeadObject.name = investigatorSelected
              onUpdate(newStudyLeadObject, funder, ethicsBoardContact)
            }}
            currentInvestigatorSelected={getContactName(leadPrincipalInvestigator?.name)}></LeadInvestigatorDropdown>
          <Typography paragraph variant="body1" sx={{fontStyle: 'italic', marginTop: theme.spacing(1)}}>
            Principal Investigators are required to be part of the study as a “Study Administrator”.
          </Typography>
          <Typography paragraph variant="body1" sx={{fontStyle: 'italic'}}>
            If your PI is not listed in the dropdown, please add them to the study and/or make them a{' '}
            <strong>Co-Study Administrator</strong> via the{' '}
            <Link href={constants.restrictedPaths.ACCESS_SETTINGS.replace(':id', studyIdentifier)}>
              Access Settings
            </Link>{' '}
            tab on the top right hand side.{' '}
          </Typography>
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="institution-input"
            placeholder="Name of Institution"
            value={getContactName(leadPrincipalInvestigator.affiliation)}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const newStudyLeadObject = getContactPersonObject('principal_investigator')
              newStudyLeadObject.affiliation = e.target.value
              const newEthicsBoardObject = getContactPersonObject('irb')
              newEthicsBoardObject.name = irbNameSameAsInstitution ? e.target.value : newEthicsBoardObject.name
              onUpdate(newStudyLeadObject, funder, newEthicsBoardObject)
            }}
            titleText="Institutional Affiliation*"
            hasError={principleInvestigatorAffiliationHasError}
          />
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="funder-input"
            placeholder="Name of Funder(s)"
            value={getContactName(funder?.name)}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const newFunderObject = getContactPersonObject('sponsor')
              newFunderObject.name = e.target.value
              onUpdate(leadPrincipalInvestigator, newFunderObject, ethicsBoardContact)
            }}
            titleText="Funder"
          />
        </FormControl>
      </FormGroupWrapper>
    </Subsection>
  )
}

export default StudyLeadInformationSection
