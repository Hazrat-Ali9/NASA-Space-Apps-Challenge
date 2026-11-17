"use client";
import Link from "next/link";
import { useAuth } from "../lib/auth";
// navbar
export default function Nav() {
  const { user, openAuth, logout } = useAuth();
  return (
    <header className="nav">
      <Link href="/" className="logo">ASTREVION</Link>
      <nav>
        <Link href="/lab">Habitability Lab</Link>
        <Link href="/about">About</Link>
        {user ? <button className="link" onClick={logout}>Log out ({user.email.split("@")[0]})</button> : <button className="link" onClick={openAuth}>Log in</button>}
      </nav>
    </header>
  );
}
