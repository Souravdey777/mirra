import { MirraHeroScene } from "@/components/MirraHeroScene";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="site-shell">
      <section className="landing-page">
        <header className="landing-header" aria-label="Landing page">
          <a className="landing-wordmark" href="/" aria-label="Mirra home">
            mirra
          </a>
        </header>

        <div className="landing-copy">
          <h1>
            <span>Grow your presence</span>
            <span>without losing your voice.</span>
          </h1>
          <p>
            Say hi to Mirra, the writing companion that understands how you think and helps shape rough ideas into posts
            that still feel like you.
          </p>
          <div id="waitlist">
            <WaitlistForm />
          </div>
        </div>

        <MirraHeroScene />

        <footer className="landing-footer">
          <span>For creators. Coming soon.</span>
          <span>Your ideas. Your voice. Mirra helps shape the post.</span>
          <a
            className="landing-footer-link"
            href="https://www.linkedin.com/company/hellomirra"
            target="_blank"
            rel="noreferrer"
          >
            Follow on LinkedIn
            <ArrowUpRight aria-hidden size={14} strokeWidth={2.6} />
          </a>
        </footer>
      </section>
    </main>
  );
}
