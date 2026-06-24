import { useState, type ChangeEvent } from "react";
import type { TextInputModalDto } from "./textInputModalDto";

function TextInputModal({textInputModalDto} : { readonly textInputModalDto: TextInputModalDto}){
    const [inputValue, setInputValue] = useState("");

    const onCancelClick = () => {
        textInputModalDto.onModalCancel();
    }

    const onValidateClick = () => {
        // if (inputValue.length > 0)
        // {
            textInputModalDto.onModalValidate(inputValue);
        // }
    }

    function onInputChange(event: ChangeEvent<HTMLInputElement>){
        setInputValue(event.target.value);
    }

    return (
        <div>
            <div id="modal-bg" onClick={onCancelClick}>

            </div>
            <div id="text-input-modal">
                <p>{textInputModalDto.text}</p>
                <input onChange={(e) => onInputChange(e)} type="text" value={inputValue} />
                <div id="text-input-modal-buttons">
                    <button id="validation-button" className="basicBtn" onClick={onValidateClick}>VALIDER</button>
                    <button id="cancel-button" className="basicBtn" onClick={onCancelClick}>ANNULER</button>
                </div>
            </div>
        </div>
    )
}
export default TextInputModal;