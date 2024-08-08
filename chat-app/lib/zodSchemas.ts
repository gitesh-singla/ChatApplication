import { z } from "zod";

export const credentialsSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Min 8 characters")
})