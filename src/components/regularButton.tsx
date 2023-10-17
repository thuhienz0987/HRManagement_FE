import capitalizeFLetter from "src/helper/capitalizeLetter";

const RegularButton = ({
    label,
    callback,
    additionalStyle,
}: {
    label: string;
    callback?: () => void;
    additionalStyle?: string;
}) => {
    return (
        <button
            onClick={callback}
            className={` min-w-[120px] h-[38px] rounded bg-[#2F80ED] text-xs font-semibold text-white ${additionalStyle} focus:bg-[#3d7bcc] `}
        >
            {capitalizeFLetter(label)}
        </button>
    );
};

export default RegularButton;
