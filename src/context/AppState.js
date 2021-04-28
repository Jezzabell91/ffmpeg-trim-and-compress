import React, { useState } from 'react';
import AppContext from './app-context'


const AppState = (props) => {
    const [quality, setQuality] = useState(480)

    return (
        <AppContext.Provider value={{
            quality,
            setQuality,
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppState