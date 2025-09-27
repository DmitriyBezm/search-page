import React, { type FC, type PropsWithChildren } from "react";
import "./styles.css";

export const Tag: FC<PropsWithChildren> = ({ children }) => {
  return <span className="tag">#{children}</span>;
};
