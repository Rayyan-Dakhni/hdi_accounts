import React from "react";

const AnalyticsCard = (props) => {
  const { icon, text, footerText } = props;

  return (
    <div className='w-full rounded-xl bg-gray-100 shadow-lg'>
      <div className='flex w-full p-5 rounded-t-xl bg-blue-700 justify-start text-md text-white space-x-5'>
        <span className='mx-3 text-2xl'>{icon}</span>
        {text}
      </div>

      <h3 className='text-sm text-gray-900 text-center p-5'>{footerText}</h3>
    </div>
  );
};

export default AnalyticsCard;
