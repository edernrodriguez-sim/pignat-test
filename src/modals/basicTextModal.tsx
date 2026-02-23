function BasicTextModal({text, onBasicModalClose}){
    const onOkClick = () => {
        onBasicModalClose();
    }

    return (
    <div id="basic-text-modal">
        <p>{text}</p>
        <button className="basicBtn" onClick={onOkClick}>Ok</button>
    </div>
    )
}
export default BasicTextModal;