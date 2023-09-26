import InputText from "src/components/inputText";

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col items-center  justify-center p-5 bg-no-repeat bg-fixed bg-cover bg-[url('../../public/assets/images/background.png')]  ">
      <div className=" flex flex-col w-1/3  h-3/4 self-end justify-center items-center rounded-xl bg-primaryAuth">
        <div className="w-2/3 flex flex-col items-center  justify-center ">
          <div className="text-white font-bold text-3xl">SIGN UP</div>
          <div>
            <p className="text-white text-xs">
              Enter your username and password{" "}
            </p>
          </div>
          <InputText placeHolder="Thu hien" label="Username" />
          <InputText
            placeHolder="Enter your password"
            label="Password"
            type="password"
          />

          <div className=" self-end">
            <p className="text-white text-xs font-medium">
              <i>Forgot password ?</i>
            </p>
          </div>

          <div className="flex items-center  flex-row self-start">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <p className="text-white text-xs font-medium ml-2">
              Remember password
            </p>
          </div>

          <div className="w-full mt-3 h-10 flex">
            <button className="w-full bg-white hover:bg-[#005FD0] text-[#005FD0] hover:text-white hover:border-white rounded-md font-bold">
              SIGN IN
            </button>
          </div>

          <div className="flex items-center flex-row text-xs mt-2 font-medium">
            <p className="text-white">No account yet ? </p>
            <button className="text-[#123060] hover:bg-white ml-1">
              Register
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
