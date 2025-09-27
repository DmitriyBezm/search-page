import { Card } from "..";
import "./styles.css";

export const CardsLoader = () => {
  return (
    <div className="cards cards-loader">
      <Card.Wrapper>
        <div className="card-loader-image-skeleton card-loader-skeleton"></div>
        <div className="cards-loader-text">
          <div className="card-loader-text-skeleton card-loader-skeleton" style={{ width: '100%' }}/>
          <div className="card-loader-text-skeleton card-loader-skeleton" style={{ width: '70%' }}/>
          <div className="card-loader-text-skeleton card-loader-skeleton" style={{ width: '70%' }}/>
        </div>
      </Card.Wrapper>
      <Card.Wrapper>
        <div className="card-loader-image-skeleton card-loader-skeleton"></div>
        <div className="cards-loader-text">
          <div className="card-loader-text-skeleton card-loader-skeleton" style={{ width: '50%' }}/>
          <div className="card-loader-text-skeleton card-loader-skeleton" style={{ width: '60%' }}/>
          <div className="card-loader-text-skeleton card-loader-skeleton" style={{ width: '70%' }}/>
        </div>
      </Card.Wrapper>
      <Card.Wrapper>
        <div className="card-loader-image-skeleton card-loader-skeleton"></div>
        <div className="cards-loader-text">
          <div className="card-loader-text-skeleton card-loader-skeleton" style={{ width: '80%' }}/>
          <div className="card-loader-text-skeleton card-loader-skeleton" style={{ width: '80%' }}/>
          <div className="card-loader-text-skeleton card-loader-skeleton" style={{ width: '30%' }}/>
        </div>
      </Card.Wrapper>
    </div>
  );
};
