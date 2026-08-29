import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category, isEmployer }) => {
  const targetUrl = isEmployer ? "/employer/post-job" : "/jobs";

  return (
    <Link
      to={targetUrl}
      className="col-span-1 bg-white border border-slate-200/90 rounded-2xl text-center p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#1a6079]/40 hover:shadow-[0_10px_25px_rgba(26,96,121,0.08)] cursor-pointer flex flex-col items-center justify-between group"
    >
      <div className="bg-[#1a6079]/8 group-hover:bg-[#1a6079]/15 mx-auto flex justify-center items-center h-14 w-14 rounded-2xl transition-colors mb-3">
        <img className="w-7 h-7 object-contain" src={category.icon} alt={category.title} />
      </div>

      <div>
        <h3 className="font-bold text-[14px] lg:text-[15px] text-slate-800 leading-snug group-hover:text-[#1a6079] transition-colors mb-1">
          {category.title}
        </h3>
        <p className="text-[11px] lg:text-[12px] text-[#1a6079] font-semibold bg-[#1a6079]/8 px-2.5 py-0.5 rounded-full inline-block">
          {isEmployer ? "Post Openings" : "Explore Roles"}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
