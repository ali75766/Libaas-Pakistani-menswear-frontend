import { orderApi } from "../api/orderApi";

export const fetchOrdersAction = (params) => orderApi.list(params);
export const fetchOrderAction = (id) => orderApi.getById(id);
export const createOrderAction = (payload) => orderApi.create(payload);
export const updateOrderAction = (id, payload) => orderApi.update(id, payload);
