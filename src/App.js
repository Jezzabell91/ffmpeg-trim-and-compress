import logo from './logo.svg'
import './App.css'
import { getInfo } from 'react-mediainfo'
import { useState } from 'react'

function App() {

const [videoInfo, setVideoInfo] = useState({})
const [video, setVideo] = useState()

  return (
    <div className="App">
    <input id="fileinput" type="file" accept="video/*" onChange={async (e) => {
        let file = e.target.files?.item(0) ?? { 'type': 'none' }
        const info = await getInfo(file)
        console.log(info.media.track[0])
        setVideoInfo(info.media.track[0])
        setVideo(file)
      }
      } />

    { video && <video
        controls
        width="350"
        src={URL.createObjectURL(video)}>

      </video>

      }
     { <p>
        {videoInfo.Duration}
      </p> 
      }

    </div>
  )
}

export default App
