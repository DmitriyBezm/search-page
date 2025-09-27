// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Response<K extends string, T extends Record<string, any>> = {
  [P in K]: T;
};

export type ListResponse<
  K extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>
> = Response<K, T[]> & {
  total: number;
  skip: number;
  limit: number;
};

export type Recipe = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
};
