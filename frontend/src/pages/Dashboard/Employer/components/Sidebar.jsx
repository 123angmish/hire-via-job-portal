import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import IconButton from "@mui/material/IconButton";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useDispatch } from "react-redux";
import { logout } from "../../../../store/candidate/authSlice";

const menuItems = [
  {
    page: "Company Profile",
    path: "/employer/company-profile",
    icon: <ApartmentOutlinedIcon />,
  },
  {
    page: "Post Job",
    path: "/employer/post-job",
    icon: <DriveFolderUploadOutlinedIcon />,
  },
  {
    page: "Manage Jobs",
    path: "/employer/manage-jobs",
    icon: <ManageSearchOutlinedIcon />,
  },
  {
    page: "View Applicants",
    path: "/employer/view-applicants",
    icon: <PeopleAltOutlinedIcon />,
  },
];

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen min-w-full sm:min-w-[50%] lg:min-w-[20%] lg:max-w-[21%] bg-(--primary-color) z-50 transform transition-transform duration-300 ease-in-out
          ${openSidebar ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        <div className="mt-4 lg:hidden px-5 flex justify-end">
          <IconButton
            onClick={() => setOpenSidebar(false)}
            sx={{ border: "1px solid #f1f1f1", color: "#fff" }}
          >
            <ClearOutlinedIcon />
          </IconButton>
        </div>

        <div className="lg:mt-12 mt-4 text-center px-4">
          <Link to="/" className="logo font-bold text-[22px] text-white block">
            Hire Via
          </Link>

          {/* Prominent Back To Home Button */}
          <Link
            to="/"
            onClick={() => setOpenSidebar(false)}
            className="mt-5 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
              bg-white/15 hover:bg-white/25 active:scale-95 text-white font-semibold text-[14px]
              transition-all border border-white/20 shadow-sm"
          >
            <HomeOutlinedIcon sx={{ fontSize: 20 }} />
            Back To Home
          </Link>
        </div>

        <ul className="mt-8 space-y-2">
          {menuItems.map((item, index) => {
            let activePaths = [item.path];

            if (item.path === "/employer/company-profile") {
              activePaths.push("/employer/edit-company-profile");
            }

            const isActive = activePaths.includes(location.pathname);

            return (
              <li
                key={index}
                className={`px-6 ml-5 lg:mr-0 mr-5 text-white py-4 ${
                  isActive && "activeDashboardPage"
                }`}
              >
                <Link
                  to={item.path}
                  className="text-[16px] flex items-center gap-2"
                  onClick={() => setOpenSidebar(false)}
                >
                  {item.icon}
                  {item.page}
                </Link>
                {isActive && (
                  <>
                    <div className="circle hidden lg:block"></div>
                    <div className="circle2 hidden lg:block"></div>
                  </>
                )}
              </li>
            );
          })}
        </ul>

        <div className="px-6 text-white py-4 ml-5 absolute bottom-8">
          <button
            onClick={handleLogout}
            className="cursor-pointer text-[16px] flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <LogoutOutlinedIcon />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
