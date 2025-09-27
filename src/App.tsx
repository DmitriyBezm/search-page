import { type ChangeEvent, useState, useRef, useEffect, type RefObject } from "react";
import "./styles.css";
import { Api } from "./Api";
import { type Recipe } from "./types";
import { Card } from "./components/Card";
import { Loader } from "./components/Loader";
import { CrossIcon } from "./components/icons/CrossIcon";
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
  const inputRef = useRef<HTMLInputElement>(null);
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
              <CrossIcon />
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
