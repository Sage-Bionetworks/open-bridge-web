import React, {useEffect, useState} from 'react'

export type ToggleKey = 'SURVEY BUILDER' | 'OTHER'

export type FeatureToggles = Partial<Record<ToggleKey, undefined | boolean>>

export interface FeatureToggleProps {
  featureToggles?: FeatureToggles
}

const Ctx = React.createContext<any>({})

export const FeatureToggleProvider: React.FC<FeatureToggleProps> = ({
  children,
  featureToggles: initialToggles,
}) => {
  const [featureToggles, setFeatureToggles] = useState(initialToggles || {})

  useEffect(() => {
    setFeatureToggles({...initialToggles})
    // empty array
    // because, i want to have the controll inside the hook
    // and would really like to have only initialToggles
  }, [])

  return <Ctx.Provider value={featureToggles}>{children}</Ctx.Provider>
}

export function useFeatureToggles<T>(): T {
  return React.useContext<T>(Ctx)
}

export default useFeatureToggles
