"use client"

import { signIn } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useState } from "react"
import { Button } from "./ui/button"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarImage } from "./ui/avatar"
import { credentialsSchema } from "@/lib/zodSchemas"
import { useToast } from "./ui/use-toast"
import { z } from "zod"

function SigninHome() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { toast } = useToast();

  async function handleSubmit(provider: string) {
    const authParams = { email, password }
    let result;
    try {
      if (provider == "credentials") {
        credentialsSchema.parse(authParams)
        result = await signIn("credentials", { ...authParams, redirect: false })
        location.reload();
      }
      if (provider == "github") {
        result = await signIn("github", { redirect: false })
      }

      if (result?.error) {
        throw result.error
      }
    } catch (error) {
      let errorMessage = "";
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path,
          message: err.message
        }));
        errorMessage = errors[0].message.toString()
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = "An unknown error occurred.";
      }

      toast({
        title: "Error",
        description: errorMessage
      });
    }

  }

  return (
    <main className=" w-full h-full p-8">
      <div className="flex flex-col items-center">
        <h2 className="text-6xl font-bold mb-8 text-rose">Welcome!</h2>
        <Card className="dark">
          <CardHeader>
            <CardTitle>
              Signin to continue!
            </CardTitle>
            <CardDescription>
              Choose any method. You will be signed up automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Label htmlFor="emailInput">Email Address</Label>
              <Input id="emailInput" type="text" className="mb-4" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email..."></Input>
              <Label htmlFor="passwordInput"> Password <span className="text-[12px] font-light text-light">( Do not enter a password you use elsewhere! )</span></Label>
              <Input id="passwordInput" type="password" className="mb-4" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min 8 characters..."></Input>
              <Button className="self-center" onClick={() => handleSubmit("credentials")}>Sign in</Button>
              <div className="my-6">Or continue with:</div>
              <Button className="flex rounded gap-2" onClick={() => handleSubmit("github")}>
                <Avatar>
                  <AvatarImage src="/github.png" className="w-8"></AvatarImage>
                </Avatar>
                <p>Github</p>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default SigninHome