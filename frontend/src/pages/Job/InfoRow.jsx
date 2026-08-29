import React from "react";

const InfoRow = ( { label, value, icon } ) =>
{
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 lg:h-12.5 lg:w-12.5 border rounded-full flex justify-center items-center">
        <img className="w-6.5" src={ icon } alt={ label } />
      </div>

      <div>
        <h5 className="font-semibold text-[12px] lg:text-[13px]">
          { value?.replaceAll( "_", " " ) }
        </h5>
        <p className="text-[11px] lg:text-[12px] opacity-65">{ label }</p>
      </div>
    </div>
  );
};

export default InfoRow;
