import ConvertButton from './ConvertButton'
import ResetButton from './ResetButton'
import SaveVideoLink from './SaveVideoLink'

const ButtonContainer = ({ stage, ffmpeg }) => {

    return stage === "editing" ? (
        <div className="flex items-center justify-around gap-4 w-full mt-8">
            <ConvertButton ffmpeg={ffmpeg} />
            <ResetButton />
        </div>
    ) : (
        <div className="flex items-center justify-around gap-4 w-full mt-8">
            <SaveVideoLink />
            <ResetButton />
        </div>
    )
}

export default ButtonContainer