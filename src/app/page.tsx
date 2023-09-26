import InputText from "src/components/inputText";

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col items-center relative justify-center p-5 bg-no-repeat bg-fixed bg-cover bg-[url('../../public/assets/images/background.png')]  ">
      <div className=" flex flex-col w-1/3 relative h-3/4 self-end justify-center items-center rounded-xl bg-primaryAuth ">
        <div className="text-white font-bold text-3xl">SIGN UP</div>
        <form>
          <InputText placeHolder="Thu hien" label="username" />
        </form>
      </div>
    </main>
  );
}
