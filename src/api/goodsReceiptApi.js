import { apiSlice } from "./apiSlice";

export const goodsReceiptApi = apiSlice.injectEndpoints({
  tagTypes: ["GoodsReceipt"],

  endpoints: (builder) => ({
    // LIST
    getGoodsReceipts: builder.query({
      query: (params) => ({
        url: "/goods-receipts",
        params,
      }),
      providesTags: ["GoodsReceipt"],
    }),

    // DETAIL
    getGoodsReceiptById: builder.query({
      query: (id) => `/goods-receipts/${id}`,
      providesTags: ["GoodsReceipt"],
    }),

    // CREATE (impacta stock)
    createGoodsReceipt: builder.mutation({
      query: (payload) => ({
        url: "/goods-receipts",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GoodsReceipt", "PurchaseOrder", "Buy"],
    }),
  }),
});

export const {
  useGetGoodsReceiptsQuery,
  useGetGoodsReceiptByIdQuery,
  useCreateGoodsReceiptMutation,
} = goodsReceiptApi;
