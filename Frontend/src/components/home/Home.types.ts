export interface Product {
    id: number;
    name: string;
    price: string;
    shopName?: string;
    img?: string;
    desc?: string;
    tag?: string;
    isFavorite?: boolean;
}

export interface HomeCategory {
    id: string;
    name: string;
}

export interface FilterState {
    search: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    origin?: string;
    organic?: boolean;
    sortBy: string;
    sortOrder: string;
    shopId?: number;
}
