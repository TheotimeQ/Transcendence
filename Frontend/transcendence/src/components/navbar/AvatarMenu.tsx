"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "@/styles/navbar/AvatarMenu.module.css";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import AvatarUser from "../loggedIn/avatarUser/AvatarUser";

type Props = {
  avatar: Avatar;
  profile: Profile;
};

export default function NavbarHome({ avatar, profile }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  console.log(profile, avatar);

  const signoff = () => {
    deleteCookie("crunchy-token");
    router.push("/welcome");
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className={styles.menu} onClick={() => setMenuOpen(true)}>
      <div className={styles.avatar}>
        <AvatarUser
          avatar={avatar}
          borderSize={"3px"}
          backgroundColor={avatar.backgroundColor}
          borderColor={avatar.borderColor}
        />
      </div>
      {menuOpen && profile.id > 0 && (
        <div className={styles.dropdown} ref={menuRef}>
          <ul className={styles.list}>
            <Link href={`/home/profile/${encodeURIComponent(profile.login)}`}>
              <li className={styles.profile}>{profile.login}</li>
            </Link>
            <li onClick={signoff} className={styles.logOut}>
              Log Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
