function reorder<Type>(
  steps: Type[],
  startIndex: number,
  endIndex?: number
): Type[] {
  const [removed] = steps.splice(startIndex, 1)
  if (endIndex !== undefined) {
    steps.splice(endIndex, 0, removed)
  }
  return steps
}

const SurveyUtils = {
  reorder,
}
export default SurveyUtils
