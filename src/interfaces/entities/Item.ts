export interface ItemInput {
  name: string;
  price: number;
}

export interface ItemParams {
  id: number;
}

export interface ItemFilters {
  name?: string;
  limit: number;
  offset: number;
}

export interface Item extends ItemInput {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemAttributes extends ItemInput {
  id?: number;
}

export interface ItemResponse {
  data: Item[];
  total: number;
}
