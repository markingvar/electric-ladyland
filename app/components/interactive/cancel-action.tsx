import { Link } from "@remix-run/react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export function CancelAction() {
  return (
    <>
      <span className="block h-6 tb:h-8"></span>
      <div className="content-wrapper">
        <Link
          className="expand-click-target flex items-center text-xl text-danger-6 w-fit"
          to="/"
        >
          <span className="cancel-action-icon-wrapper -mt-1 mr-1.5 text-2xl ">
            <IoIosCloseCircleOutline />
          </span>
          Cancel
        </Link>
      </div>
      <span className="block h-10 tb:h-14"></span>
    </>
  );
}
