import { useUserSessionDataState } from "@helpers/AuthContext"
import ParticipantUtility, {ParticipantData} from "./participants/participantUtility"
import { ExtendedError, ParticipantAccountSummary, ParticipantActivityType, ParticipantEvent } from "@typedefs/types"
import { useMutation, useQuery, useQueryClient } from "react-query"
import ParticipantService from "@services/participants.service"
import EventService from "@services/event.service"

export const PARTICIPANT_KEYS = {
    all: ['participants'] as const,
    list: (studyId: string | undefined, currentPage: number = 0, pageSize: number = 0, tab: ParticipantActivityType = 'ACTIVE', toggle: boolean = false,) =>
      [...PARTICIPANT_KEYS.all, 'list', studyId, currentPage, pageSize, tab, toggle] as const,
  
    detail: (studyId: string, userId: string) =>
      [...PARTICIPANT_KEYS.list(studyId), userId] as const,
}

export const useParticipants = (
    studyId: string | undefined, 
    currentPage: number, 
    pageSize: number,
    tab: ParticipantActivityType, 
    toggle: boolean
    ) => {
    const {token} = useUserSessionDataState()

    return useQuery<ParticipantData, ExtendedError>(
        PARTICIPANT_KEYS.list(studyId, currentPage, pageSize,tab,toggle),
        () => ParticipantUtility.getParticipants(studyId!,currentPage,pageSize,tab, token!),
        {
            enabled: !!studyId,
            retry: false,
            refetchOnWindowFocus: false,
        }
    )
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