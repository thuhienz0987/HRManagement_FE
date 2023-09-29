import InputText from "src/components/inputText";

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-5 bg-no-repeat bg-fixed bg-cover bg-[url('../../public/assets/images/background.png')]">
      <div className="flex flex-col w-2/3 md:w-1/2 lg:w-1/3 md:self-end h-3/4 self-center lg:self_end sm:self-center justify-center items-center bg-primaryAuth">
        <div className="w-2/3 flex flex-col items-center justify-center">
          <div className="text-[#FAF9F6] font-bold text-3xl">SIGN UP</div>
          <div>
            <p className="text-[#FAF9F6] text-xs">
              Enter your username and password
            </p>
          </div>
          <InputText placeHolder="Thu hien" label="Username" />
          <InputText
            placeHolder="Enter your password"
            label="Password"
            type="password"
          />

          <div className="self-end">
            <p className="text-[#FAF9F6] text-xs font-medium">
              <i>Forgot password ?</i>
            </p>
          </div>

          <div className="flex items-center flex-row self-start">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-[#24243f] bg-gray-100 border-gray-300 rounded focus:ring-[#24243f] dark:focus:ring-[#24243f] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-checkbox"
              className="text-[#FAF9F6] text-xs font-medium ml-2"
            >
              Remember password
            </label>
          </div>

          <div className="w-full mt-3 h-10 flex">
            <button className="w-full bg-white hover:bg-[#24243f] text-[#24243f] hover:text-[#FAF9F6] hover:border-[#FAF9F6] rounded-md font-bold">
              SIGN IN
            </button>
          </div>

          <div className="flex items-center flex-row text-xs mt-2 font-medium">
            <p className="text-[#FAF9F6]">No account yet ? </p>
            <button className="hover:drop-shadow-[1px_2px_2px_rgba(255,255,255,1)] text-[#24243f] ml-1">
              Register
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
