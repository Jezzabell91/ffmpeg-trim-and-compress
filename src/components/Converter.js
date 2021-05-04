import { useEffect, useState, useContext } from 'react'
import DropArea from './DropArea'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import ConvertButton from './ConvertButton'
import ResetButton from './ResetButton'
import SaveVideoLink from './SaveVideoLink'
import ButtonContainer from './ButtonContainer'
import VideoStageContainer from './VideoStageContainer'
import VideoCard from './VideoCard'
import LoadingStage from './LoadingStage'
import ConvertingStage from './ConvertingStage'
import EditingOptions from './EditingOptions'
import AppContext from '../context/app-context'
import Example from './Example'

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
        // TODO: Implement spinner 
        <LoadingStage />
  ) : (
    
    <div className="App w-full h-full bg-gray-900 grid grid-cols-1 place-items-center">

    {/* Stage 1: Selecting. Show the drag and drop file area */}
    { !inputVideo &&
      <DropArea />
    }

    {/* Stage 2: Editing. Show the selected video and options for trimming and quality */}
    {  (inputVideo && !converting && !outputVideo) &&
        <VideoStageContainer>
        <VideoCard video={"input"} />
        <EditingOptions />
        <ButtonContainer>
          <ConvertButton ffmpeg={ffmpeg}/>
          <ResetButton />
        </ButtonContainer>
        </VideoStageContainer>
    }

    {/* Stage 3: Converting. Show message that the video is being converted
    TODO: Implement progress bar
    */}
    { converting && 
      <ConvertingStage />
    }

    {/* Stage 4: Converted. Show the converted output and provide option to save */}
    {outputVideo &&
        <VideoStageContainer>
                <VideoCard video={"output"} />
                <ButtonContainer>
                  <SaveVideoLink />
                  <ResetButton />
                </ButtonContainer>
        </VideoStageContainer>
    }
  </div>
    )
}

export default Converter