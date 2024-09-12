import Joi from "joi";

export function getColorSchema() {
  return Joi
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/)
    .message("'color' should be a valid hexadecimal string starting with #.")
  ;
}
