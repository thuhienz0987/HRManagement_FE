import capitalizeFLetter from "src/helper/capitalizeLetter";
import { Button } from "@nextui-org/react";

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
        <Button
            color="primary"
            className={` min-w-[120px] h-[38px] rounded bg-[#C89E31] text-xs font-semibold text-white ${additionalStyle} hover:opacity-80 focus:opacity-50 `}
            onClick={callback}
        >
            {capitalizeFLetter(label)}
        </Button>
    );
};

export default RegularButton;
