
-- Create changelog subscribers table
CREATE TABLE public.changelog_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  verification_token UUID NOT NULL DEFAULT gen_random_uuid(),
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.changelog_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for subscription form) but restrict columns via edge function
CREATE POLICY "Allow anonymous subscribe" ON public.changelog_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- No select/update/delete from client - managed via edge functions with service role
