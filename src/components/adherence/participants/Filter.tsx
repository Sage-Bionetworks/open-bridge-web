import {ReactComponent as FilterIcon} from '@assets/filter.svg'
import {MTBHeadingH5, MTBHeadingH6} from '@components/widgets/Headings'
import {WhiteButton} from '@components/widgets/StyledComponents'
import {Box, Button, Checkbox, Divider, Drawer, FormControlLabel, FormGroup, Radio, RadioGroup} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import AdherenceService from '@services/adherence.service'
import {AdherenceStatistics, AdherenceWeeklyReport} from '@typedefs/types'
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
      marginRight: '16px',
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
  label: {
    display: 'flex',
    width: '80%',
    justifyContent: 'space-between',
  },

  subheader: {
    color: '#1C1C1C',
  },
  group: {
    marginLeft: theme.spacing(6),
    marginBottom: theme.spacing(3),
  },
}))

type ThresholdValue = 'ALL' | 'UNDER' | 'OVER'

type FilterProps = {
  thresholdMin?: number
  thresholdMax?: number
  adherenceReportItems: AdherenceWeeklyReport[]
  adherenceStats: AdherenceStatistics
  selectedLabels?: string[]
  onFilterChange: (arg: {labels: string[] | undefined; min: number; max: number}) => void
}

function getThreshold(min: number = 0, max: number = 100): ThresholdValue {
  let result: ThresholdValue = 'ALL'
  if (min > AdherenceService.COMPLIANCE_THRESHOLD) {
    result = 'OVER'
  }
  if (max <= AdherenceService.COMPLIANCE_THRESHOLD) {
    result = 'UNDER'
  }
  return result
}

function getDisplayLabels(items: AdherenceWeeklyReport[]) {
  const labels = new Map(
    _.flatten(items.map(i => i.rows))
      .filter(r => !!r)
      .map(r => [r.searchableLabel, AdherenceUtility.getDisplayFromLabel(r.label, r.studyBurstNum)])
  )

  return new Map(labels)
}

const FilterLabel: FunctionComponent<{
  label?: string | string[]
  count?: {totalActive: number}
}> = ({label, count}) => {
  return (
    <>
      <div>{label}</div>
      <div>{count?.totalActive}</div>
    </>
  )
}

const Filter: FunctionComponent<FilterProps> = ({
  onFilterChange,
  adherenceReportItems,
  selectedLabels,
  adherenceStats,
  thresholdMin: min,
  thresholdMax: max,
}) => {
  const classes = {...useCommonStyles(), ...useStyles()}

  const [threshold, setThreshold] = React.useState<ThresholdValue>()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [isSelectAll, setIsSelectAll] = React.useState(true)
  const [searchLabels, setSearchLabels] = React.useState<string[]>([])

  React.useEffect(() => {
    setThreshold(getThreshold(min, max))
  }, [min, max, adherenceReportItems])

  React.useEffect(() => {
    const isAllSelected = selectedLabels === undefined || selectedLabels.length === 0
    setIsSelectAll(isAllSelected)
    if (isAllSelected) {
      setSearchLabels(Array.from(getDisplayLabels(adherenceReportItems).keys()))
    }
  }, [selectedLabels, adherenceReportItems])

  const displayLabels = getDisplayLabels(adherenceReportItems)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const selectAll = (isSelected: boolean) => {
    setIsSelectAll(isSelectAll)
    if (isSelected) {
      setSearchLabels(Array.from(displayLabels.keys()))
    } else {
      setSearchLabels([])
    }
  }
  const selectLabel = (label: string, selected: boolean) => {
    if (selected) {
      setSearchLabels(prev => [...prev, label])
    } else {
      if (isSelectAll) {
        setIsSelectAll(false)
      }
      setSearchLabels(prev => _.without(prev, label))
    }
  }

  const applyFilterChange = () => {
    let labels = searchLabels.length === displayLabels.size ? undefined : searchLabels
    let thresh = {min: 0, max: 100}
    if (threshold === 'OVER') {
      thresh.min = AdherenceService.COMPLIANCE_THRESHOLD
    }
    if (threshold === 'UNDER') {
      thresh.max = AdherenceService.COMPLIANCE_THRESHOLD - 1
    }

    onFilterChange({labels, ...thresh})
    handleClose()
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
            <FilterIcon /> <MTBHeadingH6 style={{color: '#3B4141'}}>Filter Participants by:</MTBHeadingH6>
          </Box>

          <MTBHeadingH5 className={classes.subheader}>Schedule Visualizer</MTBHeadingH5>
          <Divider className={classes.divider} />
          <FormGroup className={classes.group}>
            <FormControlLabel
              key={`all`}
              value="end"
              classes={{label: classes.label}}
              control={
                <Checkbox
                  className={classes.checkbox}
                  checked={displayLabels.size === searchLabels.length}
                  onChange={e => selectAll(e.target.checked)}
                />
              }
              label={<FilterLabel label="Show All" count={adherenceStats} />}
              labelPlacement="end"
            />
            {Array.from(displayLabels.keys()).map((searchKey, index) => (
              <FormControlLabel
                key={`${searchKey}_${index}`}
                value="end"
                classes={{label: classes.label}}
                control={
                  <Checkbox
                    checked={!searchLabels || searchLabels.includes(searchKey)}
                    className={classes.checkbox}
                    onChange={e => selectLabel(searchKey, e.target.checked)}
                  />
                }
                label={
                  <FilterLabel
                    label={displayLabels.get(searchKey)}
                    count={adherenceStats.entries.find(e => e.searchableLabel === searchKey)}
                  />
                }
                labelPlacement="end"
              />
            ))}
          </FormGroup>
          <MTBHeadingH5 className={classes.subheader}>Adherence Levels</MTBHeadingH5>
          <Divider className={classes.divider} />
          <RadioGroup
            className={classes.group}
            value={threshold}
            onChange={e => {
              setThreshold(e.target.value as ThresholdValue)
            }}>
            <FormControlLabel
              classes={{label: classes.label}}
              control={<Radio color="secondary" size="small" value={'ALL'} className={classes.checkbox} />}
              label={<FilterLabel label="All" count={adherenceStats} />}
            />

            <FormControlLabel
              classes={{label: classes.label}}
              control={<Radio color="secondary" size="small" value={'UNDER'} className={classes.checkbox} />}
              label={
                <FilterLabel
                  label={`x </= ${AdherenceService.COMPLIANCE_THRESHOLD}%`}
                  count={{totalActive: adherenceStats.noncompliant}}
                />
              }
            />

            <FormControlLabel
              classes={{label: classes.label}}
              control={<Radio color="secondary" size="small" value={'OVER'} className={classes.checkbox} />}
              label={
                <FilterLabel
                  label={`x > ${AdherenceService.COMPLIANCE_THRESHOLD}%`}
                  count={{totalActive: adherenceStats.compliant}}
                />
              }
            />
          </RadioGroup>

          <Box display="flex">
            <WhiteButton className={classes.button} onClick={handleClose}>
              Cancel
            </WhiteButton>{' '}
            <WhiteButton
              disabled={searchLabels.length === 0}
              className={classes.button}
              onClick={() => applyFilterChange()}>
              Apply Filter
            </WhiteButton>
          </Box>
        </Box>
      </Drawer>
    </div>
  )
}

export default Filter
