import { useState, type FC } from "react"

type MoreButton = {
  text: string;
  onLoad(): Promise<void>;
}

export const MoreButton: FC<MoreButton> = ({
  text,
  onLoad,
}) => {
  const [loading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!loading) {
      setIsLoading(true);
      await onLoad();
      setIsLoading(false);
    }
  }

  return (
    <button
      className="more-button"
      onClick={handleClick}
    >
      {loading ? 'Loading...' : text}
    </button>
  );
}
