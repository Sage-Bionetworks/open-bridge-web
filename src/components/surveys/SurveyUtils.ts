function reorder<Type>(
  steps: Type[],
  startIndex: number,
  endIndex?: number
): Type[] {
  if (endIndex !== undefined) {
    const [removed] = steps.splice(startIndex, 1)
    steps.splice(endIndex, 0, removed)
  }
  return steps
}

const SurveyUtils = {
  reorder,
}
export default SurveyUtils
