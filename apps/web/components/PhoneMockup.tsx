import { colors, platforms } from "@mirra/design";
import { chatMessages, personaSnapshot, postDrafts, suggestionChips } from "@mirra/product";
import Image from "next/image";
import { Copy, Mic, Paperclip, PenLine, Sparkles, UserRound } from "lucide-react";

type PhoneMockupProps = {
  variant: "chat" | "persona" | "draft";
};

export function PhoneMockup({ variant }: PhoneMockupProps) {
  return (
    <figure className={`phone-mockup phone-mockup-${variant}`} aria-label={`Mirra ${variant} screen mockup`}>
      <div className="phone-chrome">
        <div className="phone-status">
          <span>9:41</span>
          <span>mirra</span>
        </div>
        {variant === "chat" ? <ChatPreview /> : null}
        {variant === "persona" ? <PersonaPreview /> : null}
        {variant === "draft" ? <DraftPreview /> : null}
      </div>
    </figure>
  );
}

function ChatPreview() {
  return (
    <div className="preview-stack">
      <div className="preview-top-pill">
        <span className="selected">mirra</span>
        <span>persona</span>
      </div>
      <div className="avatar-row">
        <Image src="/images/mirra-avatar.png" alt="" width={54} height={54} />
        <div>
          <strong>One post today</strong>
          <span>6 day streak</span>
        </div>
      </div>
      <div className="suggestion-row">
        {suggestionChips.slice(0, 2).map((chip) => (
          <span key={chip}>{chip}</span>
        ))}
      </div>
      <div className="mirra-message">
        <Sparkles aria-hidden size={14} color={colors.coral} />
        <p>{chatMessages[0].body}</p>
      </div>
      <div className="creator-message">{chatMessages[1].body}</div>
      <div className="composer-preview">
        <Paperclip aria-hidden size={15} />
        <span>Message Mirra...</span>
        <Mic aria-hidden size={15} />
      </div>
    </div>
  );
}

function PersonaPreview() {
  return (
    <div className="preview-stack">
      <div className="preview-top-pill">
        <span>mirra</span>
        <span className="selected">persona</span>
      </div>
      <h3>Voice memory</h3>
      <p className="persona-summary">{personaSnapshot.summary}</p>
      <div className="mini-metrics">
        <span>
          <strong>{personaSnapshot.analyzedPosts}</strong>
          posts
        </span>
        <span>
          <strong>{personaSnapshot.voiceMatch}%</strong>
          match
        </span>
      </div>
      {personaSnapshot.traits.slice(0, 3).map((trait) => (
        <div className="trait-preview" key={trait.label}>
          <div>
            <strong>{trait.label}</strong>
            <span>{trait.value}</span>
          </div>
          <i style={{ width: `${trait.strength}%` }} />
        </div>
      ))}
    </div>
  );
}

function DraftPreview() {
  const draft = postDrafts[0];
  const platform = platforms[draft.platform];

  return (
    <div className="preview-stack">
      <div className="draft-header-preview">
        <span style={{ backgroundColor: platform.color }}>{platform.shortLabel}</span>
        <div>
          <strong>{draft.label}</strong>
          <small>{draft.match}% voice match</small>
        </div>
      </div>
      <h3>{draft.title}</h3>
      <p className="draft-copy">{draft.body}</p>
      <div className="draft-actions-preview">
        <span>
          <PenLine aria-hidden size={14} /> Edit
        </span>
        <span>
          <Copy aria-hidden size={14} /> Copy
        </span>
        <span>
          <UserRound aria-hidden size={14} /> Persona
        </span>
      </div>
    </div>
  );
}
