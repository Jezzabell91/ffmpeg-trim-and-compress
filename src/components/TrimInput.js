import { useContext } from 'react'
import AppContext from '../context/app-context'

import InputMask from "react-input-mask"

const TrimInput = ({ label }) => {

    const {
        startTrim,
        setStartTrim,
        endTrim,
        setEndTrim
    } = useContext(AppContext)

    const handleChange = (e, position) => {
        let timerValue = e.target.value

        if (position === 'Start') {
            setStartTrim(timerValue)
        }
        else if (position === 'End') {
            setEndTrim(timerValue)
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
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full text-xl border-gray-300 rounded-md text-right"
                        name="start"
                    />
                )}
            </InputMask>
        </div>
    </div>
    )

}


export default TrimInput