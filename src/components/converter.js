import { getInfo } from 'react-mediainfo'
import { useEffect, useState, useContext } from 'react'
import DropArea from '../components/DropArea'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import bytesToMegaBytes from '../helpers/bytesToMegaBytes'
import convertTimeFormat from '../helpers/convertTimeFormat'
import convertTimeToSeconds from '../helpers/convertTimeToSeconds'
import endMinusStart from '../helpers/endMinusStart'
import ResetButton from './ResetButton'
import VideoCard from './VideoCard'
import Loading from './Loading'
import EditingOptions from './EditingOptions'

import AppContext from '../context/app-context'



const ffmpeg = createFFmpeg({ log: true })

const Converter = () => {

  const [ready, setReady] = useState(false)

  const { quality,
    setQuality,
    inputVideo,
    setInputVideo,
    outputVideo,
    setOutputVideo,
    converting,
    setConverting,
    startTrim,
    setStartTrim,
    endTrim,
    setEndTrim
  } = useContext(AppContext)

  // Load ffmpeg 
  const load = async () => {
    await ffmpeg.load()
    setReady(true)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    // console.log("rendering:", startTrim, endTrim)
  }, [startTrim, endTrim])

  useEffect(() => {
    console.log("quality:", quality)
  }, [quality])


  const handleConvert = () => {
    // Handle Errors 
    if(endMinusStart(endTrim, startTrim) < 0){
      alert("end value must be bigger than start value")
    } else if(inputVideo.metadata.Duration - convertTimeToSeconds(endTrim) < 0) {
      alert("end value must be less than input video duration")
    } else {
      convertToH264()
    }
  }


  const convertToH264 = async () => {

    setConverting(true)
    // Turn file data into Uint8Array
    const fileData = await fetchFile(inputVideo.file)

    // Write to FS file system
    ffmpeg.FS('writeFile', 'trimInput.mp4', fileData)

    // Trim with input seeking to speed up conversion 
    await ffmpeg.run('-ss', `${startTrim}`, '-i', 'trimInput.mp4', '-to', `${endTrim}`, '-c:v', 'copy', '-c:a', 'copy', 'trimOutput.mp4')

    // // Read the result of trim 
    const data = ffmpeg.FS('readFile', 'trimOutput.mp4')

    ffmpeg.FS('writeFile', 'input.mp4', data)

    // This converts to h265 format. Not implemented as h265 playback is not currently supported by browsers. 
    // await ffmpeg.run('-i', 'input.mp4', '-c:v', 'libx265', '-pix_fmt', 'yuv420p12le', '-preset', 'medium', '-crf', '26', 'output.mp4')

    await ffmpeg.run('-i', 'input.mp4', '-ss', '00:00:00', '-to', `${convertTimeFormat(endMinusStart(endTrim, startTrim))}`, '-vf', `scale=-2:${quality}`, '-c:v', 'libx264', '-crf', '28', '-preset', 'fast', '-c:a', 'aac', '-b:a', '128k', 'output.mp4')
    const outputData = ffmpeg.FS('readFile', 'output.mp4')
    const outputVideo = new Blob([outputData.buffer], { type: 'video/mp4' })

    let info = await getInfo(outputVideo)
    info = info.media.track[0]
    // console.log(info)

    const metadata = {
      'FileName': 'h264_' + inputVideo.metadata.FileName,
      'FileSize': bytesToMegaBytes(info.FileSize),
      'Duration': info.Duration,
      'FileType': info.Format
    }
    // console.log(metadata)

    // // Create a URL
    const url = URL.createObjectURL(outputVideo)
    // console.log(url)
    setConverting(false)
    setOutputVideo({file: url, metadata: metadata})
  
  }


  return !ready ? (
        // Stage 0, display while loading ffmpeg 
        <Loading />
  ) : (
    
    
    <div className="App md:w-screen md:h-screen lg:bg-gray-900 bg-green-600 grid grid-cols-1 place-items-center">

    {/* Stage 1: Show the drag and drop file area */}
    { !inputVideo &&
      <DropArea />
    }

    {/* Stage 2: Show the selected video and options for trimming and quality */}
    {  (inputVideo && !converting && !outputVideo) &&
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 place-items-center gap-y-12">
        <div class="max-w-3xl mx-auto">
          <div className="bg-green-600 overflow-hidden rounded-lg max-w-xl h-full grid grid-cols-1 place-items-around gap-y-12">
            <div className="px-4 py-5 sm:p-6 ">

              {(inputVideo && !outputVideo) &&
                  <VideoCard video={"input"} />
              }
              {(!outputVideo) &&
                <>
                  <EditingOptions />
                  <div className="flex items-center justify-around gap-4 w-full mt-8">
                    <button type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={handleConvert}>Convert</button>
                    <ResetButton />
                  </div>
                </>
              }
            </div>
          </div>

        </div>
      </div>
    }

    
    {/* Stage 3: Show message that the video is being converted */}
    { converting &&
        <p className="text-2xl font-normal text-center text-green-600">Converting... It could take a while, please be patient <br></br><span className="text-2xl">If you can hear your computer fans it's probably working</span></p>
    }

    {/* Stage 4: Show the converted output and provide option to save */}
    {outputVideo &&
      <>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 place-items-center gap-y-12">
          <div class="max-w-3xl mx-auto">
            <div className="bg-transparent overflow-hidden rounded-lg max-w-xl h-full grid grid-cols-1 place-items-around gap-y-12">
              <div className="px-4 py-5 sm:p-6 ">
                <VideoCard video={"output"} />
                <div className="flex items-center justify-around gap-4 w-full mt-8">
                  <a href={outputVideo.file} download={outputVideo.metadata.FileName} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Save</a>
                  <ResetButton />
                </div>
              </div>
            </div>
          </div>
        </div>

      </>
    }
  </div>
    )
}

export default Converter