import Link from 'next/link';

export default function Footer() {
  const footerLinks = [
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'GitHub', href: 'https://github.com/fvarellalopes/clawsouls' },
    { label: 'Discord', href: 'https://discord.gg/clawsouls' },
  ];

  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright Text */}
        <p className="text-muted-foreground text-sm text-center md:text-left">
          © 2024 CLAWSOULS TERMINAL // SYSTEM STATUS: <span className="text-primary">NOMINAL</span>
        </p>

        {/* Footer Links */}
        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : '_self'}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
              className="text-muted-foreground text-sm hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
