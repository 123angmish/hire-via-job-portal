import React from "react";

const CompanyCard = ( { company } ) =>
{
  return (
    <div className="col-span-1 flex justify-center" key={ company.name }>
      <img
        className="lg:w-17.5 w-8"
        src={ company.logo }
        alt={ company.name }
      />
    </div>
  );
};

export default CompanyCard;
