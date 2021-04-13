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
    
    await ffmpeg.run('-i', 'input.mp4', '-ss', '00:00:00', '-to', `${endMinusStart(endTrim, startTrim)}`, '-vf', `scale=-1:${quality}`, '-c:v', 'libx264', '-crf', '28', '-preset', 'fast', '-c:a', 'aac', '-b:a', '128k', 'output.mp4')
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
    setConverting(false)
    setOutputVideo(url)
  }





  return ready ? (
    <div className="App">

      <Dropzone onDrop={handleDrop} accept="video/mp4" maxSize={2147483648} maxFiles={1} >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop a video, or click here select a video</p>
          </div>
        )}
      </Dropzone>


      { inputVideo && 
      <>
        <video
          controls
          width="480"
          src={URL.createObjectURL(inputVideo)}>
        </video>
              {/* TODO: Separate to own component */}
        <div>
          File: {inputVideoInfo.FileName} <br></br>
          Duration: {inputVideoInfo.Duration} Seconds <br></br>
          Size: {(inputVideoInfo.FileSize)}MB
          <br></br>
          Type: {(inputVideoInfo.FileType)}
        </div>
        <br></br>

        <label>Start:</label>
        <InputMask formatChars={{
        '9': '[0-9]',
        '5': '[0-5]',
      }}
      mask="99:59:59.999" defaultValue={startTrim} onBlur={(e) => handleChange(e, 'start')}>
        {(inputProps) => (
          <input
            {...inputProps}
            type="text"
            className="w-24 text-center"
          />
        )}
      </InputMask>
        
        {/* <label>Start:
        <input type="text" pattern="^(\d{2})(:[0-5]\d){2}(\.\d{3})$" defaultValue={startTrim} onBlur={(e) => handleChange(e, 'start')}></input>
        </label> */}
        <br></br>
        <label>End:  </label>
        <InputMask formatChars={{
        '9': '[0-9]',
        '5': '[0-5]',
      }}
      mask="99:59:59.999" defaultValue={endTrim} onBlur={(e) => handleChange(e, 'end')}>
        {(inputProps) => (
          <input
            {...inputProps}
            type="text"
            className="w-24 text-center"
          />
        )}
      </InputMask>
        {/* <input type="text" defaultValue={endTrim} onBlur={(e) => handleChange(e, 'end')}></input> */}
        <br></br>
          <div onChange={handleQualityChange}>
            <label>
              Quality:
            <input type="radio" name="quality" value="480"/>

              480P

            <input type="radio" name="quality" value="720" />
              720P

            <input type="radio" name="quality" value="1080" />
              1080P
            </label>
          </div>

        <button onClick={convertToH264}>Convert</button>
      </>
      }
      <br></br>
      { converting && <>
      <p>Converting... It could take a while, please be patient</p>
      <p>If you can hear your computer fans it's probably working</p>
      </>}
      { outputVideo &&
        <>
          <br></br>
          <br></br>
          <video
            controls
            width="480"
            src={outputVideo}>
          </video>
              {/* TODO: Separate to own component */}
          <div>
            File: {outputVideoInfo.FileName} <br></br>
            Duration: {outputVideoInfo.Duration} Seconds <br></br>
            Size: {(outputVideoInfo.FileSize)}MB
            <br></br>
            Type: {(outputVideoInfo.FileType)}
          </div>
        </>
      }






    </div>
  )
    :
    (
      <p>Loading...</p>
    )
}

export default Converter