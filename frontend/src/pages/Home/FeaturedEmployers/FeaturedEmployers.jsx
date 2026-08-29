import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../../store/candidate/companySlice";
import { Link } from "react-router-dom";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

const FeaturedEmployers = () => {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const realCompanies = companies || [];

  return (
    <section className="lg:py-20 py-12 lg:px-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#1a6079] font-bold">
            Verified Employers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Featured Companies Hiring Now
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real companies and employers currently posting active job openings.
          </p>
        </div>

        <Link
          to="/find-jobs"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1a6079] hover:text-[#124557] group"
        >
          View All Opportunities
          <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {realCompanies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {realCompanies.map((c) => {
            const initial = c.name ? c.name.charAt(0).toUpperCase() : "C";
            return (
              <div
                key={c.id || c.name}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:shadow-md hover:border-[#1a6079]/40 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a6079] to-[#0284c7] text-white flex justify-center items-center font-bold text-lg shadow-xs overflow-hidden shrink-0">
                    {c.logoUrl ? (
                      <img
                        src={c.logoUrl}
                        alt={c.name}
                        className="w-full h-full object-contain p-1.5 bg-white"
                      />
                    ) : (
                      initial
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-[#1a6079] transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                      <LocationOnOutlinedIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
                      {c.location || "Delhi, India"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">
                    {c.industry || "Technology"}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Actively Hiring
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-slate-50 rounded-3xl border border-slate-200/80">
          <BusinessOutlinedIcon sx={{ fontSize: 42, color: "#94a3b8", mb: 1.5 }} />
          <h3 className="text-base font-bold text-slate-800">
            Employer Companies Will Appear Here
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            When employers register and post active job openings, their company profiles will be featured live here.
          </p>
          <Link
            to="/employer/post-job"
            className="inline-block mt-4 text-xs font-bold text-white bg-[#1a6079] px-4 py-2 rounded-xl hover:bg-[#124557] transition-all"
          >
            Post A Job As Employer
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedEmployers;
