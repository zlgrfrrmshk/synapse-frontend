// import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "../assets/default-user-avatar.png";
import { Link } from "react-router-dom";
import axios from "axios";

const User = ({ id }: { id: string }) => {
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();
  const [error, setError] = useState(false);
  useEffect(() => {
    axios
      .get(`/api/user/get/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => {
        setUser(null);
        setError(true);
      });
  }, [id]);

  if (error) return <div className="text-red-500">Что-то пошло не так...</div>;
  if (!user) return null;

  return (
    <Link className="anim flex flex-col items-center" to={`/user/${id}`}>
      <img
        src={
          user.avatar == "" ? DefaultAvatar : `/storage/avatars/${user.avatar}`
        }
        alt={user.name}
        className="border-primary border-8 size-full rounded-full"
      />
      <div className="roboto-semibold text-2xl">{user.name}</div>
      <div className="roboto-regular text-xl">
        {user.subscribers} подписчиков
      </div>
    </Link>
  );
};

export default User;
