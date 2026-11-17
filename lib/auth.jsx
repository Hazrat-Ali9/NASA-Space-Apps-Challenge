"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const Ctx = createContext({});
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!supabase) return setMsg("Auth is not set up yet. Add the Supabase keys to .env.local.");
    const f = new FormData(e.target);
    const creds = { email: f.get("email"), password: f.get("password") };
    setBusy(true); setMsg("");
    const { data, error } = mode === "login" ? await supabase.auth.signInWithPassword(creds) : await supabase.auth.signUp(creds);
    setBusy(false);
    if (error) return setMsg(error.message);
    if (mode === "signup" && !data.session) return setMsg("Account created. Check your email to confirm, then log in.");
    setOpen(false);
  }

  const value = { user, openAuth: () => setOpen(true), logout: () => supabase?.auth.signOut() };
  return (
    <Ctx.Provider value={value}>
      {children}
      {open && (
        <div className="modal" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h3>{mode === "login" ? "Log in to ASTREVION" : "Create your account"}</h3>
            <input name="email" type="email" placeholder="Email" required autoComplete="email" />
            <input name="password" type="password" placeholder="Password (6+ characters)" minLength={6} required autoComplete={mode === "login" ? "current-password" : "new-password"} />
            {msg && <p role="alert">{msg}</p>}
            <button className="btn" disabled={busy}>{busy ? "Please wait" : mode === "login" ? "Log in" : "Sign up"}</button>
            <button type="button" className="link" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(""); }}>
              {mode === "login" ? "New here? Create an account" : "Have an account? Log in"}
            </button>
          </form>
        </div>
      )}
    </Ctx.Provider>
  );
}
