// app/api/membership/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json(
        { ok: false, error: "Missing env vars. Check .env.local and restart dev server." },
        { status: 500 }
      );
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } });

    const body = await req.json();

    const full_name = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const location = String(body.location ?? "").trim();
    const membership_type = String(body.membershipType ?? "").trim();
    const message = String(body.message ?? "").trim();
    const consent = Boolean(body.consent);

    if (!full_name || !email || !phone || !location || !membership_type || !consent) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("membership_registrations")
      .insert([
        {
          full_name,
          email,
          phone,
          location,
          membership_type,
          message: message || null,
          consent,
        },
      ])
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "API is live. Use POST." }, { status: 200 });
}