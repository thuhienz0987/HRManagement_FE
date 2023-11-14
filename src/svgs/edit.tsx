import React from "react";

function EditIcon({
    width = "24",
    height = "24",
    fill,
    stroke,
}: {
    width?: string;
    height?: string;
    fill?: string;
    stroke?: string;
}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.5 12.3549V15.4799H3.625L12.8417 6.2632L9.71667 3.1382L0.5 12.3549ZM15.2583 3.84653C15.5833 3.52153 15.5833 2.99653 15.2583 2.67153L13.3083 0.721533C12.9833 0.396533 12.4583 0.396533 12.1333 0.721533L10.6083 2.24653L13.7333 5.37153L15.2583 3.84653Z"
                fill="#C2C9D1"
            />
            <path
                d="M0.5 12.3549V15.4799H3.625L12.8417 6.2632L9.71667 3.1382L0.5 12.3549ZM15.2583 3.84653C15.5833 3.52153 15.5833 2.99653 15.2583 2.67153L13.3083 0.721533C12.9833 0.396533 12.4583 0.396533 12.1333 0.721533L10.6083 2.24653L13.7333 5.37153L15.2583 3.84653Z"
                fill="black"
                fill-opacity="0.25"
            />
        </svg>
    );
}

export default EditIcon;
