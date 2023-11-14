interface screenProps {
  label: string;
  placeHolder: string;
  id: string;
  value: string;
  onChange: any;
  type?: "text" | "password";
}

const InputText = ({ label, placeHolder, id, value, onChange, type = "text" }: screenProps) => {
  return (
    <div className=" w-full flex flex-col mt-2">
      <h5 className=" text-xs mb-2 text-[#24243f] dark:text-[#FAF9F6] font-semibold">
        {label}
      </h5>
      <input
        type={type}
        id={id}
        value={value}
        className=" text-sm rounded-lg border-gray-950 border h-10 p-3 leading-4"
        placeholder={placeHolder}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default InputText;
