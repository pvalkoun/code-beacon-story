import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Bell, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
  "gmx.com", "live.com", "msn.com", "me.com", "fastmail.com",
  "tutanota.com",
];

export default function ChangelogSubscribe() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validateWorkEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    const domain = email.toLowerCase().split("@")[1];
    if (FREE_EMAIL_DOMAINS.includes(domain)) return "Please use a work email address (not Gmail, Yahoo, etc.)";
    return null;
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (firstName.trim().length < 2) { setErrorMsg("First name must be at least 2 characters"); return; }
    if (lastName.trim().length < 2) { setErrorMsg("Last name must be at least 2 characters"); return; }
    if (companyName.trim().length < 2) { setErrorMsg("Company name is required"); return; }

    const emailError = validateWorkEmail(email);
    if (emailError) { setErrorMsg(emailError); return; }

    setStatus("loading");

    try {
      const { data, error } = await supabase.functions.invoke("changelog-subscribe", {
        body: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          company_name: companyName.trim(),
        },
      });

      if (error) { setStatus("error"); setErrorMsg("Something went wrong. Please try again."); return; }
      if (data?.error) { setStatus("error"); setErrorMsg(data.error); return; }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="docs-prose">
      <Link to="/changelog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 no-underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Changelog
      </Link>

      <h1>Subscribe to Changelog Updates</h1>
      <p className="text-lg text-muted-foreground">
        Get notified when we publish new API changes, features, and updates. A work email is required.
      </p>

      <div className="not-prose mt-6">
        <Card className="bg-accent/5 border-accent/20 max-w-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <Bell className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-base font-semibold">Subscribe to Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below. We'll send a verification link to confirm your subscription.
                </p>
              </div>
            </div>

            {status === "success" ? (
              <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg border border-accent/30">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">Check your email!</p>
                  <p className="text-sm text-muted-foreground">We've sent a verification link to {email}. Please verify to start receiving updates.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="sub-first-name">First Name</Label>
                    <Input id="sub-first-name" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={status === "loading"} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="sub-last-name">Last Name</Label>
                    <Input id="sub-last-name" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={status === "loading"} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="sub-email">Work Email</Label>
                  <Input id="sub-email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === "loading"} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="sub-company">Company Name</Label>
                  <Input id="sub-company" placeholder="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} disabled={status === "loading"} className="mt-1" />
                </div>
                <Button type="submit" disabled={status === "loading"} className="w-full">
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 mt-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
