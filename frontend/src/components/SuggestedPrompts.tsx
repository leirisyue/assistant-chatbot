import React from 'react';

interface SuggestedPromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ prompts, onSelect }) => {
  const cleanPrompt = (prompt: string) => {
    return prompt.split(" ", 1)[1] || prompt;
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">💡 Gợi ý nhanh:</h4>
      <div className="grid grid-cols-2 gap-2">
        {prompts.slice(0, 4).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(cleanPrompt(prompt))}
            className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-purple-100 transition text-sm font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;