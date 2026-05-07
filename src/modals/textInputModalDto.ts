export interface TextInputModalDto {
    text: string | undefined;
    onModalCancel: () => void;
    onModalValidate: (value:string) => void;
}