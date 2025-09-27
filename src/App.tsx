import { ChangeEvent, useState, useRef, useEffect, RefObject } from "react";
import "./styles.css";
import { Api } from "./Api";
import { type Recipe } from "./types";
import { Card } from "./components/Card";
import { Loader } from "./components/Loader";
import { debounce } from "./utils/debounce";

// TODO
// Pagination
// Add CardSkeleton component

const getInititalSearch = () => {
  return new URL(window.location.href).searchParams.get("search") ?? "";
};

export default function App() {
  const [search, setSearch] = useState(getInititalSearch());
  const [data, setData] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>();
  const URLRef = useRef(new URL(window.location.href));

  const searchRecipes = async (search: string = "") => {
    try {
      if (controller.current) {
        controller.current.abort("abort");
        controller.current = null;
      }

      controller.current = new AbortController();

      setIsLoading(true);

      const result = await Api.recipes.getList(
        search,
        controller.current.signal
      );

      setData(result.recipes);
      setIsLoading(false);
    } catch (error) {
      if (typeof error === "string" && error === "abort") {
        // if request was aborted won't hide loader
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    searchRecipes(getInititalSearch());
    return () => {
      if (controller.current) {
        controller.current.abort("abort");
        controller.current = null;
      }
    };
  }, []);

  // use network throttling to check data consistency
  const searchRecipesDebounced = useRef(debounce(300, searchRecipes));

  const updateSearchParams = (value: string = "") => {
    if (value.trim()) {
      URLRef.current.searchParams.set("search", value);
    } else {
      URLRef.current.searchParams.delete("search");
    }

    history.replaceState({}, "", URLRef.current);
  };

  const handleClear = () => {
    setSearch("");
    searchRecipes();
    updateSearchParams();
    inputRef?.current?.focus();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    // dont't trim spaces because we need show all results if there are no search text
    const value = event.target.value;
    setSearch(value);
    searchRecipesDebounced.current(value);
    updateSearchParams(value);
  };

  return (
    <div className="root">
      <div className="container">
        <div className="search">
          <input
            className="input"
            value={search}
            type="text"
            onChange={handleInputChange}
            placeholder="Enter a recipe name (e.g.) Chicken Karahi"
            ref={inputRef as RefObject<HTMLInputElement>}
          />
          {search.length > 0 && (
            <button className="button" type="button" onClick={handleClear}>
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                />
              </svg>
            </button>
          )}
        </div>
        {isLoading && <Loader />}
        {!isLoading && data.length > 0 ? (
          <ul className="list cards">
            {data.map((item) => (
              <li className="list-item" key={item.id}>
                <Card recipe={item} />
              </li>
            ))}
          </ul>
        ) : null}
        {!isLoading && search.length !== 0 && data.length === 0 && (
          <div className="no-data">No recipes found</div>
        )}
      </div>
    </div>
  );
}
