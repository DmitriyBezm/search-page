import { type ChangeEvent, useState, useRef, useEffect, type RefObject, useLayoutEffect } from "react";
import "./styles.css";
import { Api } from "./Api";
import { Card } from "./components/Card";
import { CardsLoader } from "./components/Card/CardLoader";
import { CrossIcon } from "./components/icons/CrossIcon";
import { debounce } from "./utils/debounce";
import { MoreButton } from "./components/MoreButton";
import type { Recipe } from "./types";

const getInititalSearch = () => {
  return new URL(window.location.href).searchParams.get("search") ?? "";
};

const SKIP_INDEX = 0;
const STEP_SIZE = 6;

export default function App() {
  const [search, setSearch] = useState(getInititalSearch());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(SKIP_INDEX);
  const [total, setTotal] = useState(0);
  const [actualStep, setActualStep] = useState(0);

  const controller = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const URLRef = useRef(new URL(window.location.href));
  const cardRefs = useRef(new Map());

  const handleRef = (id: number, node: HTMLLIElement | null) => {
    cardRefs.current.set(id, node)
 
    return () => {
      cardRefs.current.delete(id)
    }
  }

  const searchRecipes = async (search: string = "") => {
    try {
      setIsLoading(true);

      if (controller.current) {
        controller.current.abort("abort");
        controller.current = null;
      }

      controller.current = new AbortController();

      const result = await Api.recipes.getList(
        { search },
        controller.current.signal
      );

      setRecipes(result.recipes);
      setTotal(result.total);

      setIsLoading(false);
      // reset to default limit on every search change
      setSkip(SKIP_INDEX);
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

  useLayoutEffect(() => {
    if (actualStep > 0) {
      // get last loaded elements for 0 to actualStep
      const [first] = recipes.slice(-actualStep);
      if (first) {
        const cardEl = cardRefs.current.get(first?.id) as HTMLLIElement;
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }, [actualStep, recipes])

  const handleLoadMore = async () => {
    try {
      const next = skip + STEP_SIZE;

      const result = await Api.recipes.getList({
        search,
        skip: next
      });

      setRecipes((data) => data.concat(result.recipes));
      setSkip(next);
      setTotal(result.total);
      setActualStep(result.recipes.length);
    } catch (e) {
      console.error(e)
    }
  }

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
    setSkip(SKIP_INDEX);
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
            <button className="icon-button" onClick={handleClear}>
              <CrossIcon />
            </button>
          )}
        </div>
        {isLoading && <CardsLoader />}
        {!isLoading && recipes && recipes?.length > 0 ? (
          <>
            <ul className="list cards">
              {recipes.map((item) => (
                <li className="list-item" key={item.id} ref={(ref) => handleRef(item.id, ref)}>
                  <Card recipe={item} />
                </li>
              ))}
            </ul>
            {!!total && (total > recipes.length) && (
              <MoreButton onLoad={handleLoadMore} text="Load More" key="more" />
            )}
          </>
        ) : null}
        {!isLoading && search.length !== 0 && recipes?.length === 0 && (
          <div className="no-data">No recipes found</div>
        )}
      </div>
    </div>
  );
}
