import { useState, useContext } from 'react'
import AppContext from '../context/app-context'

import InputMask from "react-input-mask"

const TrimInput = ({ label }) => {

    const {
        startTrim,
        setStartTrim,
        endTrim,
        setEndTrim
    } = useContext(AppContext)

    const [valid, setValid] = useState(true)

    const isValid = (timerValue) => {
        // pattern is 99:59:59.999
        const pattern = /^(\d\d)(:[0-5]\d){2}\.(\d){3}$/
        if (pattern.test(timerValue)){
            // console.log(timerValue, 'is valid')
            setValid(true)
            return true
        } else {
            // console.log(timerValue, 'is NOT valid')
            setValid(false)
            return false
        }
    }

    const handleChange = (e, position) => {
        let timerValue = e.target.value

        if (position === 'Start' && isValid(timerValue)) {
            setStartTrim(timerValue)
        }
        else if (position === 'End' && isValid(timerValue)) {
            setEndTrim(timerValue)
        } else {
            alert(`${position} Trim value, ${timerValue} is not valid.`)
        }
    }

    return (
        <div className="flex-grow">
        <label htmlFor="start" className="sr-only">{label}</label>
        <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 right-56 sm:right-auto pl-3 flex items-center pointer-events-none border  border-gray-200 bg-gray-900 px-3 rounded-l-md">
                <span className="text-xl text-gray-50 inline">
                {label} Trim 
      </span>
            </div>
            <InputMask formatChars={{
                '9': '[0-9]',
                '5': '[0-5]',
            }}
                mask="99:59:59.999" maskPlaceholder={'^'} defaultValue={(label === 'Start' ? startTrim : endTrim)} onBlur={(e) => handleChange(e, label)}>
                {(inputProps) => (
                    <input
                        {...inputProps}
                        type="text"
                        className={valid ? "focus:ring-green-500 focus:border-green-500  border-gray-300 shadow-sm block w-full text-xl  rounded-md text-right" : "ring-red-500 border-4 border-red-500 shadow-sm block w-full text-xl  rounded-md text-right"}
                        name="start"
                    />
                )}
            </InputMask>
        </div>
    </div>
    )

}


export default TrimInput