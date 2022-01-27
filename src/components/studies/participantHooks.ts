import { useUserSessionDataState } from "@helpers/AuthContext"
import ParticipantUtility, {ParticipantData} from "./participants/participantUtility"
import { ExtendedError, ExtendedParticipantAccountSummary, ParticipantAccountSummary, ParticipantActivityType, ParticipantEvent } from "@typedefs/types"
import { useMutation, useQuery, useQueryClient } from "react-query"
import ParticipantService from "@services/participants.service"
import EventService from "@services/event.service"

export const PARTICIPANT_KEYS = {
    all: ['participants'] as const,
    list: (studyId: string | undefined, currentPage: number = 0, pageSize: number = 0, tab: ParticipantActivityType = 'ACTIVE', searchValue = undefined) =>
      [...PARTICIPANT_KEYS.all, 'list', studyId, currentPage, pageSize, tab] as const,
  
    detail: (studyId: string, userId: string) =>
      [...PARTICIPANT_KEYS.list(studyId), userId] as const,
}

export const useParticipants = (
    studyId: string | undefined, 
    currentPage: number, 
    pageSize: number,
    tab: ParticipantActivityType, 
    searchValue?: string
    ) => {
    const {token} = useUserSessionDataState()

    return useQuery<ParticipantData, ExtendedError>(
        PARTICIPANT_KEYS.list(studyId, currentPage, pageSize,tab),
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
        userId?: string
        currentPage?: number
        pageSize?: number
        tab?: ParticipantActivityType
        note?: string
        updatedFields?: {[Property in keyof ParticipantAccountSummary]?: ParticipantAccountSummary[Property]}
        customEvents?: ParticipantEvent[]
    }): Promise<string> => {

        switch(props.action){
            case 'WITHDRAW':
                return await ParticipantService.withdrawParticipant(props.studyId!, token!, props.userId!, props.note)
            case 'DELETE':
                return await ParticipantService.deleteParticipant(props.studyId!, token!, props.userId!)
            case 'UPDATE':
                if(props.customEvents) await EventService.updateParticipantCustomEvents(props.studyId, token!, props.userId!, props.customEvents)
                return await ParticipantService.updateParticipant(props.studyId, token!, props.userId!, props.updatedFields!)
            default:
                throw Error('Unknown Action')
        }
    }
    const mutation = useMutation(update,{
        onMutate: async props =>{
            queryClient.cancelQueries(PARTICIPANT_KEYS.all)
            const previousParticipants = queryClient.getQueryData<ExtendedParticipantAccountSummary[]>(
                PARTICIPANT_KEYS.detail(props.studyId!, props.userId!)
            )
            let updatedList: ExtendedParticipantAccountSummary[] = []
                if(previousParticipants){
                    updatedList = previousParticipants.filter(p =>
                        p.id !== props.userId
                    )
            }
            queryClient.setQueryData<ExtendedParticipantAccountSummary[]>(PARTICIPANT_KEYS.detail(props.studyId!, props.userId!), [...updatedList])
            return {previousParticipants}
        },
        onError: (err, variables, context) => {
            console.log(err, variables, context)
        },
        onSettled:async (data, error, props) => {
            queryClient.invalidateQueries(PARTICIPANT_KEYS.detail(props.studyId, props.userId!))
            queryClient.invalidateQueries(PARTICIPANT_KEYS.list(props.studyId!, props.currentPage,props.pageSize,props.tab))

        }
    })
    return mutation
}

export const useUpdateParticipant = () => {
    const {token} = useUserSessionDataState()
    const queryClient = useQueryClient()

    const update = async(props:{
        studyId: string
        userId: string
        updatedFields: {[Property in keyof ParticipantAccountSummary]?: ParticipantAccountSummary[Property]}
        customEvents?: ParticipantEvent[]
    }) => {
        if(props.customEvents) await EventService.updateParticipantCustomEvents(props.studyId, token!, props.userId, props.customEvents)
        return await ParticipantService.updateParticipant(props.studyId, token!, props.userId, props.updatedFields)
    }

    const mutation = useMutation(update)
}
