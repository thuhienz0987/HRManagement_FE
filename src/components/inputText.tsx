import { Path, UseFormRegister } from "react-hook-form";
import { IFormValues } from "./signInForm";

interface screenProps {
    label: string;
    placeHolder: string;
    id: Path<IFormValues>;
    type?: "text" | "password";
    register: UseFormRegister<IFormValues>;
}

const InputText = ({
    label,
    placeHolder,
    id,
    type = "text",
    register,
}: screenProps) => {
    return (
        <div className=" w-full flex flex-col mt-2">
            <h5 className=" text-xs mb-2 text-[#24243f] dark:text-[#FAF9F6] font-semibold">
                {label}
            </h5>
            <input
                type={type}
                id={id}
                className=" text-sm rounded-lg border-gray-950 border h-10 p-3 leading-4"
                placeholder={placeHolder}
                required
                {...register(id)}
            />
        </div>
    );
};

export default InputText;
