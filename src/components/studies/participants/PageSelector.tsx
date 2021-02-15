import React from 'react'
import NextPageIcon from '../../../assets/ParticipantManagerPageSelector/next_page_icon.svg'
import PreviousPageIcon from '../../../assets/ParticipantManagerPageSelector/previous_page_icon.svg'
import BackToBeginningIcon from '../../../assets/ParticipantManagerPageSelector/back_to_beginning_icon.svg'
import ForwardToEndIcon from '../../../assets/ParticipantManagerPageSelector/forward_to_end_icon.svg'
import PageBox from './PageBox'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  image: {
    color: 'black',
    marginLeft: '4px',
    marginRight: '4px',
  },
}))

const PageSelector: React.FC<{
  onPageSelected: Function
  currentPageSelected: number
  numberOfPages: number
  handlePageNavigationArrowPressed: Function
}> = props => {
  const classes = useStyles()
  const pageNumbers = []
  for (let i = 1; i <= props.numberOfPages; i++) {
    pageNumbers.push(i)
  }
  return (
    <div className={classes.container}>
      <img
        onClick={() => props.handlePageNavigationArrowPressed('BB')}
        src={BackToBeginningIcon}
        className={classes.image}
      ></img>
      <img
        onClick={() => props.handlePageNavigationArrowPressed('B')}
        src={PreviousPageIcon}
        className={classes.image}
      ></img>
      {pageNumbers.map((element, index) => {
        return (
          <PageBox
            key={index}
            isSelected={element == props.currentPageSelected}
            pageNumber={element}
            onPageSelected={props.onPageSelected}
          />
        )
      })}
      <img
        onClick={() => props.handlePageNavigationArrowPressed('F')}
        src={NextPageIcon}
        className={classes.image}
      ></img>
      <img
        onClick={() => props.handlePageNavigationArrowPressed('FF')}
        src={ForwardToEndIcon}
        className={classes.image}
      ></img>
    </div>
  )
}

export default PageSelector
