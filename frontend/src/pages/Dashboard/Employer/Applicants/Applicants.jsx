import React, { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ApplicantTable from "./ApplicantTable";
import { useDispatch, useSelector } from "react-redux";
import
{
  fetchApplicants,
  searchApplicants,
} from "../../../../store/employer/employerApplicantSlice";

import { fetchEmployerProfile } from "../../../../store/employer/employerSlice";

const Applicants = () =>
{
  const dispatch = useDispatch();
  const { employer } = useSelector( ( state ) => state.employer );

  const [ search, setSearch ] = useState( "" );

  useEffect( () =>
  {
    dispatch( fetchEmployerProfile() );
  }, [ dispatch ] );

  useEffect( () =>
  {
    const token = localStorage.getItem( "jwt" );

    if ( !token ) return;

    if ( search.trim() === "" )
    {
      dispatch( fetchApplicants( employer?.id ) );
    } else
    {
      dispatch( searchApplicants( { employerId: employer?.id, keyword: search } ) );
    }
  }, [ dispatch, search, employer?.id ] );

  return (
    <section className="px-4 sm:px-6 lg:px-9 lg:pb-0 pb-10">
      <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold">
        Applicants
      </h2>

      <div className="mt-6 flex flex-col lg:flex-row justify-between gap-4">
        <div className="w-full lg:w-[48%] ">
          <input
            value={ search }
            onChange={ ( e ) => setSearch( e.target.value ) }
            type="text"
            className="border-[rgba(0,0,0,0.23)] placeholder:text-[12px] sm:placeholder:text-[14px] md:placeholder:text-[15px] border rounded-md h-9 sm:h-10.5 md:h-11 text-[12px] sm:text-[14px] md:text-[15px] w-full px-3 sm:px-4"
            placeholder="Search By Name / Skills"
          />
        </div>

      </div>
      <ApplicantTable />
    </section>
  );
};

export default Applicants;
