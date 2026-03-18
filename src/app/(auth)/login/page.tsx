"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = "/performance";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
            <span className="text-xs font-bold text-background tracking-wider">BX</span>
          </div>
        </div>
        <h1 className="text-lg font-semibold tracking-wide text-foreground">BRAXX</h1>
        <p className="text-xs text-muted-foreground">Sign in to your Command Center</p>
      </div>

      <div className="space-y-3">
        <div className="grid gap-1.5">
          <Label htmlFor="email" className="text-xs">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@braxxusa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 text-sm"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password" className="text-xs">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 text-sm"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-9 text-sm">Sign in</Button>
      <p className="text-[11px] text-center text-muted-foreground">Project Silo v0.2.0</p>
    </form>
  );
}
