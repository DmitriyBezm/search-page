import { Card } from "../Card";
import "./styles.css";

export const Loader = () => {
  return (
    <div className="cards loader">
      <Card.Wrapper>
        <Card.Img loading />
        <div className="loader-text">
          <Card.TextSkeleton width="100%" />
          <Card.TextSkeleton width="70%" height="16px" />
          <Card.TextSkeleton width="50%" height="16px" />
          <Card.TextSkeleton width="80%" height="16px" />
        </div>
      </Card.Wrapper>
      <Card.Wrapper>
        <Card.Img loading />
        <div className="loader-text">
          <Card.TextSkeleton width="100%" />
          <Card.TextSkeleton width="50%" height="16px" />
          <Card.TextSkeleton width="60%" height="16px" />
          <Card.TextSkeleton width="70%" height="16px" />
        </div>
      </Card.Wrapper>
      <Card.Wrapper>
        <Card.Img loading />
        <div className="loader-text">
          <Card.TextSkeleton width="100%" />
          <Card.TextSkeleton width="80%" height="16px" />
          <Card.TextSkeleton width="80%" height="16px" />
          <Card.TextSkeleton width="30%" height="16px" />
        </div>
      </Card.Wrapper>
    </div>
  );
};
