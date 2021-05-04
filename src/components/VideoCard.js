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
        <div className="px-4 py-5 sm:p-6 ">
          <video
            className="shadow-inner"
            controls
            width="576"
            src={file}>
          </video>
          <div className="py-4 sm:px-6">
            <div className="border-t border-gray-200 pt-5 ">
              <div className="grid grid-cols-3 grid-rows-2 gap-x-2 gap-y-2 sm:grid-cols-3 text-md justify-items-center">
                <p className="col-span-3 row-span-1 font-normal text-gray-900 ">
                  {metadata.FileName}
                </p>
                <p className="text-md font-medium text-gray-500">
                  Duration: <p className="mt-1 text-md font-normal text-gray-900">{convertTimeFormat(metadata.Duration)}</p>
                </p>
                <p className="text-md font-medium text-gray-500">
                  Size: <p className="mt-1 text-md font-normal text-gray-900">{(metadata.FileSize)}MB</p>
                </p>
                <p className="text-md font-medium text-gray-500">
                  Type: <p className="mt-1 text-md font-normal text-gray-900">{(metadata.FileType)}</p>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
      ) 
}


export default VideoCard