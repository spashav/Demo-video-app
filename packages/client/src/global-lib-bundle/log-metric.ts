export const logMetric = <Data extends Record<string, string> | string | number>(str: string, data?: Data) => {
  console.log('Metrics: ', str, data)
}
