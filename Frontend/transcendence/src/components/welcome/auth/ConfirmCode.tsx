"use client";

import styles from "@/styles/welcome/auth/Confirm.module.css";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  [key: string]: string;
};

export default function ConfirmEmailCode() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const { handleSubmit, setValue } = useForm<FormInputs>();
  const inputRefs = React.useRef<HTMLInputElement[]>([]);

  const indexes: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  const inputs = indexes.map((index) => {
    let mid = false;
    if (index === 4) mid = true;
    return (
      <React.Fragment key={index}>
        {mid && <div>-</div>}
        <input
          defaultValue=""
          ref={(ref) => (ref ? (inputRefs.current[index] = ref) : null)}
          type="text"
          maxLength={1}
          onFocus={(event) => handleFocus(event)}
          onInput={(event) =>
            moveToNextInput(index, (event.target as HTMLInputElement).value)
          }
          onKeyDown={(event) => handleKeyDown(index, event)}
          onClick={(event) => selectCharacter(event)}
          required
        />
      </React.Fragment>
    );
  });

  const moveToNextInput = (i: number, value: string) => {
    setValue(i.toString(), value);
    if (value && i < inputs.length) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (
    i: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const value = event.currentTarget.value;

    if (!value && event.key == "Backspace" && i > 0)
      inputRefs.current[i - 1]?.focus();
  };

  const selectCharacter = (event: React.MouseEvent<HTMLInputElement>) => {
    event?.currentTarget.select();
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event?.currentTarget.value) event?.currentTarget.select();
  };

  const onSubmit = async (data: FormInputs) => {
    setMsg("");
    const code = Object.values(data).join("").toUpperCase();

    try {
      const response = await fetch(
        `http://${process.env.HOST_IP}:3000/api/auth/verify?code=${code}`
      );
      const msg = await response.json();

      setMsg(msg.message);
      if (msg.message === "Loading...") router.push("/home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.confirmEmail}>
      <h1 className={styles.title}>Confirm Email</h1>
      <p className={styles.description}>
        Please enter the verification code sent to your email address!
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.code}>
        <div className={styles.inputCode}>{inputs}</div>
        <p className={styles.msg}>{msg}</p>
        <button type="submit" className={styles.submitBtn}>
          Verify
        </button>
      </form>
      <div className={styles.bottomText}>
        <p>Did not receive any code?</p>
        <button className={styles.again}>Send code again</button>
        <button className={styles.cancel}>Cancel registration</button>
      </div>
    </div>
  );
}
