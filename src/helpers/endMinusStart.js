import convertTimeToSeconds from './convertTimeToSeconds'

const endMinusStart = (end, start) => {
    let endSS = convertTimeToSeconds(end)
    let startSS = convertTimeToSeconds(start)
    let difference = (endSS  - startSS).toFixed(3)
    return difference
  }

export default endMinusStart