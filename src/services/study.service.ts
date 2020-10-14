import { Group, Response, Study } from '../types/types'

import Studies from '../data/studies.json'

import { callEndpoint } from '../helpers/utility'

const StudyService = {
  getStudies,
  getStudy,
  getStudyGroups,
}

async function getStudies(): Promise<Study[]> {
  return Promise.resolve(Studies.data)
}

async function getStudy(id: string): Promise<Study|undefined> {
    const result = Studies.data.find(study=> study.id===id)
 
    return new Promise(resolve =>
        setTimeout(resolve.bind(null, result), 2)
    );
    /*return new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Some Error Just happened")), 1000)
    );*/
  }

  async function getStudyGroups(id: string): Promise<Group[]> {
    const result = Studies.data.find(study=> study.id===id)
    if (result && result.groups) {
      return new Promise(resolve =>
        setTimeout(resolve.bind(null, result.groups), 2000)
    );
    } else {
      return new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("no groups")), 1000)
    )

    }
 
    /*return new Promise(resolve =>
        setTimeout(resolve.bind(null, result?.groups), 2000)
    );*/
    /*return new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Some Error Just happened")), 1000)
    );*/
  }

export default StudyService
