import React, { useState } from 'react';
import AppContext from './app-context'


const AppState = (props) => {
    const [quality, setQuality] = useState(480)
    const [inputVideo, setInputVideo] = useState(null)
    const [outputVideo, setOutputVideo] = useState(null)
    const [converting, setConverting] = useState(false)
    const [startTrim, setStartTrim] = useState('00:00:00.000')
    const [endTrim, setEndTrim] = useState(0)

    return (
        <AppContext.Provider value={{
            quality,
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
            setEndTrim,
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppState