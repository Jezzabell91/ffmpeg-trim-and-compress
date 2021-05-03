import { useContext } from 'react'
import AppContext from '../context/app-context'

const SaveButtonLink = () => {

    const { outputVideo } = useContext(AppContext)

    return (
    <a href={outputVideo.file} download={outputVideo.metadata.FileName} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Save</a>
    )
}


export default SaveButtonLink