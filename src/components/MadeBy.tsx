import React from "react";

const MadeBy = () => {
  return (
    <div className="madeby-animation bg-gray-300 p-4 w-full rounded-2xl flex flex-row justify-between">
      <div>
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
      <div>
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
