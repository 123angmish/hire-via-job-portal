import React from "react";

const AboutJob = ({ description, responsibilities, requiredSkills }) => {
  return (
    <div className="lg:col-span-2">
      <div>
        <h3 className="lg:text-[18px] text-[14px] font-bold">About The Job</h3>
        <p className="lg:text-[14px] text-[11px] opacity-60 mt-2 font-medium">
          {description}
        </p>
      </div>

      <div className="lg:mt-10 mt-5">
        <h3 className="lg:text-[18px] text-[14px]  font-bold">
          Responsibilities
        </h3>
        <ul className="list-disc pl-5 mt-1">
          {responsibilities?.map((elem) => (
            <li className="lg:text-[14px] text-[11px] opacity-60  font-medium">
              {elem}
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:mt-10 mt-5">
        <h3 className="lg:text-[18px] text-[14px]  font-bold">Skills</h3>

        <ul className="mt-2 flex gap-4">
          {requiredSkills?.map((s, idx) => (
            <li
              key={idx}
              className="lg:text-[13px] text-[10px] text-[#626262] mt-1 bg-[rgba(0,123,255,0.1)]  font-medium py-1 lg:px-6 px-4 rounded-full inline-block"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AboutJob;
