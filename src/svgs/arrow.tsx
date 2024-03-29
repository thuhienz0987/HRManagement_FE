import React from "react";

function ArrowIcon({
  width,
  height,
  fill,
  stroke,
}: {
  width: string;
  height: string;
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 7 12"
      fill="#C89E31"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.855469 11.8535L0.146484 11.1445L5.29102 6L0.146484 0.855469L0.855469 0.146484L6.70898 6L0.855469 11.8535Z"
        fill={fill}
      />
    </svg>
  );
}

export default ArrowIcon;
