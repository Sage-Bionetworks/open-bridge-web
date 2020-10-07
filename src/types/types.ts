/*  General Types ********************************/


export interface StringDictionary {
  [key: string]: any
}

export interface Response<T> {
  status: number
  ok: boolean
  data: T
}
/*  User Types ********************************/

export interface UserData {
  username?: string
  firstName: string
  lastName: string
  email?: string
  //phone?: Phone
  clientData: object
  //attributes?: UserAttributes
}

export interface LoggedInUserData extends UserData {
  sessionToken: string
  //consented: boolean
  sharingScope: string

  id: string
}


/*
export type EmailSigninParams = {
  email: string
  token: string
  password?: string
}






export type LoginType = 'PHONE' | 'EMAIL'
export type Phone = {
  number: string
  regionCode: string
}

export type UserAttributes = {
  address: string
  city: string
  state: string
  zip_code: string
  dob: string
  gender: string
}*/

/*
export interface RegistrationData {
  appId: string
  substudyIds: string[]

  email?: string
  phone?: Phone
  clientData: object
}
*/

/*
export type SignInData = {
  appId: string
}
export interface SignInDataPhone extends SignInData {
  phone: {
    number: string
    regionCode: string
  }
}

export interface SignInDataEmail extends SignInData {
  email: string
}*/

export type SessionData = {
  token: string | undefined
  name?: string
  alert?: string
}

/****************  */
export type Assessment = {
  id: string
  img: string
  type: string
  title: string
  duration: string
  description: string
  validation: string
  study_number: string
  bookmarked?: boolean
}

export type StudySession = {
  id: string
  active?: boolean
  duration: number
  name: string
  assessments: Assessment[]
}

export type Group = {
  active?: boolean
  id: string
  name: string
  sessions: StudySession[]
}

export type Study = {
  id: string
  active?: boolean
  name: string
  description: string
  groups: Group[]
}
