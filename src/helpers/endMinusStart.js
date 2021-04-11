import convertTimeToSeconds from './convertTimeToSeconds'
import convertTimeFormat from './convertTimeFormat'

const endMinusStart = (end, start) => {
    console.log(end)
    let endSS = convertTimeToSeconds(end)
    console.log(endSS)

    console.log(start)
    let startSS = convertTimeToSeconds(start)
    console.log(startSS)

    let difference = (endSS  - startSS).toFixed(3)
    console.log('difference:', difference)

    return convertTimeFormat(difference)

  }

export default endMinusStart