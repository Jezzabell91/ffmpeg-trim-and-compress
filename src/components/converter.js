import { getInfo } from 'react-mediainfo'
import { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import bytesToMegaBytes from '../helpers/bytesToMegaBytes'
import convertTimeFormat from '../helpers/convertTimeFormat'
import convertTimeToSeconds from '../helpers/convertTimeToSeconds'
import endMinusStart from '../helpers/endMinusStart'
import InputMask from "react-input-mask"

const ffmpeg = createFFmpeg({ log: true })

const Converter = () => {
  const [inputVideoInfo, setinputVideoInfo] = useState({})
  const [inputVideo, setinputVideo] = useState()
  const [outputVideoInfo, setOutputVideoInfo] = useState({})
  const [outputVideo, setOutputVideo] = useState()
  const [ready, setReady] = useState(false)
  const [converting, setConverting] = useState(false)
  const [startTrim, setStartTrim] = useState('00:00:00.000')
  const [endTrim, setEndTrim] = useState(0)
  const [quality, setQuality] = useState(480)
  const [activeRadio, setActiveRadio] = useState(0)



  // Load ffmpeg 
  const load = async () => {
    await ffmpeg.load()
    setReady(true)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    console.log("rendering:", startTrim, endTrim)
  }, [startTrim, endTrim])

  useEffect(() => {
    console.log("quality:", quality)
  }, [quality])


  const handleDrop = async (files) => {
    const file = files[0]
    let info = await getInfo(file)
    // console.log(info)
    info = info.media.track[0]
    const metadata = {
      'FileName': files[0].name,
      'FileSize': bytesToMegaBytes(info.FileSize),
      'Duration': info.Duration,
      'FileType': info.Format
    }

    console.log(metadata)
    setEndTrim(convertTimeFormat(metadata.Duration))
    setinputVideoInfo(metadata)
    setinputVideo(file)
  }

  const handleChange = (e, position) => {
    let timerValue = e.target.value
    
    if (position === 'start'){
      if(convertTimeToSeconds(timerValue) > convertTimeToSeconds(endTrim)) {
        alert("Start Trim can not be more than End Trim")
        setStartTrim("00:00:00.000")
      } else {
        setStartTrim(timerValue)
      }
    } else if (position === 'end'){
      if(convertTimeToSeconds(timerValue) > inputVideo.Duration) {
        alert("End Trim outside boundary of video duration")
        setEndTrim(convertTimeFormat(inputVideo.Duration))
      } else {
        setEndTrim(timerValue)
      }
    }
    console.log(`${position} trim: ${timerValue}`)
  }

  const handleQualityChange = e => {
    console.log(e.target.value)
    setQuality(e.target.value)
  }


  const convertToH264 = async () => {
    setConverting(true)
    // Turn file data into Uint8Array
    const fileData = await fetchFile(inputVideo)

    // Write to FS file system
    ffmpeg.FS('writeFile', 'trimInput.mp4', fileData)
    
    // Trim with input seeking to speed up conversion 
    await ffmpeg.run('-ss', `${startTrim}`,'-i', 'trimInput.mp4', '-to', `${endTrim}`, '-c:v', 'copy', '-c:a', 'copy', 'trimOutput.mp4')
    
    // // Read the result of trim 
    const data = ffmpeg.FS('readFile', 'trimOutput.mp4')
    
    ffmpeg.FS('writeFile', 'input.mp4', data)

    // This converts to h265 format. Not implemented as h265 playback is not currently supported by browsers. 
    // await ffmpeg.run('-i', 'input.mp4', '-c:v', 'libx265', '-pix_fmt', 'yuv420p12le', '-preset', 'medium', '-crf', '26', 'output.mp4')
    
    await ffmpeg.run('-i', 'input.mp4', '-ss', '00:00:00', '-to', `${endMinusStart(endTrim, startTrim)}`, '-vf', `scale=-2:${quality}`, '-c:v', 'libx264', '-crf', '28', '-preset', 'fast', '-c:a', 'aac', '-b:a', '128k', 'output.mp4')
    const outputData = ffmpeg.FS('readFile', 'output.mp4')
    const outputVideo = new Blob([outputData.buffer], { type: 'video/mp4' })
    
    let info = await getInfo(outputVideo)
    info = info.media.track[0]
    // console.log(info)
    
    const metadata = {
      'FileName': 'h264_' + inputVideoInfo.FileName,
      'FileSize': bytesToMegaBytes(info.FileSize),
      'Duration': info.Duration,
      'FileType': info.Format
    }
    console.log(metadata)
    setOutputVideoInfo(metadata)
    
    // // Create a URL
    const url = URL.createObjectURL(outputVideo)
    console.log(url)
    setConverting(false)
    setOutputVideo(url)
  }





  return  (
    <div className="App">

    { !inputVideo && 
    <div className="">
      <Dropzone onDrop={handleDrop} accept="video/mp4" maxSize={2147483648} maxFiles={1} >
        {({ getRootProps, getInputProps }) => (
          <div className="w-full h-full bg-green-100">
          <div {...getRootProps({ className: "w-screen border-8 border-dashed h-screen bg-green-100 grid grid-cols-1 place-items-center" })}>
            <input {...getInputProps()} />
            <p className="sm:text-xl md:text-2xl lg:text-4xl xl:text-6xl font-bold text-center">drag and drop<br></br>or click to select a video</p>
          </div>
          </div>
        )}
      </Dropzone>
      </div>
    }  
    {  inputVideo && 
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 place-items-center">
  <div class="max-w-3xl mx-auto">
        <div className="bg-gray-200 overflow-hidden rounded-lg max-w-xl">
  <div className="px-4 py-5 sm:p-6 ">
    
    {  inputVideo &&  
      <>
    {/* Card with footer */}
    <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <video
          controls
          width="480"
          src={URL.createObjectURL(inputVideo)}>
        </video>
        <div className="px-4 py-4 sm:px-6">
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
<div className="grid grid-cols-2 gap-x-2 gap-y-2 sm:grid-cols-2">
    <p className="text-sm font-medium text-gray-500">
      File:  <span className="mt-1 text-sm font-normal text-gray-900">{inputVideoInfo.FileName}</span>
    </p>
    <p className="text-sm font-medium text-gray-500">
    Duration: <span className="mt-1 text-sm font-normal text-gray-900">{inputVideoInfo.Duration}</span>
    </p>
    <p className="text-sm font-medium text-gray-500">
    Size: <span className="mt-1 text-sm font-normal text-gray-900">{inputVideoInfo.Duration}</span>
    </p>
    <p className="text-sm font-medium text-gray-500">
    Type: <span className="mt-1 text-sm font-normal text-gray-900">{(inputVideoInfo.FileType)}</span>
    </p>
  </div>
  </div>
        </div>
        </div>
    </div>

    
    </>
}
{  (!outputVideo && !converting) &&  
<> 
  <fieldset>
        <div className="flex justify-around w-full my-8 gap-4">
        <div className="flex-grow">
          <label htmlFor="start" className="sr-only">Start</label>
            <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <span className="text-gray-500 hidden md:inline">
        Start
      </span>
    </div>
              <InputMask formatChars={{
                      '9': '[0-9]',
                      '5': '[0-5]',
                    }}
                    mask="99:59:59.999" defaultValue={startTrim} onBlur={(e) => handleChange(e, 'start')}>
                      {(inputProps) => (
                        <input
                          {...inputProps}
                          type="text"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-center"
                          name="start"
                        />
                      )}
              </InputMask>
            </div>
        </div>

        <div className="flex-grow">
        <label htmlFor="end" className="sr-only">End</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <span className="text-gray-500 hidden md:inline">
        End
      </span>
    </div>
        <InputMask formatChars={{
                '9': '[0-9]',
                '5': '[0-5]',
              }}
              mask="99:59:59.999" defaultValue={endTrim} onBlur={(e) => handleChange(e, 'end')}>
                {(inputProps) => (
                  <input
                    {...inputProps}
                    type="text"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md w-24 text-center"
                  />
                )}
              </InputMask>
        </div>
        </div>
        </div>
  <legend className="sr-only">
    Video Quality
  </legend>
  <div className="relative bg-white rounded-md -space-y-px" onChange={handleQualityChange}>

    <label className={`${(activeRadio === 1) ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200'} rounded-tl-md rounded-tr-md relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3`} onClick={() => setActiveRadio(1)} >
      <div className="flex items-center text-sm">
        <input type="radio" name="quality" value="480" className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" aria-labelledby="quality-0-label" aria-describedby="quality-0-description-0 quality-0-description-1"/>
        <span id="quality-0-label" className="ml-3 font-medium text-gray-900">480p</span>
      </div>
      <p id="quality-0-description-0" className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
        {/* <span className={`${activeRadio === 1 ? 'text-indigo-900' : 'text-gray-900'} font-medium`}>Very Low Size </span> */}
        <span className={`${activeRadio === 1 ? 'text-indigo-700' : 'text-gray-500'}`}> Medium Conversion Time</span>
      </p>
      <p id="quality-0-description-1" className={`${activeRadio === 1 ? 'text-indigo-700' : 'text-gray-500'} ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right`}>5 Mins = ~50mb</p>
    </label>

    <label className={`${activeRadio === 2 ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200'} rounded-tl-md rounded-tr-md relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3`} onClick={() => setActiveRadio(2)} >
      <div className="flex items-center text-sm">
        <input type="radio" name="quality" value="720" className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" aria-labelledby="quality-1-label" aria-describedby="quality-1-description-0 quality-1-description-1"/>
        <span id="quality-1-label" className="ml-3 font-medium text-gray-900">720p</span>
      </div>
      <p id="quality-1-description-0" className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
        {/* <span className={`${activeRadio === 2 ? 'text-indigo-900' : 'text-gray-900'} font-medium`}>Low Size </span> */}
        <span className={`${activeRadio === 2 ? 'text-indigo-700' : 'text-gray-500'}`}> Slow Conversion Time</span>
      </p>
      <p id="quality-1-description-1" className={`${activeRadio === 2 ? 'text-indigo-700' : 'text-gray-500'} ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right`}>5 Mins = ~120mb</p>
    </label> 

    <label className={`${activeRadio === 3 ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200'} rounded-tl-md rounded-tr-md relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3`} onClick={() => setActiveRadio(3)} >
      <div className="flex items-center text-sm">
        <input type="radio" name="quality" value="1080" className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" aria-labelledby="quality-2-label" aria-describedby="quality-2-description-0 quality-2-description-1"/>
        <span id="quality-2-label" className="ml-3 font-medium text-gray-900">1080p</span>
      </div>
      <p id="quality-2-description-0" className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
        {/* <span className={`${activeRadio === 3 ? 'text-indigo-900' : 'text-gray-900'} font-medium`}>Mid Size </span> */}
        <span className={`${activeRadio === 3 ? 'text-indigo-700' : 'text-gray-500'}`}> Very Slow Conversion Time</span>
      </p>
      <p id="quality-2-description-1" className={`${activeRadio === 3 ? 'text-indigo-700' : 'text-gray-500'} ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right`}>5 Mins = ~200mb</p>
    </label> 

  </div>
</fieldset>
</>
}



        { converting && 
          <>
          <p>Converting... It could take a while, please be patient</p>
          <p>If you can hear your computer fans it's probably working</p>
          </>
    }
          {outputVideo &&
            <>
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <video
                controls
                width="480"
                src={outputVideo}>
              </video>
              <div className="px-4 py-4 sm:px-6">
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 sm:grid-cols-2">
            <p className="text-sm font-medium text-gray-500">
            File:  <span className="mt-1 text-sm font-normal text-gray-900">{outputVideoInfo.FileName}</span>
            </p>
            <p className="text-sm font-medium text-gray-500">
            Duration: <span className="mt-1 text-sm font-normal text-gray-900">{outputVideoInfo.Duration}</span>
            </p>
            <p className="text-sm font-medium text-gray-500">
            Size: <span className="mt-1 text-sm font-normal text-gray-900">{(outputVideoInfo.FileSize)}</span>
            </p>
            <p className="text-sm font-medium text-gray-500">
            Type: <span className="mt-1 text-sm font-normal text-gray-900">{(outputVideoInfo.FileType)}</span>
            </p>
            </div>
            </div>
              </div>
              </div>
            </div>
          </> 
        }

<div className="flex items-center justify-around gap-4 w-full mt-8">
        <button type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-blue-300 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={convertToH264}>Convert</button>
        <button type="button" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" onClick={() => setinputVideo(null)}>Reset</button>
        </div>
        </div>
        </div>

</div>
</div>
}
    </div>

  )

}

export default Converter