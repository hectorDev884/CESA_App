import React from "react";

const SummaryCard = ({
  title,
  mainText,
  subText,
  buttonText = "Ver más",
  onButtonClick,
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>

        {mainText && (
          <p
            className={`${
              subText ? "text-2xl" : "text-sm"
            } mt-2 font-bold text-gray-900`}
          >
            {mainText}
          </p>
        )}

        {subText && <p className="text-sm text-gray-600">{subText}</p>}

        <button
          onClick={onButtonClick}
          className="mt-4 text-[#036942] hover:text-green-700 text-sm font-medium hover:cursor-pointer"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SummaryCard;
