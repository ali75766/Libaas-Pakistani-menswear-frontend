import { productApi } from "../api/productApi";

export const fetchProductsAction = (params) => productApi.list(params);
export const fetchProductAction = (id) => productApi.getById(id);
export const createProductAction = (payload) => productApi.create(payload);
export const updateProductAction = (id, payload) => productApi.update(id, payload);
export const deleteProductAction = (id) => productApi.remove(id);
