interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  /** Stable unique id for the script element. */
  id: string;
}

const serializeJsonLd = (data: JsonLdProps['data']) =>
  JSON.stringify(data).replace(/</g, '\\u003c');

/**
 * Renders a single JSON-LD `<script>` in the document.
 *
 * Intentionally a Server Component (no `useServerInsertedHTML`):
 * Next.js streaming can invoke those callbacks on every flush, which was
 * duplicating identical blocks ~10×. Google accepts JSON-LD in `<body>`;
 * App Router soft navigations replace the page segment (and this script) via RSC.
 */
export default function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={`json-ld-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
