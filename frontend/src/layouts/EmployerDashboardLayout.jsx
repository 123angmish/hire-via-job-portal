import React, { useState } from "react";
import Sidebar from "../pages/Dashboard/Employer/components/Sidebar";

import { useLocation, Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const EmployerDashboardLayout = ( { children } ) =>
{
  const location = useLocation();
  const [ openSidebar, setOpenSidebar ] = useState( false );

  function handleClick ( event )
  {
    event.preventDefault();
  }

  return (
    <div className="lg:flex">
      <Sidebar openSidebar={ openSidebar } setOpenSidebar={ setOpenSidebar } />

      <main className="flex-1 lg:p-6 pt-8.75! lg:ml-[21%]">
        <div
          role="presentation"
          className="xl:mb-8 mb-6 px-4 lg:px-10 flex items-center justify-between"
          onClick={ handleClick }
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              className="font-medium xl:text-[14px] text-[12px]"
              underline="hover"
              color="inherit"
              to="/"
            >
              Home
            </Link>
            <Link
              className="font-medium xl:text-[14px] text-[12px]"
              underline="hover"
              color="inherit"
              to="/account"
            >
              Employer
            </Link>
            <span className="font-medium xl:text-[14px] text-[12px] text-(--primary-color) capitalize">
              { location.pathname.split( "/" )[ 2 ] }
            </span>
          </Breadcrumbs>

          <div className="xl:hidden">
            <IconButton
              onClick={ () => setOpenSidebar( !openSidebar ) }
              sx={ {
                border: "1px solid #afafaf",
                borderRadius: "8px",
                padding: "6px",
              } }
            >
              <MenuIcon />
            </IconButton>
          </div>
        </div>
        { children }
      </main>
    </div>
  );
};

export default EmployerDashboardLayout;
