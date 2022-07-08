import { FC } from "react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/solid";

type PropTypes = {
  isHttp: Boolean;
};

export const IsHttpIndicator: FC<PropTypes> = ({ isHttp }) => {
  if (isHttp) {
    return (
      <div className="bg-green-400/20 pl-2 pr-3 py-0.5 rounded-md flex flex-row gap-x-2 mb-3 w-min">
        <LockClosedIcon className="text-green-400 w-5 h-5 pt-0.5" />
        <p className="text-green-400">https://</p>
      </div>
    );
  }

  return (
    <div className="bg-orange-400/20 pl-2 pr-3 py-0.5 rounded-md flex flex-row gap-x-2 mb-3 w-min">
      <LockOpenIcon className="text-orange-400 w-5 h-5 pt-0.5" />
      <p className="text-orange-400">http://</p>
    </div>
  );
};
