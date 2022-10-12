import {Accordion, AccordionDetails, AccordionSummary, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React from 'react'

const useStyles = makeStyles({
  root: {},
})

export interface ObjectDebugProps {
  label: string
  data: object
}

const ObjectDebug: React.FunctionComponent<ObjectDebugProps> = ({label, data}: ObjectDebugProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary expandIcon={<div>+</div>} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>{label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div" style={{textAlign: 'left'}}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default ObjectDebug
