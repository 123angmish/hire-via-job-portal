import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import
{
  deleteJob,
  fetchJobs,
  searchJobs,
} from "../../../../store/employer/employerJobSlice";
import JobTable from "./JobTable";

const ManageJobs = () =>
{
  const dispatch = useDispatch();

  const [ search, setSearch ] = useState( "" );

  useEffect( () =>
  {
    const token = localStorage.getItem( "jwt" );

    if ( !token ) return;

    if ( search.trim() === "" )
    {
      dispatch( fetchJobs() );
    } else
    {

      dispatch( searchJobs( search ) );
    }
  }, [ dispatch, search ] );



  return (
    <section className="px-4 sm:px-6 lg:px-9 ">
      <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold">
        Manage Jobs
      </h2>

      <div className="mt-6 flex flex-col lg:flex-row lg:justify-between gap-4">
        <div className="w-full lg:w-[48%]">
          <input
            value={ search }
            onChange={ ( e ) => setSearch( e.target.value ) }
            type="text"
            className="border-[rgba(0,0,0,0.23)] placeholder:text-[12px] sm:placeholder:text-[14px] md:placeholder:text-[15px] border rounded-md h-9.5 sm:h-10.5 md:h-11 text-[12px] sm:text-[13px] md:text-[14px] w-full px-3 sm:px-4"
            placeholder="Search By Job Title..."
          />

        </div>

      </div>


      <JobTable />


    </section>
  );
};

export default ManageJobs;
