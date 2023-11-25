"use client";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import RegularButton from "src/components/regularButton";
import capitalizeFLetter from "src/helper/capitalizeLetter";
import { CameraIcon } from "src/svgs";
import { User } from "src/types/userType";

type UserResponse = {
    user: User;
    status: string;
};

const UserProfile = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const _id = searchParams.get("id");
    const [profile, setProfile] = useState<User>();
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        const getUserProfile = async (_id: string) => {
            try {
                const res = await axiosPrivate.get<UserResponse>(
                    "/user/" + _id
                );
                console.log(res.data);
                setProfile(res.data.user);
            } catch (e) {
                console.log({ e });
            }
        };
        if (_id == session?.user._id) setProfile(session?.user);
        else {
            _id && getUserProfile(_id);
        }
    }, []);
    const basicInformation = [
        { label: "Full name", value: profile?.name },
        { label: "Department", value: profile?.departmentId?.name },
        { label: "Gender", value: profile?.gender },
        {
            label: "D.O.B",
            value:
                profile?.birthday &&
                format(parseISO(profile?.birthday), "dd/MM/yyyy"),
        },
        { label: "Academic level", value: profile?.level },
        { label: "Home town", value: profile?.homeTown },
        { label: "Ethnic", value: profile?.ethnicGroup },
        { label: "Employee code", value: profile?.code },
        // { label: "Position", value: profile?.positionId },
    ];
    const contactInformation = [
        { label: "Phone number", value: profile?.phoneNumber },
        { label: "Email", value: profile?.email },
        {
            label: "Address",
            value: profile?.address,
        },
    ];

    const moveToEditScreen = () => {
        router.replace("/account/edit-profile?id=" + _id);
    };

    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
            {_id == session?.user._id && (
                <RegularButton
                    label="edit"
                    additionalStyle="self-end mb-2"
                    callback={moveToEditScreen}
                />
            )}

            {/* Basic information */}
            <div className=" p-10 bg-white w-11/12 rounded-md">
                <div className="  bg-[#F1F6FF] rounded-lg flex flex-row shadow-md">
                    <div className="flex flex-col w-1/4">
                        <div className=" rounded-tl-lg rounded-br-xl bg-button h-fit w-fit p-1 font-semibold text-white">
                            Basic Information
                        </div>
                        <div className="flex mt-[20%] mx-7 w-3/4 items-end flex-col justify-end">
                            <img
                                src={profile?.avatarImage}
                                alt="Employee avatar"
                                className="h-full rounded-full "
                            />
                            <button className=" w-12 h-12 bg-bar rounded-[14px] border-4 border-white items-center justify-center flex absolute">
                                <CameraIcon width="22" height="18" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-1">
                        <div className="grid grid-rows-6 grid-flow-col auto-rows-min w-full pt-16 pb-3 px-3 gap-y-2 gap-x-3 ">
                            {basicInformation.map((info) => (
                                <div className="w-full h-fit flex flex-wrap text-[#5B5F7B] items-end">
                                    <p className=" w-[50%] block text-start whitespace-nowrap font-semibold">
                                        {info.label}:
                                    </p>
                                    <p className="w-[50%] text-sm text-start font-normal">
                                        {capitalizeFLetter(info.value)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact information */}
            <div className="w-11/12 mt-9 p-10 bg-white rounded-md">
                <div className="  bg-[#F1F6FF] rounded-lg flex flex-row shadow-md ">
                    <div className="flex flex-col w-1/4">
                        <div className=" rounded-tl-lg rounded-br-xl bg-button h-fit w-fit p-1 font-semibold text-white">
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
        </div>
    );
};

export default UserProfile;
