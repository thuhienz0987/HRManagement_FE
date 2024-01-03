import React from "react";

function DeleteIcon({
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
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.00033 16.8133C5.00033 17.73 5.75033 18.48 6.66699 18.48H13.3337C14.2503 18.48 15.0003 17.73 15.0003 16.8133V6.81331H5.00033V16.8133ZM15.8337 4.31331H12.917L12.0837 3.47998H7.91699L7.08366 4.31331H4.16699V5.97998H15.8337V4.31331Z"
        fill="#C89E31"
      />
      <path
        d="M5.00033 16.8133C5.00033 17.73 5.75033 18.48 6.66699 18.48H13.3337C14.2503 18.48 15.0003 17.73 15.0003 16.8133V6.81331H5.00033V16.8133ZM15.8337 4.31331H12.917L12.0837 3.47998H7.91699L7.08366 4.31331H4.16699V5.97998H15.8337V4.31331Z"
        fill="black"
        fillOpacity="0.25"
      />
    </svg>
  );
}

export default DeleteIcon;
