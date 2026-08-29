import React from "react";
import { Link } from "react-router-dom";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import graphIcon from "../../../assets/graph.png";
import codeIcon from "../../../assets/code.png";
import adIcon from "../../../assets/advertisement.png";
import editIcon from "../../../assets/edit.png";
import usersIcon from "../../../assets/users.png";
import moneyBagIcon from "../../../assets/moneyBag.png";
import CategoryCard from "./CategoryCard";

const categories = [
  {
    icon: graphIcon,
    title: "Business Development",
  },
  {
    icon: codeIcon,
    title: "Web & Software",
  },
  {
    icon: adIcon,
    title: "Digital Marketing",
  },
  {
    icon: editIcon,
    title: "Design & Creative",
  },
  {
    icon: usersIcon,
    title: "Human Resources",
  },
  {
    icon: moneyBagIcon,
    title: "Finance & Accounts",
  },
];

const Categories = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("jwt");
  const isEmployer = token && role === "EMPLOYER";

  return (
    <section className="lg:px-12 px-6 py-12 lg:py-16 bg-white border-y border-slate-200/80">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="lg:text-[24px] text-[18px] font-extrabold text-slate-900 tracking-tight">
            {isEmployer ? "Hire By Industry Category" : "Explore By Category"}
          </h2>
          <p className="text-[12px] lg:text-[14px] text-slate-500 mt-1">
            {isEmployer
              ? "Select a specialized industry category to recruit top talent"
              : "Discover real-time verified openings across leading domains"}
          </p>
        </div>
        <Link
          to={isEmployer ? "/employer/post-job" : "/jobs"}
          className="text-[#1a6079] font-bold text-[13px] lg:text-[15px] flex items-center gap-1 hover:underline"
        >
          {isEmployer ? "Post in Category" : "View All"}
          <ChevronRightOutlinedIcon sx={{ fontSize: 18 }} />
        </Link>
      </div>

      <div className="grid lg:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-4 lg:gap-5">
        {categories.map((c, index) => (
          <CategoryCard key={index} category={c} isEmployer={isEmployer} />
        ))}
      </div>
    </section>
  );
};

export default Categories;
