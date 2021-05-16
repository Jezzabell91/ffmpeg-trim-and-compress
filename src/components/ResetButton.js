import { useContext } from 'react'
import AppContext from '../context/app-context'

const ResetButton = () => {

    const { 
        setQuality,
        setInputVideo,
        setOutputVideo,
        setStartTrim,
        setEndTrim,
        setRemoveAudio,
      } = useContext(AppContext)

      const handleReset = () => {
        setInputVideo(null)
        setOutputVideo(null)
        setStartTrim('00:00:00.000')
        setEndTrim(0)
        setQuality(480)
        setRemoveAudio(false)
      }

      return (
        <button type="button" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200" onClick={handleReset}>Reset</button>
      )

}


export default ResetButton