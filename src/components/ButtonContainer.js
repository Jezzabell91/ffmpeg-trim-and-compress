const ButtonContainer = (props) => {

    return (
        <div className="flex items-center justify-around">
            {props.children}
        </div>
    )
}

export default ButtonContainer