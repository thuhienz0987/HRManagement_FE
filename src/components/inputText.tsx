import { Path, UseFormRegister } from "react-hook-form";

interface screenProps {
    label: string;
    value: string;
    placeHolder: string;
    id: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: "text" | "password";
    buttonStyle?: string;
    //   register: UseFormRegister<any>; // Use appropriate type here
}

const InputText = ({
    label,
    placeHolder,
    id,
    value,
    type = "text",
    onChange,
    buttonStyle,
}: //   register,
screenProps) => {
    return (
        <div className="w-full flex flex-col mt-2">
            <h5 className="text-xs mb-2 text-[#24243f] dark:text-[#FAF9F6] font-semibold">
                {label}
            </h5>
            <input
                type={type}
                id={id}
                className={`text-sm rounded-lg border-gray-950 border h-10 p-3 leading-4 ${buttonStyle}`}
                placeholder={placeHolder}
                value={value}
                onChange={onChange}
                required
                // {...register(id)}
            />
        </div>
    );
};

export default InputText;
