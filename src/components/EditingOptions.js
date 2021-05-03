import QualitySelection from './QualitySelection'
import TrimInput from './TrimInput'

const EditingOptions = () => {

    return (
        <fieldset>
            <div className="flex justify-around w-full my-8 gap-4">
                <TrimInput label={"Start"} />
                <TrimInput label={"End"} />
            </div>
            <QualitySelection />
        </fieldset>
    )

}


export default EditingOptions