"use client";

import React from "react";
import Lottie, { LottieComponentProps } from "lottie-react";

import workingAni from "./working.json";

interface IProps extends Partial<LottieComponentProps> {}

const WorkingAnimation: React.FunctionComponent<IProps> = (props) => {
  const { style, ...lottieProps } = props;

  return (
    <Lottie
      animationData={workingAni}
      loop
      style={{ marginLeft: -30, ...style }}
      {...lottieProps}
    />
  )
};

export { WorkingAnimation }
