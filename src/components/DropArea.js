import { useContext } from 'react'
import AppContext from '../context/app-context'
import Dropzone from 'react-dropzone'
import { getInfo } from 'react-mediainfo'
import bytesToMegaBytes from '../helpers/bytesToMegaBytes'
import convertTimeFormat from '../helpers/convertTimeFormat'

const DropArea = () => {

    const { 
        setQuality,
        setInputVideo,
        setOutputVideo,
        setStartTrim,
        setEndTrim
      } = useContext(AppContext)
    
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

    // console.log(metadata)
    setEndTrim(convertTimeFormat(metadata.Duration))

    setInputVideo({
      file: file,
      metadata: metadata
    })
  }

  const reset = () => {
    setInputVideo(null)
    setOutputVideo(null)
    setStartTrim('00:00:00.000')
    setEndTrim(0)
    setQuality(480)
  }

  const handleRejectedFiles = () => {
    alert("Make sure that files are in mp4 format and are less than 2GB")
    reset()
  }

    return (
        <div className="">
          <Dropzone onDropAccepted={handleDrop} onDropRejected={handleRejectedFiles} accept="video/mp4" maxSize={2147483648} maxFiles={1} >
            {({ getRootProps, getInputProps }) => (
              <div className="w-full h-full bg-green-100">
                <div {...getRootProps({ className: "w-screen border-4 border-dashed h-screen bg-gray-900 grid grid-cols-1 place-items-center" })}>
                  <input {...getInputProps()} />
                  <p className="text-2xl md:text-4xl lg:text-6xl xl:text-8xl font-bold text-center text-green-600">drag and drop<br></br>or click to select mp4</p>
                </div>
              </div>
            )}
          </Dropzone>
        </div>
    )
}

export default DropArea