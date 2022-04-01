import WithdrawnIcon from '@assets/cancelled_study_icon.svg'
import CompletedIcon from '@assets/completed_study_icon.svg'
import LiveIcon from '@assets/live_study_icon.svg'
import Utility from '@helpers/utility'
import makeStyles from '@mui/styles/makeStyles';
import StudyService from '@services/study.service'
import React, {FunctionComponent} from 'react'
import {DisplayStudyPhase, Study} from '../../types/types'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    whiteSpace: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
}))

const NonDraftHeaderFunctionComponent: FunctionComponent<{
  study: Study | undefined
  excludedPhase?: DisplayStudyPhase
}> = ({study, excludedPhase}) => {
  const classes = useStyles()
  if (!study) {
    return <></>
  }
  const displayPhase = StudyService.getDisplayStatusForStudyPhase(study.phase)
  if (displayPhase === excludedPhase) {
    return <></>
  }

  const phaseIcon = {
    WITHDRAWN: WithdrawnIcon,
    COMPLETED: CompletedIcon,
    LIVE: LiveIcon,
    DRAFT: LiveIcon,
  }

  return (
    <div className={classes.root}>
      Study ID: {Utility.formatStudyId(study.identifier)}
      &nbsp;&nbsp;
      <img src={phaseIcon[displayPhase]} style={{flexShrink: 0}} />
    </div>
  )
}

export default NonDraftHeaderFunctionComponent
