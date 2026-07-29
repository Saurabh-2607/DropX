import path from 'path';
import * as z from 'zod';

export const signUpSchema = z.object({
    email: z
        .string()
        .email({message: "Please Enter a valid Email"})
        .min(1, { message: 'Email is required' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .min(1, { message: 'Password is required' }),
    passwrordConfirmation: z
        .string()
        .min(1, { message: 'Password confirmation is required' }),
})
.refine((data) => data.password === data.passwrordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwrordConfirmation'],
})