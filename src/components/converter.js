import { useEffect, useState, useContext } from 'react'
import DropArea from '../components/DropArea'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import ButtonContainer from './ButtonContainer'

import VideoCard from './VideoCard'
import Loading from './Loading'
import EditingOptions from './EditingOptions'
import AppContext from '../context/app-context'



const ffmpeg = createFFmpeg({ log: true })

const Converter = () => {

  const [ready, setReady] = useState(false)

  const { 
    inputVideo,
    outputVideo,
    converting,
  } = useContext(AppContext)

  // Load ffmpeg 
  const load = async () => {
    await ffmpeg.load()
    setReady(true)
  }

  useEffect(() => {
    load()
  }, [])

  // useEffect(() => {
  //   // console.log("rendering:", startTrim, endTrim)
  // }, [startTrim, endTrim])

  // useEffect(() => {
  //   console.log("quality:", quality)
  // }, [quality])


  return !ready ? (
        // Stage 0: Loading. Display while loading ffmpeg 
        <Loading />
  ) : (
    
    
    <div className="App md:w-screen md:h-screen lg:bg-gray-900 bg-green-600 grid grid-cols-1 place-items-center">

    {/* Stage 1: Selecting. Show the drag and drop file area */}
    { !inputVideo &&
      <DropArea />
    }

    {/* Stage 2: Editing. Show the selected video and options for trimming and quality */}
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
                  <ButtonContainer stage={"editing"} ffmpeg={ffmpeg} />
                </>
              }
            </div>
          </div>

        </div>
      </div>
    }

    
    {/* Stage 3: Converting. Show message that the video is being converted */}
    { converting &&
        <p className="text-2xl font-normal text-center text-green-600">Converting... It could take a while, please be patient <br></br><span className="text-2xl">If you can hear your computer fans it's probably working</span></p>
    }

    {/* Stage 4: Converted. Show the converted output and provide option to save */}
    {outputVideo &&
      <>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 place-items-center gap-y-12">
          <div class="max-w-3xl mx-auto">
            <div className="bg-transparent overflow-hidden rounded-lg max-w-xl h-full grid grid-cols-1 place-items-around gap-y-12">
              <div className="px-4 py-5 sm:p-6 ">
                <VideoCard video={"output"} />
                <ButtonContainer stage={"converted"} />
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