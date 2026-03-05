import React from "react";

const MadeBy = () => {
  return (
    <div className="madeby-animation bg-gray-300 p-4 mt-4 w-full rounded-2xl flex flex-row items-center justify-between">
      <div className="sm:text-left text-center">
        Made by{" "}
        <a
          className="roboto-bold text-primary"
          href="https://github.com/zlgrfrrmshk"
        >
          @zlgrfrrmshk
        </a>{" "}
        and{" "}
        <a
          className="roboto-bold text-primary"
          href="https://github.com/Tankist-155"
        >
          @Tankist-155
        </a>
      </div>
      <div className="sm:text-end text-center">
        GitHub:{" "}
        <a
          className="roboto-bold text-primary"
          href="https://github.com/zlgrfrrmshk/synapse-frontend"
        >
          Frontend
        </a>{" "}
        <b>·</b>{" "}
        <a
          className="roboto-bold text-primary"
          href="https://github.com/zlgrfrrmshk/synapse-backend"
        >
          Backend
        </a>
      </div>
    </div>
  );
};

export default MadeBy;
