import RegularButton from "src/components/regularButton";
import { CameraIcon } from "src/svgs";

const UserProfile = () => {
    const basicInformation = [
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Department", value: "Marketing" },
        { label: "Gender", value: "Male" },
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Full name", value: "Nguyen Van A" },
    ];
    const contactInformation = [
        { label: "Phone number", value: "0921346731" },
        { label: "Email", value: "nguyvana@gmail.com" },
        {
            label: "Address",
            value: "123 Điện Biên Phủ, Bình Thạnh, Hồ Chí Minh",
        },
    ];
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
            <RegularButton label="edit" additionalStyle="self-end mb-2 " />
            {/* Basic information */}
            <div className=" w-11/12 h-80 bg-[#F1F6FF] rounded-lg flex flex-row shadow-lg">
                <div className="flex flex-col w-1/4">
                    <div className=" rounded-tl-lg rounded-br-xl bg-[#56CCF26B] h-fit w-fit p-1 font-semibold text-[#123060]">
                        Basic Information
                    </div>
                    <div className="flex mt-[20%] mx-7 h-1/2 items-end flex-col justify-end">
                        <img
                            src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                            alt="Employee avatar"
                            className="h-full rounded-full "
                        />
                        <button className=" w-12 h-12 bg-[#5F66EA] rounded-[14px] border-4 border-white items-center justify-center flex absolute">
                            <CameraIcon width="22" height="18" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-1">
                    <div className="grid grid-rows-6 grid-flow-col auto-rows-min w-full pt-16 pb-3 px-5 gap-y-2 gap-x-7 ">
                        {basicInformation.map((info) => (
                            <div className="w-full h-fit flex flex-wrap text-[#5B5F7B]">
                                <p className="w-1/2 block text-start break-words font-semibold">
                                    {info.label}:
                                </p>
                                <p className=" text-start font-normal">
                                    {info.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Contact information */}
            <div className=" w-11/12 bg-[#F1F6FF] rounded-lg flex flex-row shadow-lg mt-9">
                <div className="flex flex-col w-1/4">
                    <div className=" rounded-tl-lg rounded-br-xl bg-[#56CCF26B] h-fit w-fit p-1 font-semibold text-[#123060]">
                        Contact Information
                    </div>
                </div>
                <div className="flex flex-1">
                    <div className="grid grid-rows-3 grid-flow-col auto-rows-min w-full pt-4 pb-3 px-5 gap-y-2 gap-x-7 ">
                        {contactInformation.map((info) => (
                            <div className="w-full h-fit flex flex-wrap text-[#5B5F7B]">
                                <p className="w-1/4 block text-start break-words font-semibold">
                                    {info.label}:
                                </p>
                                <p className=" text-start font-normal">
                                    {info.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
