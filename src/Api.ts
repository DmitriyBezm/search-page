import type { ListResponse, Recipe } from "./types";

type RecipesResponse = ListResponse<"recipes", Recipe>;

const BASE_API = "https://dummyjson.com";

export const Api = {
  recipes: {
    async getList(search?: string, signal?: AbortSignal) {
      const response = await fetch(`${BASE_API}/recipes/search?q=${search}`, {
        signal,
      });
      return (await response.json()) as RecipesResponse;
    },
  },
};
