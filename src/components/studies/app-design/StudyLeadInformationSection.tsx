import React from 'react'
import { makeStyles } from '@material-ui/core'
import Subsection from './Subsection'
import { FormControl, FormGroup } from '@material-ui/core'
import { StudyAppDesign } from '../../../types/types'
import { playfairDisplayFont, poppinsFont } from '../../../style/theme'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'
import { AppDesignUpdateTypes } from './AppDesign'
import LeadInvestigatorDropdown from './LeadInvestigatorDropdown'

const useStyles = makeStyles(theme => ({
  formFields: {
    fontFamily: poppinsFont,
    fontSize: '14px',
    marginBottom: '24px',
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: '16px',
    },
  },
  firstFormElement: {
    marginTop: theme.spacing(2.5),
  },
  informationRowStyle: {
    fontFamily: playfairDisplayFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
  },
  principleInvestigatorsParagraph: {
    fontSize: '12px',
    marginLeft: theme.spacing(2),
    lineHeight: '14px',
    marginTop: theme.spacing(2),
  },
}))

type StudyLeadInformationSectionProps = {
  appDesignProperties: StudyAppDesign
  setAppDesignProperties: Function
  updateAppDesignInfo: Function
  SimpleTextInputStyles: React.CSSProperties
  getContact: Function
  orgMembership: string | undefined
  token: string | undefined
  irbNameSameAsInstitution: boolean
}

const StudyLeadInformationSection: React.FunctionComponent<StudyLeadInformationSectionProps> = ({
  appDesignProperties,
  setAppDesignProperties,
  updateAppDesignInfo,
  SimpleTextInputStyles,
  getContact,
  orgMembership,
  token,
  irbNameSameAsInstitution,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="Information about the Study Leads">
      <FormGroup className={classes.formFields}>
        <FormControl className={classes.firstFormElement}>
          <LeadInvestigatorDropdown
            orgMembership={orgMembership!}
            token={token!}
            onChange={(investigatorSelected: string) => {
              const newStudyLead = getContact('LEAD_INVESTIGATOR')
              newStudyLead.name = investigatorSelected
              setAppDesignProperties({
                ...appDesignProperties,
                leadPrincipleInvestigatorInfo: newStudyLead,
              })
            }}
            currentInvestigatorSelected={
              appDesignProperties.leadPrincipleInvestigatorInfo?.name || ''
            }
          ></LeadInvestigatorDropdown>
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
          <SimpleTextLabel htmlFor="institution-input">
            Institutional Affiliation*
          </SimpleTextLabel>
          <SimpleTextInput
            className={classes.informationRowStyle}
            id="institution-input"
            placeholder="Name of Institution"
            value={
              appDesignProperties.leadPrincipleInvestigatorInfo?.affiliation ||
              ''
            }
            onChange={e => {
              const newStudyLead = getContact('LEAD_INVESTIGATOR')
              newStudyLead.affiliation = e.target.value
              const newEthicsBoard = getContact('ETHICS_BOARD')
              newEthicsBoard.name = irbNameSameAsInstitution
                ? e.target.value
                : newEthicsBoard.name
              setAppDesignProperties({
                ...appDesignProperties,
                leadPrincipleInvestigatorInfo: newStudyLead,
                ethicsBoardInfo: newEthicsBoard,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS)
            }
            multiline
            rows={1}
            rowsMax={1}
            inputProps={{
              style: SimpleTextInputStyles,
            }}
          />
        </FormControl>
        <FormControl>
          <SimpleTextLabel htmlFor="funder-input">Funder*</SimpleTextLabel>
          <SimpleTextInput
            className={classes.informationRowStyle}
            id="funder-input"
            placeholder="Name of Funder(s)"
            value={appDesignProperties.funder?.name || ''}
            onChange={e => {
              const newFunder = getContact('FUNDER')
              newFunder.name = e.target.value
              setAppDesignProperties({
                ...appDesignProperties,
                funder: newFunder,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS)
            }
            multiline
            rows={1}
            rowsMax={1}
            inputProps={{
              style: SimpleTextInputStyles,
            }}
          />
        </FormControl>
      </FormGroup>
    </Subsection>
  )
}

export default StudyLeadInformationSection
