import QualitySelection from './QualitySelection'
import TrimInput from './TrimInput'

const EditingOptions = () => {

    return (
        <fieldset>
            <div className="flex flex-wrap justify-around w-full mb-6 mt-2 gap-4">
                <TrimInput label={"Start"} />
                <TrimInput label={"End"} />
            </div>
            <QualitySelection />
        </fieldset>
    )

}


export default EditingOptions