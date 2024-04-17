/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-else-return */
/* eslint-disable arrow-body-style */
import { createSlice } from "@reduxjs/toolkit";
import { mergeArrays } from "utils/adjustStock";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    originalStock: null,
    existStock: true,
  },
  reducers: {
    addOrder: (state, action) => {
      state.order = action.payload;
    },
    addStock: (state, action) => {
      state.originalStock = action.payload;
    },
    updateOrder: (state, action) => {
      const orderItems = state.order.orderItems.map((product) => {
        if (product._id === action.payload.id) {
          return {
            ...product,
            totalPrice: +action.payload.totalPrice,
            totalQuantity: +action.payload.totalQuantity,
            unitPrice: +action.payload.unitPrice,
            unitCost: +action.payload.unitCost,
            modifyStockData: action.payload.modifyStockData,
            modifyAvailableStock: action.payload.modifyAvailableStock,
            visible: action.payload.visible,
            allStockData:
              product.originalTotalQuantity > +action.payload.totalQuantity
                ? action.payload.modifyStockData
                : mergeArrays(
                    action.payload.modifyStockData,
                    action.payload.modifyAvailableStock
                  ),
          };
        } else {
          return product;
        }
      });
      state.order = { ...state.order, orderItems };

      state.order.subTotal = state.order.orderItems.reduce((acc, cur) => {
        return acc + cur.totalPrice;
      }, 0);

      state.order.total = state.order.subTotal + state.order.tax;
    },
    updateStock: (state, action) => {
      state.originalStock = state.originalStock.map((item) => {
        if (item.stockId === action.payload.stockId) {
          return {
            ...item,
            newQuantity: +action.payload.newQuantity,
          };
        } else {
          return item;
        }
      });
    },
    deleteProductOrder: (state, action) => {
      const orderItems = state.order.orderItems.filter(
        (product) => action.payload !== product._id
      );

      state.order = { ...state.order, orderItems };

      state.order.subTotal = state.order.orderItems.reduce((acc, cur) => {
        return acc + cur.totalPrice;
      }, 0);

      state.order.total = state.order.subTotal + state.order.tax;
      state.order.numberOfItems = state.order.orderItems.length;
    },
    errorStock: (state) => {
      state.existStock = false;
    },
    clearErrorStock: (state) => {
      state.existStock = true;
    },
    clearOrder: (state) => {
      state.order = null;
      state.originalStock = null;
      state.existStock = true;
    },
  },
});

export const {
  addOrder,
  updateOrder,
  deleteProductOrder,
  addStock,
  updateStock,
  errorStock,
  clearErrorStock,
  clearOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
