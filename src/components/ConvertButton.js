import { useContext } from 'react'
import AppContext from '../context/app-context'
import { getInfo } from 'react-mediainfo'
import { fetchFile } from '@ffmpeg/ffmpeg'
import bytesToMegaBytes from '../helpers/bytesToMegaBytes'
import convertTimeFormat from '../helpers/convertTimeFormat'
import convertTimeToSeconds from '../helpers/convertTimeToSeconds'
import endMinusStart from '../helpers/endMinusStart'


const ConvertButton = ( { ffmpeg }) => {

    const { 
        quality,
        inputVideo,
        setOutputVideo,
        setConverting,
        removeAudio,
        startTrim,
        endTrim
      } = useContext(AppContext)


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
        
        
        if (removeAudio) {
          await ffmpeg.run('-i', 'input.mp4', '-ss', '00:00:00', '-to', `${convertTimeFormat(endMinusStart(endTrim, startTrim))}`, '-vf', `scale=-2:${quality}`, '-c:v', 'libx264', '-crf', '28', '-preset', 'fast', '-an', 'output.mp4')
        } else {
          await ffmpeg.run('-i', 'input.mp4', '-ss', '00:00:00', '-to', `${convertTimeFormat(endMinusStart(endTrim, startTrim))}`, '-vf', `scale=-2:${quality}`, '-c:v', 'libx264', '-crf', '28', '-preset', 'fast', '-c:a', 'aac', '-b:a', '128k', 'output.mp4')
        }

        const outputData = ffmpeg.FS('readFile', 'output.mp4')
        const outputVideo = new Blob([outputData.buffer], { type: 'video/mp4' })
    
        let info = await getInfo(outputVideo)
        info = info.media.track[0]
        // console.log(info)
    
        const metadata = {
          'FileName': 'edited_' + inputVideo.metadata.FileName,
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


      return (
        <button type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" onClick={handleConvert}>Convert</button>
      )

}


export default ConvertButton