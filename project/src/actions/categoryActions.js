import { categoryApi } from "../api/categoryApi";

export const fetchCategoriesAction = (params) => categoryApi.list(params);
export const fetchCategoryAction = (id) => categoryApi.getById(id);
export const createCategoryAction = (payload) => categoryApi.create(payload);
export const updateCategoryAction = (id, payload) => categoryApi.update(id, payload);
export const deleteCategoryAction = (id) => categoryApi.remove(id);
