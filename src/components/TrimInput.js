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
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 hidden md:inline">
                {label}
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
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-center"
                        name="start"
                    />
                )}
            </InputMask>
        </div>
    </div>
    )

}


export default TrimInput