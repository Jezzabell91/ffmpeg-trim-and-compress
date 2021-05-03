import { useContext } from 'react'
import AppContext from '../context/app-context'
import convertTimeFormat from '../helpers/convertTimeFormat'

const VideoCard = ( {video} ) => {

    const { 
        inputVideo,
        outputVideo,
      } = useContext(AppContext)

    let file 
    let metadata

    if (video === 'input' && inputVideo !== null){
        file = URL.createObjectURL(inputVideo.file)
        console.log(file)
        metadata = inputVideo.metadata 
    } else if (video === 'output' && outputVideo !== null){
        file = outputVideo.file
        metadata = outputVideo.metadata 
    }

      return (
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <video
            controls
            width="480"
            src={file}>
          </video>
          <div className="px-4 py-4 sm:px-6">
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-2 gap-x-2 gap-y-2 sm:grid-cols-2">
                <p className="text-sm font-medium text-gray-500">
                  File:  <span className="mt-1 text-sm font-normal text-gray-900">{metadata.FileName}</span>
                </p>
                <p className="text-sm font-medium text-gray-500">
                  Duration: <span className="mt-1 text-sm font-normal text-gray-900">{convertTimeFormat(metadata.Duration)}</span>
                </p>
                <p className="text-sm font-medium text-gray-500">
                  Size: <span className="mt-1 text-sm font-normal text-gray-900">{(metadata.FileSize)}MB</span>
                </p>
                <p className="text-sm font-medium text-gray-500">
                  Type: <span className="mt-1 text-sm font-normal text-gray-900">{(metadata.FileType)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      ) 
}


export default VideoCard