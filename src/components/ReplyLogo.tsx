import replyLogoPng from "@/assets/reply-logo.png";

export function ReplyLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <img
      src={replyLogoPng}
      alt="Reply"
      className={className}
      style={{ width: 'auto', height: size, objectFit: 'contain' }}
    />
  );
}
