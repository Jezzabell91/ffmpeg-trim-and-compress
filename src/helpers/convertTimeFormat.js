const convertTimeFormat = (time) => {
    let hhmmss = new Date(0)
    const ms = time.substr(-3, 3) ?? 0
    hhmmss.setSeconds(time, ms)
    hhmmss = hhmmss.toISOString().substr(11, 12)
    return hhmmss
  }

export default convertTimeFormat