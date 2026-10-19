"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navigation = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#about", label: "About" },
];

export function StudioHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = `studio-navigation-${useId()}`;
  const header = useRef<HTMLElement>(null);
  const mobileNavigation = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 761px)");
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      setOpen(false);
      toggle.current?.focus();
    };
    const onOutside = (event: Event) => {
      if (event.target instanceof Node && !header.current?.contains(event.target))
        setOpen(false);
    };
    const onNavigation = () => setOpen(false);
    const onDesktop = () => {
      if (!desktop.matches) return;
      // A focused mobile link must not disappear without a visible focus target.
      if (mobileNavigation.current?.contains(document.activeElement) || toggle.current === document.activeElement)
        header.current?.querySelector<HTMLAnchorElement>(".studio-desktop-nav a")?.focus();
      setOpen(false);
    };

    document.addEventListener("keydown", onEscape);
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onOutside);
    window.addEventListener("hashchange", onNavigation);
    window.addEventListener("popstate", onNavigation);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onOutside);
      window.removeEventListener("hashchange", onNavigation);
      window.removeEventListener("popstate", onNavigation);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  return (
    <>
      <a href="#main" className="skip-link studio-chrome-skip">Skip to content</a>
      <header ref={header} className="direction-header direction-container studio-chrome-header">
        <Link className="direction-wordmark" href="/" aria-label="Hoàng Anh Vũ, home" onClick={close}>VŨ<span aria-hidden="true">*</span></Link>
        <nav className="studio-desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href} onClick={close}>{item.label}</Link>
          ))}
        </nav>
        <div className="studio-header-actions">
          <Link href="/#contact" className="direction-contact-button studio-chrome-contact-button" data-magnetic onClick={close}>
            <span data-magnetic-content>Let’s talk <ArrowUpRight size={17} aria-hidden="true" /></span>
          </Link>
          <ThemeToggle />
          <button
            ref={toggle}
            type="button"
            className="studio-menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}<span>Menu</span>
          </button>
        </div>
        <nav ref={mobileNavigation} id={menuId} className="studio-mobile-nav" aria-label="Mobile navigation" hidden={!open}>
          {navigation.map((item) => (
            <Link href={item.href} key={item.href} onClick={close}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>
          ))}
          <Link href="/#contact" onClick={close}>Let’s talk<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </nav>
      </header>
    </>
  );
}

export function StudioFooter() {
  return (
    <footer className="direction-contact studio-chrome-contact" id="contact" aria-labelledby="studio-contact-title">
      <div className="direction-container">
        <div className="direction-contact-top" data-motion-reveal><span className="direction-eyebrow">Open to frontend & full-stack roles</span><span>Ho Chi Minh City, VN</span></div>
        <div className="direction-contact-heading" data-motion-reveal>
          <h2 id="studio-contact-title">Let’s make<br /> <span>what’s next.</span></h2>
          <a href="mailto:hoanganhvu.dev@gmail.com" className="direction-mail-circle" aria-label="Email Hoàng Anh Vũ" data-magnetic><span data-magnetic-content><ArrowUpRight size={46} aria-hidden="true" /><span>Let’s talk</span></span></a>
        </div>
        <a href="mailto:hoanganhvu.dev@gmail.com" className="direction-email" data-motion-reveal>hoanganhvu.dev@gmail.com<ArrowUpRight size={23} aria-hidden="true" /></a>
        <div className="direction-footer">
          <span>© 2026 Hoàng Anh Vũ</span>
          <div>
            <a href="https://github.com/vuhoang123" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/in/hoanganhvu2405/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a>
            <a href="#main">Back to top <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
