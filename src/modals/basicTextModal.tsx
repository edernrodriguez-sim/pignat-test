import type { BasicTextModalDto } from "./basicTextModalDto";

function BasicTextModal({basicTextModalDto} : { readonly basicTextModalDto: BasicTextModalDto}){
    const onOkClick = () => {
        basicTextModalDto.onBasicModalClose();
    }

    return (
    <div id="basic-text-modal">
        <p>{basicTextModalDto.text}</p>
        <button className="basicBtn" onClick={onOkClick}>Ok</button>
    </div>
    )
}
export default BasicTextModal;