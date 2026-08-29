import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const TestimonialCard = ( { name, role, review, rating, avatar } ) =>
{
  const renderStars = ( rating ) =>
  {
    const stars = [];
    const full = Math.floor( rating );
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - ( half ? 1 : 0 );

    for ( let i = 0; i < full; i++ )
      stars.push( <StarIcon key={ `f${ i }` } sx={ { fontSize: { xs: 13, md: 17 }, color: "#FBB41B" } } /> );
    if ( half )
      stars.push( <StarHalfIcon key="h" sx={ { fontSize: { xs: 13, md: 17 }, color: "#FBB41B" } } /> );
    for ( let i = 0; i < empty; i++ )
      stars.push( <StarBorderIcon key={ `e${ i }` } sx={ { fontSize: { xs: 13, md: 17 }, color: "#FBB41B" } } /> );

    return stars;
  };

  return (
    <div className="relative bg-white rounded-2xl px-5 py-6 lg:px-7 lg:py-8 h-full
      border border-[#f0f0f0] shadow-[0_4px_20px_rgba(0,0,0,0.06)]
      hover:shadow-[0_8px_30px_rgba(26,96,121,0.10)] hover:-translate-y-0.5
      transition-all duration-300 flex flex-col gap-4"
    >
      <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-[#1a6079]/8 flex items-center justify-center shrink-0">
        <FormatQuoteIcon sx={ { fontSize: { xs: 18, md: 22 }, color: "#1a6079" } } />
      </div>

      <p className="text-[11px] lg:text-[14px] text-[#555] leading-relaxed flex-1 line-clamp-4">
        { review }
      </p>

      <div className="flex items-center gap-0.5">
        { renderStars( rating ) }
        <span className="text-[10px] lg:text-[12px] text-[#9a9a9a] ml-1.5 font-medium">
          { rating.toFixed( 1 ) }
        </span>
      </div>

      <div className="border-t border-dashed border-[#ebebeb]" />

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full shrink-0 overflow-hidden
            bg-[#1a6079] flex items-center justify-center shadow-sm"
        >
          { avatar
            ? <img src={ avatar } alt={ name } className="w-full h-full object-cover" />
            : <span className="text-white font-bold text-[16px] lg:text-[18px]">
              { name?.charAt( 0 )?.toUpperCase() }
            </span>
          }
        </div>
        <div>
          <p className="text-[13px] lg:text-[15px] font-semibold text-[#1a1a1a] leading-tight">
            { name }
          </p>
          <p className="text-[10px] lg:text-[12px] text-[#1a6079] font-medium">
            { role }
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;