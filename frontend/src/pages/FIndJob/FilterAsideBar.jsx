import * as React from "react";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

const FilterAsideBar = ({ openSlideBar, setOpenSlideBar }) => {
  return (
    <>
      {openSlideBar && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 xl:hidden"
          onClick={() => setOpenSlideBar(false)}
        />
      )}
      <aside
        className={`bg-white border border-slate-200/90 rounded-2xl p-6 fixed top-0 z-50 xl:z-0 h-full left-0 xl:relative overflow-y-auto duration-300 w-[280px] sm:w-[320px] xl:w-[280px] shrink-0 shadow-xs ${
          openSlideBar ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        }`}
      >
        <div className="py-2 border-b border-slate-100 xl:hidden flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-[#1a6079] font-bold text-[16px]">
            <TuneOutlinedIcon sx={{ fontSize: 20 }} />
            Filters
          </div>
          <IconButton
            size="small"
            onClick={() => setOpenSlideBar(false)}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </div>

        <div className="hidden xl:flex items-center gap-2 pb-4 border-b border-slate-100">
          <TuneOutlinedIcon sx={{ fontSize: 20, color: "#1a6079" }} />
          <h3 className="text-[16px] font-bold text-slate-800">Filters</h3>
        </div>

        {/* Job Type */}
        <div className="py-5 border-b border-slate-100">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Job Type
          </h4>
          <div className="space-y-2.5">
            {["Full Time", "Part Time", "Contract", "Internship", "Remote"].map(
              (elem) => (
                <label
                  key={elem}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:text-[#1a6079] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#1a6079] focus:ring-[#1a6079] border-slate-300"
                  />
                  <span>{elem}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="py-5 border-b border-slate-100">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Experience
          </h4>
          <div className="space-y-2.5">
            {["Fresher / Entry Level", "1 - 3 Years", "3 - 5 Years", "5+ Years"].map(
              (elem) => (
                <label
                  key={elem}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:text-[#1a6079] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#1a6079] focus:ring-[#1a6079] border-slate-300"
                  />
                  <span>{elem}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Industry */}
        <div className="pt-5">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Industry
          </h4>
          <div className="space-y-2.5">
            {["IT & Software", "Marketing", "Design", "Finance", "HR"].map(
              (elem) => (
                <label
                  key={elem}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-slate-700 hover:text-[#1a6079] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#1a6079] focus:ring-[#1a6079] border-slate-300"
                  />
                  <span>{elem}</span>
                </label>
              )
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterAsideBar;
