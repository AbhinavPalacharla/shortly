import { customAlphabet } from "nanoid";

export const generateUID = () => {
  return customAlphabet("ABCDEFGHJKMNPQRSTUVWXYZ23456789", 6)();
};
