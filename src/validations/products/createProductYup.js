import { regex } from "validations/regex";
import * as yup from "yup";

const { lettersNumbersAndSpaces } = regex;

export const creteProductSchema = yup.object().shape({
  name: yup
    .string()
    .required("Requerido")
    .matches(lettersNumbersAndSpaces, "Solo letras y números"),

  brand: yup
    .string()
    .nullable()
    .matches(lettersNumbersAndSpaces, "Solo letras y números"),

  unit: yup
    .string()
    .nullable()
    .matches(lettersNumbersAndSpaces, "Solo letras y números"),

  type: yup
    .string()
    .nullable()
    .matches(lettersNumbersAndSpaces, "Solo letras y números"),

  description: yup
    .string()
    .nullable()
    .max(500, "Máximo 500 caracteres"),

  category: yup
    .string()
    .required("Requerido"),

  price: yup
    .number()
    .typeError("Debe ser un número")
    .required("Requerido")
    .min(0, "Debe ser mayor o igual a 0"),

  hasOffer: yup
    .boolean(),

  offerPrice: yup
    .number()
    .nullable()
    .when("hasOffer", {
      is: true,
      then: (schema) =>
        schema
          .required("Requerido")
          .min(0, "Debe ser mayor o igual a 0"),
      otherwise: (schema) =>
        schema.nullable().notRequired(),
    }),

  available: yup
    .boolean()
    .default(true),

  offerFrom: yup
    .date()
    .nullable(),

  offerTo: yup
    .date()
    .nullable(),

  isFeatured: yup
    .boolean()
    .default(false),
});
