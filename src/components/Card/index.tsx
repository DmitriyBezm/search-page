import React, { memo, type FC, type NamedExoticComponent, type PropsWithChildren, type Ref } from "react";

import { type Recipe } from "../../types";
import { Tag } from "../Tag";
import "./styles.css";

type CardProps = {
  recipe: Recipe;
  ref?: Ref<HTMLDivElement> 
};

const Image: FC<{ src?: string; }> = ({ src }) => {
  const className = "card-image";

  if (src) {
    return <img className={className} src={src} />;
  }

  return <div className={className} />;
};

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className="card">{children}</div>;
};

interface CardComponent extends NamedExoticComponent<CardProps> {
  Wrapper: typeof Wrapper;
};

export const Card = memo(({ recipe }) => {
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
}) as CardComponent;

Card.Wrapper = Wrapper;
