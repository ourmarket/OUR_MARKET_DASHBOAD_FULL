import { createSlice } from "@reduxjs/toolkit";

/* products: [
  {
    productId,
    name,
    quantity,
    unitCost,
    totalCost,
  },
], */

const buySlice = createSlice({
  name: "buy",
  initialState: {
    products: [],
    supplier: null,
    quantityProducts: null,
    total: null,

    payment: {
      cash: 0,
      transfer: 0,
      debt: 0,
    },
  },
  reducers: {
    addProduct: (state, action) => {
      state.products = [...state.products, action.payload];

      const total = state.products.reduce((acc, cur) => {
        return acc + cur.totalCost;
      }, 0);

      state.total = total;
      state.quantityProducts = state.products.length;
    },

    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
      state.subTotal = state.products.reduce((acc, cur) => {
        return acc + cur.finalPrice;
      }, 0);
    },
    updateProduct: (state, action) => {
      state.products = state.products.map((product) => {
        if (product.productId === action.payload.productId) {
          return {
            ...product,
            quantity: +action.payload.quantity,
            unitCost: +action.payload.unitCost,
            totalCost: +action.payload.totalCost,
          };
        } else {
          return product;
        }
      });

      state.total = state.products.reduce((acc, cur) => {
        return acc + cur.totalCost;
      }, 0);
    },

    addSupplier: (state, action) => {
      state.supplier = {
        id: action.payload.id,
        businessName: action.payload.businessName,
      };
    },

    clearBuy: (state) => {
      state.products = [];
      state.supplier = null;
      state.quantityProducts = null;
      state.total = null;
      state.payment = {
        cash: 0,
        transfer: 0,
        debt: 0,
      };
    },
  },
});

export const {
  addProduct,
  addSupplier,
  deleteProduct,
  updateProduct,
  clearBuy,
} = buySlice.actions;
export default buySlice.reducer;
