import type { SocialLinks as SocialLinksData } from '@/lib/socialLinks';

type SocialLinksVariant = 'footer' | 'light';

interface SocialLinksProps {
  links: SocialLinksData;
  variant?: SocialLinksVariant;
  className?: string;
  tabIndex?: number;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const linkClassNames: Record<SocialLinksVariant, string> = {
  footer:
    'w-10 h-10 rounded-full border border-[#BFB6AD] flex items-center justify-center text-[#BFB6AD] hover:bg-[#BFB6AD] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50',
  light:
    'w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:bg-[#BFB6AD] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50',
};

export default function SocialLinks({
  links,
  variant = 'footer',
  className = '',
  tabIndex = 2,
  containerRef,
}: SocialLinksProps) {
  const linkClassName = linkClassNames[variant];

  return (
    <div
      ref={containerRef}
      className={className}
      role="group"
      aria-label="Social media links"
    >
      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        tabIndex={tabIndex}
        aria-label="Visit our Facebook page"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="1 0 16 16" aria-hidden="true">
          <path d="M7.2 16v-7.5h-2v-2.7h2c0 0 0-1.1 0-2.3 0-1.8 1.2-3.5 3.9-3.5 1.1 0 1.9 0.1 1.9 0.1l-0.1 2.5c0 0-0.8 0-1.7 0-1 0-1.1 0.4-1.1 1.2 0 0.6 0-1.3 0 2h2.9l-0.1 2.7h-2.8v7.5h-2.9z" />
        </svg>
      </a>
      <a
        href={links.linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        tabIndex={tabIndex}
        aria-label="Visit our LinkedIn page"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="-2 -1 24 24" aria-hidden="true">
          <path d="M19.959 11.719v7.379h-4.278v-6.885c0-1.73-.619-2.91-2.167-2.91-1.182 0-1.886.796-2.195 1.565-.113.275-.142.658-.142 1.043v7.187h-4.28s.058-11.66 0-12.869h4.28v1.824l-.028.042h.028v-.042c.568-.875 1.583-2.126 3.856-2.126 2.815 0 4.926 1.84 4.926 5.792zM2.421.026C.958.026 0 .986 0 2.249c0 1.235.93 2.224 2.365 2.224h.028c1.493 0 2.42-.989 2.42-2.224C4.787.986 3.887.026 2.422.026zM.254 19.098h4.278V6.229H.254v12.869z" />
        </svg>
      </a>
      <a
        href={links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        tabIndex={tabIndex}
        aria-label="Visit our Instagram page"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </a>
      <a
        href={links.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        tabIndex={tabIndex}
        aria-label="Visit our YouTube channel"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23,9.71a8.5,8.5,0,0,0-.91-4.13,2.92,2.92,0,0,0-1.72-1A78.36,78.36,0,0,0,12,4.27a78.45,78.45,0,0,0-8.34.3,2.87,2.87,0,0,0-1.46.74c-.9.83-1,2.25-1.1,3.45a48.29,48.29,0,0,0,0,6.48,9.55,9.55,0,0,0,.3,2,3.14,3.14,0,0,0,.71,1.36,2.86,2.86,0,0,0,1.49.78,45.18,45.18,0,0,0,6.5.33c3.5.05,6.57,0,10.2-.28a2.88,2.88,0,0,0,1.53-.78,2.49,2.49,0,0,0,.61-1,10.58,10.58,0,0,0,.52-3.4C23,13.69,23,10.31,23,9.71ZM9.74,14.85V8.66l5.92,3.11C14,12.69,11.81,13.73,9.74,14.85Z" />
        </svg>
      </a>
    </div>
  );
}
