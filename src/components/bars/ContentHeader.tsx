import React from "react";
import AvatarComponent from "../others/Avatar";

const ContentHeader = () => {
    return (
        <div className="dark:bg-dark bg-bg flex flex-row w-full h-14 backdrop-blur-sm px-3 py-[4px] border-b-1 border-button">
            <div className="flex flex-row h-full items-center gap-3 hover:bg-[#1313130f] px-2 rounded-md">
                <AvatarComponent userName="H" isOnline={false} size={36} />
                <div>
                    <span className=" text-[15px] font-semibold text-button">
                        Thu Hien
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ContentHeader;
