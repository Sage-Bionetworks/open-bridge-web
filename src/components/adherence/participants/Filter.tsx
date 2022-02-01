import {ReactComponent as FilterIcon} from '@assets/filter.svg'
import {MTBHeadingH5, MTBHeadingH6} from '@components/widgets/Headings'
import {WhiteButton} from '@components/widgets/StyledComponents'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import AdherenceUtility from '../adherenceUtility'
import {useCommonStyles} from '../styles'

export const useStyles = makeStyles(theme => ({
  divider: {
    backgroundColor: '#BBC3CD',
    marginBottom: theme.spacing(1),
  },
  button: {
    flexGrow: 1,
    padding: theme.spacing(1.5),
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',

    '&:first-child': {
      marginRight: '4px',
      border: '1px solid black',
    },
    '&:last-child': {
      backgroundColor: '#8FCDE2',
      border: '1px solid #8FCDE2',
    },
  },
  checkbox: {
    padding: theme.spacing(0.6, 1),
  },
  subheader: {
    color: '#1C1C1C',
  },
  group: {
    marginLeft: theme.spacing(6),
    marginBottom: theme.spacing(3),
  },
}))

type FilterProps = {
  // adherenceWeeklyReport: AdherenceWeeklyReport[]
  threshold?: number
  displayLabels: string[]
  onFilterChange: (arg: {labels: string[]; threshold: number}) => void
}

const Filter: FunctionComponent<FilterProps> = ({
  // adherenceWeeklyReport,
  onFilterChange,
  displayLabels,
  threshold: _threshold,
}) => {
  const classes = {...useCommonStyles(), ...useStyles()}
  const [threshold, setThreshold] = React.useState(_threshold || 0)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [searchLabels, setSearchLabels] =
    React.useState<string[]>(displayLabels)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const selectAll = () => {
    setSearchLabels(displayLabels)
  }
  const selectLabel = (label: string, selected: boolean) => {
    if (selected && !searchLabels.includes(label)) {
      setSearchLabels(prev => [...prev, label])
    } else {
      setSearchLabels(prev => _.without(prev, label))
    }
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div key={`next_activity`}>
      <Button variant="text" onClick={handleClick}>
        <FilterIcon /> Filter
      </Button>

      <Drawer anchor={'right'} open={open} onClose={handleClose}>
        <Box p={4} minWidth={416}>
          <Box display="flex" mb={2}>
            <FilterIcon />{' '}
            <MTBHeadingH6 style={{color: '#3B4141'}}>
              Filter Participants by:
            </MTBHeadingH6>
          </Box>

          <MTBHeadingH5 className={classes.subheader}>
            Schedule Visualizer
          </MTBHeadingH5>
          <Divider className={classes.divider} />
          <FormGroup className={classes.group}>
            <FormControlLabel
              key={`all`}
              value="end"
              control={
                <Checkbox
                  className={classes.checkbox}
                  checked={searchLabels.length === displayLabels.length}
                  onChange={e => (e.target.checked ? selectAll() : {})}
                />
              }
              label="ShowAll"
              labelPlacement="end"
            />
            {displayLabels.map((label, index) => (
              <FormControlLabel
                key={`${label}_${index}`}
                value="end"
                control={
                  <Checkbox
                    checked={searchLabels.includes(label)}
                    className={classes.checkbox}
                    onChange={e => selectLabel(label, e.target.checked)}
                  />
                }
                label={AdherenceUtility.getDisplayFromLabel(label)}
                labelPlacement="end"
              />
            ))}
          </FormGroup>
          <MTBHeadingH5 className={classes.subheader}>
            Adherence Levels
          </MTBHeadingH5>
          <Divider className={classes.divider} />
          <RadioGroup
            className={classes.group}
            value={threshold}
            onChange={e => {
              //console.log(e)
              console.log('target', e.target.value)
              setThreshold(Number(e.target.value))
            }}>
            <FormControlLabel
              control={
                <Radio size="small" value={0} className={classes.checkbox} />
              }
              label="All"
            />

            <FormControlLabel
              control={
                <Radio size="small" value={0.6} className={classes.checkbox} />
              }
              label="x <= 60%"
            />

            <FormControlLabel
              control={
                <Radio size="small" value={0.9} className={classes.checkbox} />
              }
              label="x > 60%"
            />
          </RadioGroup>

          <Box display="flex">
            <WhiteButton className={classes.button} onClick={handleClose}>
              Cancel
            </WhiteButton>{' '}
            <WhiteButton
              className={classes.button}
              onClick={() => onFilterChange({labels: searchLabels, threshold})}>
              Apply Filter
            </WhiteButton>
          </Box>
        </Box>
      </Drawer>
    </div>
  )
}

export default Filter
