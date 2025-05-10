"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import * as z from "zod";
import Link from "next/link";
import { signUpSchema } from "@/schemas/signUpSchemas";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle, Lock } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation";
import { RadioGroup } from "@radix-ui/react-radio-group";

export default function SignUpForm() {
    const router = useRouter();
    const [verifying, setVerfying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [varificationCode, setVarificationCode] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);
    const [varificationError, setVarificationError] = useState<string | null>(null);
    const { signUp, isLoaded, setActive } = useSignUp();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwrordConfirmation:"", 
        }
    })

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if(!isLoaded) return
        setIsSubmitting(true)
        setAuthError(null)

        try{
            await signUp.create({
                emailAddress: data.email,
                password: data.password
            })
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })
            setVerfying(true)
        }catch(error: any){
            console.error("Signup Error:", error)
            setAuthError(
                error.errors?.[0]?.message || "An Error occured dutring the SignUp. Please try again"
            )
        }finally{
            setIsSubmitting(false)
        }
    };

    const handleVarificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!isLoaded || !signUp) return
        setIsSubmitting(true)
        setAuthError(null)

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: varificationCode
            })

            if(result.status == "complete"){
                await setActive({session: result.createdSessionId})
                router.push("/dashboard")
            }else{
                console.log("Varification Failed",result)
                setVarificationError(
                    "Varification Could not be completed"
                )
            }
                
            } catch (error:any) {
                console.log("Varification Failed",error)
                setVarificationError(
                    error.errors![0]?.message || "An Error occured during the SignUp. Please try again"
                )            
            } finally{
                setIsSubmitting(false)
            }
    }

    if(verifying){
        return(
            <Card>
                <CardHeader>
                    <CardTitle>Varify Your Email</CardTitle>
                    <CardDescription>We Have Sent a code to your Email</CardDescription>
                </CardHeader>
                <CardContent>
                    {varificationError && (
                        <Card>
                            <CardContent>
                                <Label>
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                </Label>
                                {varificationError}
                            </CardContent>
                        </Card>
                    )}
                    <form onSubmit={handleVarificationSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="varificationCode">Varification Code</Label>
                            <Input id="varificationCode" placeholder="Enter your 6-digit Code" value={varificationCode} onChange={(e) => setVarificationCode(e.target.value)} />
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Verifying..." : "Verify Email"}
                            </Button>
                        </div>
                    </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-default-500">
                        Didn't receive a code?{" "}
                        <Button
                            onClick={async () => {
                            if (signUp) {
                                await signUp.prepareEmailAddressVerification({
                                strategy: "email_code",
                                });
                            }
                            }}
                            className="text-primary hover:underline font-medium"
                        >
                            Resend code
                        </Button>
                        </p>
                    </div>

                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create your Account</CardTitle>
                <CardDescription>Sign up to start managing your images securely</CardDescription>
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
                            <Label htmlFor="email">Email</Label>
                            <Input               
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                                {...register("email")}
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

                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input               
                                id="confirmPassword"
                                placeholder="••••••••"
                                className={!!errors.password ? "border-red-500" : ""}
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                {...register("password")}
                            />
                            <RadioGroup>
                                <RadioGroupItem value="agreed"/>
                                <Label htmlFor="agreed"> By signing up, you agree to our Terms of Service and Privacy Policy</Label>
                            </RadioGroup>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Verifying..." : "Verify Email"}
                            </Button>
                        </div>
                    </div>
                    </form>
            </CardContent>
            <CardFooter>
            <p className="text-sm text-default-600">
                Already have an account?{" "}
                <Link
                    href="/sign-in"
                    className="text-primary hover:underline font-medium"
                >
                    Sign in
                </Link>
            </p>
            </CardFooter>
        </Card>
    )
}