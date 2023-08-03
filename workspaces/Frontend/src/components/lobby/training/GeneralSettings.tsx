"use client";

import styles from "@/styles/lobby/training/GeneralSettings.module.css";
import SideSelector from "@/components/lobby/selector/SideSelector";
import Slider from "@/components/lobby/selector/Slider";

type Props = {
  side: "Left" | "Right";
  setSide: Function;
  difficulty: 1 | 2 | 3 | 4 | 5;
  setDifficulty: Function;
};

export default function GeneralSettings({
  side,
  setSide,
  difficulty,
  setDifficulty,
}: Props) {
  // -------------------------------------Traning-------------------------------------//

  return (
    <div className={styles.generalSettings}>
      {/* Side */}
      <div className={styles.set}>
        <label className={styles.section}>Side</label>
        <SideSelector id="side" value={side} setValue={setSide} />
      </div>
      {/* Difficulty */}
      <div className={styles.set}>
        <label className={styles.section}>Difficulty</label>
        <Slider
          min={1}
          max={5}
          step={1}
          value={difficulty}
          setValue={setDifficulty}
        />
      </div>
    </div>
  );
}
