const convertTimeToSeconds = (time) => {
    const timer = time.split(':')
    // console.log('timer', timer)
    const hh = timer[0]
    const mm = timer[1]
    const ss = timer[2].slice(0, 2)
    // console.log('ss', ss)
    const ms = timer[2].slice(2)
    // console.log('ms', ms)
    let totalSeconds = (+hh) * 3600 + (+mm) * 60 + (+ss)
    // console.log('ts', totalSeconds)
    totalSeconds = +totalSeconds + ms
    // console.log('ts2', totalSeconds)
    return totalSeconds
  }

export default convertTimeToSeconds