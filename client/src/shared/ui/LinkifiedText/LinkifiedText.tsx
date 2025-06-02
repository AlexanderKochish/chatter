import s from "./LinkifieldText.module.css";

type Props = {
  text: string;
  className?: string;
};

const urlRegex = /\b((https?:\/\/|www\.|mailto:|tel:)[^\s<>"']+)/gi;

export const LinkifiedText = ({ text, className }: Props) => {
  const matches = text.match(urlRegex) || [];

  const parts = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    const matchIndex = text.indexOf(match, lastIndex);
    const textBeforeLink = text.slice(lastIndex, matchIndex);

    if (textBeforeLink) {
      parts.push(textBeforeLink);
    }

    parts.push(
      <a
        key={`${i}#${match}`}
        href={match.startsWith("http") ? match : `https://${match}`}
        target="_blank"
        rel="noopener noreferrer"
        className={s.link}
      >
        {match}
      </a>,
    );

    lastIndex = matchIndex + match.length;
  });

  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    parts.push(remainingText);
  }

  return <span className={className}>{parts}</span>;
};
