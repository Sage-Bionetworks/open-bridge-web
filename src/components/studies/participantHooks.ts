import { useUserSessionDataState } from "@helpers/AuthContext"
import ParticipantUtility, {ParticipantData} from "./participants/participantUtility"
import { ExtendedError, ParticipantAccountSummary, ParticipantActivityType, ParticipantEvent } from "@typedefs/types"
import { useMutation, useQuery, useQueryClient } from "react-query"
import ParticipantService from "@services/participants.service"
import EventService from "@services/event.service"

export const PARTICIPANT_KEYS = {
    all: ['participants'] as const,
    list: (studyId: string | undefined, currentPage: number = 0, pageSize: number = 0, tab: ParticipantActivityType = 'ACTIVE', searchValue: string | undefined = undefined) =>
    [...PARTICIPANT_KEYS.all, 'list', studyId, currentPage, pageSize, tab, searchValue] as const,
    detail: (studyId: string, userId: string) =>
      [...PARTICIPANT_KEYS.list(studyId), userId] as const,
}

export const useParticipants = (
    studyId: string | undefined, 
    currentPage: number, 
    pageSize: number,
    tab: ParticipantActivityType, 
    searchValue?: string | undefined,
    isById?: boolean
    ) => {
    const {token} = useUserSessionDataState()
    let searchOptions:
      | {searchParam: 'EXTERNAL_ID' | 'PHONE_NUMBER'; searchValue: string}
      | undefined = undefined
    if(searchValue){
        const searchParam = isById ? 'EXTERNAL_ID' : 'PHONE_NUMBER'
        searchOptions = {searchParam, searchValue}
    }
    return useQuery<ParticipantData, ExtendedError>(
        PARTICIPANT_KEYS.list(studyId, currentPage, pageSize,tab, searchValue),
        () => ParticipantUtility.getParticipants(studyId!,currentPage,pageSize,tab, token!,searchOptions),
        {
            enabled: !!studyId,
            retry: false,
            refetchOnWindowFocus: false,
        }
    )
}

export const useInvalidateParticipants = () => {
    const queryClient = useQueryClient()
    const invalidate = () => {
      queryClient.invalidateQueries(PARTICIPANT_KEYS.all)
    }
    return invalidate
  }

export const useUpdateParticipantInList = () => {
    const {token} = useUserSessionDataState()
    const queryClient = useQueryClient()

    const update = async(props: {
        studyId: string
        action: 'WITHDRAW' | 'DELETE' | 'UPDATE'
        userId?: string[] 
        note?: string
        updatedFields?: {[Property in keyof ParticipantAccountSummary]?: ParticipantAccountSummary[Property]}
        customEvents?: ParticipantEvent[]
    }): Promise<string | string[]> => {
        switch(props.action){
            case 'WITHDRAW': 
                return await ParticipantService.withdrawParticipant(props.studyId!, token!, props.userId![0], props.note)
            case 'DELETE': 
                return await ParticipantService.deleteParticipant(props.studyId!, token!, props.userId!)
            case 'UPDATE': 
                if(props.customEvents) await EventService.updateParticipantCustomEvents(props.studyId, token!, props.userId![0], props.customEvents)
                return await ParticipantService.updateParticipant(props.studyId, token!, props.userId![0], props.updatedFields!)
            default:
                throw Error('Unknown Action')
        }
    }
    const mutation = useMutation(update,{
        onMutate: async props =>{
            queryClient.cancelQueries(PARTICIPANT_KEYS.all)
        },
        onError: (err, variables, context) => {
            console.log(err, variables, context)
        },
        onSettled: async(data, error, props) => {
            queryClient.invalidateQueries(PARTICIPANT_KEYS.detail(props.studyId, props.userId![0]))
            queryClient.invalidateQueries(PARTICIPANT_KEYS.all)

        }
    })
    return mutation
}
