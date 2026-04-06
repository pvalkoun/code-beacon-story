import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
  "gmx.com", "live.com", "msn.com", "me.com", "fastmail.com",
  "tutanota.com", "inbox.com", "qq.com", "163.com", "126.com",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Name is required (min 2 characters)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailLower = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const domain = emailLower.split("@")[1];
    if (FREE_EMAIL_DOMAINS.includes(domain)) {
      return new Response(JSON.stringify({ error: "Please use a work email address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("changelog_subscribers")
      .select("id, verified")
      .eq("email", emailLower)
      .maybeSingle();

    if (existing?.verified) {
      return new Response(JSON.stringify({ error: "This email is already subscribed" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let verificationToken: string;

    if (existing && !existing.verified) {
      // Re-send verification - generate new token
      const newToken = crypto.randomUUID();
      await supabase
        .from("changelog_subscribers")
        .update({ name: name.trim(), verification_token: newToken, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      verificationToken = newToken;
    } else {
      // New subscriber
      const newToken = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from("changelog_subscribers")
        .insert({ name: name.trim(), email: emailLower, verification_token: newToken });

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: "Failed to subscribe. Please try again." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      verificationToken = newToken;
    }

    // Send verification email via the verify endpoint (which will handle email sending)
    // For now, log the token - email sending will be added with a proper email service
    console.log(`Verification token for ${emailLower}: ${verificationToken}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Please check your email to verify your subscription.",
        // Include token in dev for testing - remove in production
        _dev_token: verificationToken,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Subscribe error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
