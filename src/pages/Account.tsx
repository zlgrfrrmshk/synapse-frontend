import { useEffect, useState, useRef } from "react";
import { auth, provider } from "../firebase";
import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import axios from "axios";
import Button from "../components/Button";
import DefaultUserAvatar from "../assets/default-user-avatar.png";
import { Link } from "react-router-dom";
import MadeBy from "../components/MadeBy";

const Account = () => {
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        if (res.data.avatar == "") {
          setUserPhoto(DefaultUserAvatar);
        } else {
          setUserPhoto(`/storage/avatars/${res.data.avatar}`);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const [userPhoto, setUserPhoto] = useState<any>(null);

  const handleGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const idToken = await result.user.getIdToken();
        const res = await axios.post(
          "/api/auth/google",
          { idToken },
          { withCredentials: true },
        );
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => console.log("google error", err));
  };

  const handleLogout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    window.location.reload();
  };

  const [updatedName, setUpdatedName] = useState<any>(null);

  const changeInfo = async () => {
    await axios.post(
      "/api/auth/changeinfo",
      {
        name: updatedName,
      },
      { withCredentials: true },
    );
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewAvatar(file);
    setNewAvatarPreview(URL.createObjectURL(file));
  };

  const changeAvatar = async () => {
    if (!newAvatar) return;
    const formData = new FormData();
    formData.append("avatar", newAvatar);
    await axios.post("/api/auth/changeavatar", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    setTimeout(() => window.location.reload(), 500);
  };

  const [confirmDeleteAvatar, setConfirmDeleteAvatar] = useState(false);
  const deleteAvatar = async () => {
    await axios.post("/api/auth/deleteavatar", {}, { withCredentials: true });
    setTimeout(() => window.location.reload(), 500);
  };

  

  return (
    <div>
      {loading ? null : user ? (
        <div className="flex flex-col gap-2">
          <Link to={`/user/${user.id}`} className="max-w-full">
            <Button text="Посмотреть профиль" icon="" top={false} />
          </Link>

          <div className="text-black/50 roboto-bold uppercase nonselectable">
            Имя
          </div>
          <div className="sm:text-2xl text-xl">{user.name}</div>
          <div className="flex flex-col sm:flex-row w-fit sm:w-96 gap-2 sm:items-center">
            <button onClick={changeInfo}>
              <Button text="Изменить имя" icon="" top={false} />
            </button>

            <input
              type="text"
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Введите новое имя..."
              className="border-primary p-1 border-4 rounded-full h-full"
            />
          </div>
          <div className="text-black/50 roboto-bold uppercase nonselectable">
            Фото профиля
          </div>
          <div className="flex flex-row gap-2">
            {userPhoto && (
              <div className="flex flex-col gap-1 items-center">
                <img
                  src={userPhoto}
                  alt={`Аватар ${user.name}`}
                  className="nonselectable size-48 object-cover border-primary border-2"
                />
                <div className="text-black/50">Текущее</div>
              </div>
            )}
            {newAvatarPreview && (
              <div className="flex flex-col gap-1 items-center">
                <img
                  src={newAvatarPreview}
                  alt={`Превью нового аватара ${user.name}`}
                  className="nonselectable size-48 object-cover border-primary border-2"
                />
                <div className="text-black/50">Превью</div>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={avatarRef}
            onChange={handleAvatarSelect}
            className="hidden"
          />
          <div className="flex flex-row gap-2 items-center">
            <button onClick={() => avatarRef.current?.click()}>
              <Button text="Выбрать фото" icon="" top={false} />
            </button>
            {newAvatar && (
              <button onClick={changeAvatar}>
                <Button text="Сохранить" icon="" top={false} />
              </button>
            )}
            {user.avatar && !newAvatar && (
              <button onClick={() => setConfirmDeleteAvatar(true)}>
                <Button text="Удалить фото" icon="" top={false} />
              </button>
            )}

            {confirmDeleteAvatar && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                  <div className="roboto-bold text-xl">
                    Удалить фото профиля?
                  </div>
                  <div className="text-black/50">
                    Это действие нельзя отменить.
                  </div>
                  <div className="flex flex-row gap-2">
                    <button onClick={deleteAvatar} className="w-fit">
                      <Button text="Удалить" icon="" top={false} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteAvatar(false)}
                      className="w-fit"
                    >
                      <Button text="Отмена" icon="" top={false} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-black/50 roboto-bold uppercase nonselectable">
            Почта
          </div>
          <div className="sm:text-2xl text-xl wrap-break-word">
            {user.googleemail}
          </div>
          <button onClick={handleLogout} className="w-fit sm:w-100">
            <Button text="Выйти из аккаунта" icon="" top={false} />
          </button>
        </div>
      ) : (
        <div className="m-32 fixed inset-0 flex items-center justify-center">
          <button onClick={handleGoogle} className="">
            <Button text="Войти с Google" icon="" top={false} />
          </button>
        </div>
      )}

      <MadeBy />
    </div>
  );
};

export default Account;
