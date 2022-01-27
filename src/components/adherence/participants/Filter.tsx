import {ReactComponent as FilterIcon} from '@assets/filter.svg'
import {MTBHeadingH3} from '@components/widgets/Headings'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Popover,
  Slider,
} from '@material-ui/core'
import {AdherenceWeeklyReport} from '@typedefs/types'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {useCommonStyles} from '../styles'

export const useStyles = makeStyles(theme => ({}))

type FilterProps = {
  adherenceWeeklyReport: AdherenceWeeklyReport[]
  onFilterChange: (
    stringFilter: string | undefined,
    adherenceFilter: number | undefined
  ) => void
}

const Filter: FunctionComponent<FilterProps> = ({
  adherenceWeeklyReport,
  onFilterChange,
}) => {
  const classes = {...useCommonStyles(), ...useStyles()}
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const getLabels = () => {
    const labels = _.uniq(
      _.flatten(adherenceWeeklyReport.map(i => i.rowLabels))
    )
    return labels
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div key={`next_activity`}>
      <Button variant="text" onClick={handleClick}>
        <FilterIcon /> Filter
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <Box p={3}>
          <MTBHeadingH3>Schedule Visualizer</MTBHeadingH3>
          <FormGroup>
            {getLabels().map(label => (
              <FormControlLabel
                value="end"
                control={<Checkbox />}
                label={label}
                labelPlacement="end"
              />
            ))}
          </FormGroup>
          <Divider />
          Adherence Levels
          <Slider defaultValue={60} step={10} marks min={0} max={100} />
          <Box display="flex">
            <Button>Cancel</Button> <Button>Apply Filter</Button>
          </Box>
        </Box>
      </Popover>
    </div>
  )
}

export default Filter
