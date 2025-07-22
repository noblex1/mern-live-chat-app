import React from "react";

function AuthSkeleton({title, text}) {
//   const gridItems = [];
//   for (let i = 0; i < 9; i++) {
//     gridItems.push(<div key={i} className="skeleton size-28"></div>);
//   }

  return (
    <div className="w-full">
      <div className="">
        <div className="hidden sm:grid grid-cols-3 gap-2 p-8">
          {[...Array(9)].map((item, index) => (
            <div key={index} className="skeleton size-28"></div>
          ))}
        </div>
        <div className="text-center">
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
      </div>
    </div>
  );
}

export default AuthSkeleton;