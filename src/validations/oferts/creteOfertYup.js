import { regex } from "validations/regex";
import * as yup from "yup";

const { lettersNumbersAndSpaces } = regex;

export const creteOfertSchema = yup.object().shape({
  description: yup
    .string()
    .required("Requerido")
    .matches(lettersNumbersAndSpaces, "Solo letras"),
  basePrice: yup.number().required("Requerido"),
});
