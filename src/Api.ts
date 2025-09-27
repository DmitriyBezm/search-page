import type { ListResponse, Recipe } from "./types";

export type RecipesResponse = ListResponse<"recipes", Recipe>;

const BASE_API = "https://dummyjson.com";

export const Api = {
  recipes: {
    async getList({
      search,
      limit = 6,
      skip = 0,
    }: { search?: string; limit?: number; skip?: number }, signal?: AbortSignal) {
      const params = new URLSearchParams();
      params.set('skip', `${skip}`);

      if (search) {
        params.set('q', search);
      }

      if (limit) {
        params.set('limit', `${limit}`);
      }

      const response = await fetch(`${BASE_API}/recipes/search?${params.toString()}`, {
        signal,
      });
      return (await response.json()) as RecipesResponse;
    },
  },
};
