"use client";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header container">
        <Link
          href="/"
          className="wordmark"
          aria-label="Hoàng Anh Vũ, home"
          onClick={close}
        >
          VŨ<span className="wordmark-dot">*</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/#work">
            Work <span>04</span>
          </Link>
          <Link href="/#experience">Experience</Link>
          <Link href="/#about">About</Link>
        </nav>
        <Link href="/#contact" className="header-contact">
          Let’s talk <ArrowUpRight size={17} />
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          <Link href="/#work" onClick={close}>
            Selected work <ArrowUpRight />
          </Link>
          <Link href="/#experience" onClick={close}>
            Experience <ArrowUpRight />
          </Link>
          <Link href="/#about" onClick={close}>
            About me <ArrowUpRight />
          </Link>
          <Link href="/#contact" onClick={close}>
            Let’s talk <ArrowUpRight />
          </Link>
        </nav>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <>
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-top">
            <span className="eyebrow">Have a role in mind?</span>
            <span className="contact-location">Ho Chi Minh City, Vietnam</span>
          </div>
          <a className="contact-title" href="mailto:hoanganhvu.dev@gmail.com">
            Let’s build
            <br />
            what’s next.
            <ArrowUpRight strokeWidth={1.3} />
          </a>
          <div className="contact-bottom">
            <a href="mailto:hoanganhvu.dev@gmail.com">
              hoanganhvu.dev@gmail.com <ArrowUpRight size={18} />
            </a>
            <p>Open to frontend & full-stack opportunities.</p>
          </div>
        </div>
      </section>
      <footer className="site-footer container">
        <span>© 2026 Hoàng Anh Vũ</span>
        <div>
          <a
            href="https://github.com/vuhoang123"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={14} />
          </a>
          <a
            href="https://www.linkedin.com/in/hoanganhvu2405/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowUpRight size={14} />
          </a>
        </div>
        <Link href="#main">
          Back to top <ArrowDown size={14} className="rotate-arrow" />
        </Link>
      </footer>
    </>
  );
}
