export const APP_ID = 'czi-coronavirus'
export const SESSION_NAME = 'bridge-session-ny-strong'
export const ENDPOINT = 'https://webservices.sagebridge.org'

export type EmailSigninParams = {
  email: string
  token: string
  password?: string
}

export interface StringDictionary {
  [key: string]: any
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
}
export interface UserData {
  username?: string
  firstName: string
  lastName: string
  email?: string
  phone?: Phone
  clientData: object
  attributes?: UserAttributes
}

export interface LoggedInUserData extends UserData {
  sessionToken: string
  consented: boolean
  sharingScope: string

  id: string
}

export interface RegistrationData {
  appId: string
  substudyIds: string[]

  email?: string
  phone?: Phone
  clientData: object
}

export interface Response<T> {
  status: number
  ok: boolean
  data: T
}

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
}

export type SessionData = {
  token: string | undefined
  name?: string
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
  active?: boolean
  name: string
  description: string
  groups: Group[]
}
