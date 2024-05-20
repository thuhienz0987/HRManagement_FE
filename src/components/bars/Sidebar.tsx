import React from "react";
import SidebarButton from "../buttons/SidebarButton";
import { ImageIcon,MessageIcon } from "src/svgs";

const Sidebar = () => {
    return (
        <div className="flex flex-col">
            <SidebarButton Icon={MessageIcon} />
            <SidebarButton Icon={ImageIcon} />
        </div>
    );
};

export default Sidebar;
