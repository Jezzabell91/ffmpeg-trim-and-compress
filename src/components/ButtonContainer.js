const ButtonContainer = () => {

    return (
        <div className="flex items-center justify-around gap-4 w-full mt-8">
            {props.children}
        </div>
    )
}

export default ButtonContainer