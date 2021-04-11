const bytesToMegaBytes = (filesize) => {
    const CONVERSION_FACTOR = 1048576
    return Math.round(filesize / CONVERSION_FACTOR)
  }

export default bytesToMegaBytes