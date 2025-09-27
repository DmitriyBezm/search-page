import React, { type FC, type PropsWithChildren } from "react";

import { type Recipe } from "../../types";
import { Tag } from "../Tag";
import "./styles.css";

type CardProps = {
  recipe: Recipe;
};

const Image: FC<{ src?: string; loading?: boolean }> = ({ src, loading }) => {
  const classNames = ["card-image"];

  if (loading) {
    classNames.push("card-skeleton");
  }

  const className = classNames.join(" ");

  if (src) {
    return <img className={className} src={src} />;
  }

  return <div className={className} />;
};

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className="card">{children}</div>;
};

const TextSkeleton: FC<{
  width: number | string;
  height?: string | number;
}> = ({ width, height }) => {
  return (
    <div
      className="card-text-skeleton card-skeleton"
      style={{ width, height }}
    />
  );
};

type Card = FC<CardProps> & {
  Img: typeof Image;
  Wrapper: typeof Wrapper;
  TextSkeleton: typeof TextSkeleton;
};

export const Card: Card = ({ recipe }) => {
  return (
    <Wrapper>
      <Image src={recipe.image} />
      <h4 className="card-title">{recipe.name}</h4>
      <div className="card-tags">
        {recipe?.tags.map((tag, index) => (
          <React.Fragment key={tag}>
            {index !== 0 && " "}
            <Tag key={tag}>{tag}</Tag>
          </React.Fragment>
        ))}
      </div>
      <ul className="card-items list">
        <li className="card-item list-item">
          Cooking: {recipe.cookTimeMinutes}m
        </li>
        <li className="card-item list-item">
          Preparing: {recipe.prepTimeMinutes}m
        </li>
        <li className="card-item list-item">Difficulty: {recipe.difficulty}</li>
        <li className="card-item list-item">Reviews: {recipe.reviewCount}</li>
      </ul>
    </Wrapper>
  );
};

Card.Img = Image;
Card.Wrapper = Wrapper;
Card.TextSkeleton = TextSkeleton;
