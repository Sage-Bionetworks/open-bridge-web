import Studies from '../data/studies.json'
import Sessions from '../data/sessions.json'
import Assessments from '../data/assessments.json'
import { Assessment } from '@material-ui/icons'


export const KEYS = {
    STUDIES: 'STUDIES',
    ASSESSMENTS: 'ASSESSMENTS',
    STUDY_SESSIONS: 'STUDY_SESSIONS',
    STUDY_ARMS: 'STUDY_ARMS'
}

export const MOCKS = {
    SESSIONS: Sessions.data,
    STUDIES: Studies.data,
    ASSESSMENTS: Assessments.data

}

export const setItem = async<T>(key: string, item: T, timeout = 1000): Promise<T>=> {
    localStorage.setItem(key, JSON.stringify(item))
    return new Promise(resolve => setTimeout(resolve.bind(null, item), timeout))
  }
  
  export const getItem = async<T>(key: string, timeout = 1000): Promise<T| null>=> {
    
    const item= localStorage.getItem(key)
  
    return new Promise(resolve => setTimeout(resolve.bind(null, item? JSON.parse(item): null), timeout))
  }
  


