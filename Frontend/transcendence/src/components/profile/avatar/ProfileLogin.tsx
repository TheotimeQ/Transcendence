"use client";

import styles from "@/styles/profile/AvatarCard.module.css";
import EditButton from "./EditButton";
import { useState } from "react";

type Props = {
  profile: Profile;
  isOwner: boolean;
};

export default function ProfileLogin({ profile, isOwner }: Props) {
  // [!] clean le Edit button et simplifier les props si au final il est retire

  return (
    <div className={styles.loginCard}>
      <div className={styles.login}>
        <h1>{profile.login}</h1>
      </div>
      {isOwner && <EditButton />}
    </div>
  );
}
