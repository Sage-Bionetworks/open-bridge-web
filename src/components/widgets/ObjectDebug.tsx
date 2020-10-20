import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@material-ui/core'

const useStyles = makeStyles({
  root: {},
})

export interface ObjectDebugProps {
  label: string
  data: object
}

const ObjectDebug: React.FunctionComponent<ObjectDebugProps> = ({
  label,
  data,
}: ObjectDebugProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<div>+</div>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default ObjectDebug
