import { PassThrough } from 'stream';
import * as z from 'zod';

export const signInSchema = z.object({
    identifier:z
        .string()
        .min(1, { message: 'Email or Username is required'})
        .email({message: "Please Enter a valid Email"}),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .min(1, { message: 'Password is required' }),

});