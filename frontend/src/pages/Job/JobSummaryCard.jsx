import React from "react";
import InfoRow from "./InfoRow";
import pcIcon from "../../assets/pc.png";
import companyIcon from "../../assets/company.png";
import industryIcon from "../../assets/industry.png";
import expIcon from "../../assets/exp.png";
import jobIcon from "../../assets/job.png";
import locIcon from "../../assets/loca.png";

const JobSummaryCard = ( { job } ) =>
{
  return (
    <div className="bg-[rgba(0,123,255,0.1)] rounded-2xl p-6 lg:p-8">
      <h2 className="font-bold text-[18px] lg:text-[20px]">{ job?.avgSalary }</h2>
      <p className="text-sm opacity-60 font-medium">Avg. Salary</p>

      <div className="mt-8 space-y-6">
        <InfoRow
          label="Company"
          value={ job?.company?.name }
          icon={ companyIcon }
        />
        <InfoRow
          label="Industry"
          value={ job?.company?.industry }
          icon={ industryIcon }
        />
        <InfoRow
          label="Experience"
          value={ job?.requiredExperience }
          icon={ expIcon }
        />
        <InfoRow label="Job Type" value={ job?.timing } icon={ jobIcon } />
        <InfoRow
          label="Location"
          value={ job?.company?.location }
          icon={ locIcon }
        />
      </div>
    </div>
  );
};

export default JobSummaryCard;