import React from "react";
import AvatarComponent from "../others/Avatar";
import { User } from "src/types/userType";

interface ContentHeaderProps {
    selectedUser: User;
}


const ContentHeader: React.FC<ContentHeaderProps>  = ({ selectedUser }) => {
    return (
        <div className="dark:bg-dark bg-bg flex flex-row w-full h-14 backdrop-blur-sm px-3 py-[4px] border-b-1 border-button">
            <div className="flex flex-row h-full items-center gap-3 hover:bg-[#1313130f] px-2 rounded-md">
                <AvatarComponent userName={selectedUser.name.charAt(0)} isOnline={false} size={36} imageLink={selectedUser.avatarImage} />
                <div>
                    <span className=" text-[15px] font-semibold text-button">
                        {selectedUser.name}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ContentHeader;
