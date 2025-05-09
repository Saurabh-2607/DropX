"use client"
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router"
import { AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod";
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { signInSchema } from "@/schemas/signInSchemas";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label";
export default function SignInForm(){
    const router = useRouter()
    const { signIn, isLoaded, setActive } = useSignIn()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
        identifier: "",
        password: "",
        },
    });
    
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        if (!isLoaded) return;

        try {
            const result = await signIn.create({
                identifier: data.identifier,
                password: data.password,
            });

            if (result.status === "complete") {
                await setActive({
                    session: result.createdSessionId,
                });
                router.push("/dashboard");
            } else {
                console.error("Sign In Error");
            }
        } catch (error: any) {
            console.error(
                error.errors?.[0]?.message || "An error occurred, please try again later"
            );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login to your Account</CardTitle>
                <CardDescription>Login to your account to access your files</CardDescription>
            </CardHeader>
            <CardContent>
                {authError && (
                    <Card>
                        <CardContent>
                            <Label>
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            </Label>
                            {authError}
                        </CardContent>
                    </Card>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="identifier">Email</Label>
                            <Input               
                                id="identifier"
                                type="email"
                                placeholder="your.email@example.com"
                                {...register("identifier")}
                            />

                            <Label htmlFor="password">Password</Label>
                            <Input               
                                id="password"
                                placeholder="••••••••"
                                className={!!errors.password ? "border-red-500" : ""}
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                {...register("password")}
                            />
                            
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Verifying..." : "Verify Email"}
                            </Button>


                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
            <p className="text-sm text-default-600">
                New to DropX, Create a Account{" "}
                <Link
                    href="/sign-up"
                    className="text-primary hover:underline font-medium"
                >
                    Sign up
                </Link>
            </p>
            </CardFooter>
        </Card>
    )
}