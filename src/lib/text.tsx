import { Fragment } from "react";

/** Keep hyphenated words (Co-op, sage-green) whole when the line wraps. */
export function keepHyphens(text: string) {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
