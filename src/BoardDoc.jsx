import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const components = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

// Loaded on demand: markdown parsing is only needed on the Documentation tab.
export default function BoardDoc({ source }) {
  return (
    <div className="doc">
      <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
