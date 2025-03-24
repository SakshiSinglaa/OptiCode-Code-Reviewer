import { useState, useEffect } from "react";
import "prismjs";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript"; 
import Editor from 'react-simple-code-editor';
import axios from 'axios';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const Home = () => {

  const [code, setCode] = useState(`function sum() {
  return 1+1;
}`);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch {
      setReview("Error fetching review. Please try again.");
    }
    setIsLoading(false);
  }

  
  return (
    <div className="w-full h-screen bg-neutral-700 font-medium overflow-auto">

      <div className="flex flex-row p-6 gap-4 h-full w-full">
        
        {/* Left Side: Code Editor */}
        <div className="basis-1/2 max-h-screen bg-neutral-900 text-white p-4 rounded-2xl relative flex flex-col">
          
          {/* Code Editor Container */}
          <div className="flex-1 overflow-auto custom-scrollbar p-2">
            <Editor
              className="w-full text-md whitespace-pre"
              value={code}
              onValueChange={setCode}
              highlight={code => Prism.highlight(code, Prism.languages.javascript, "javascript")}
            />
          </div>

          {/* Review Button (Sticky) */}
          <button 
            onClick={reviewCode}
            className="bg-red-600 hover:bg-red-800 w-full text-white py-2 px-6 font-medium rounded-xl cursor-pointer select-none mt-2 self-end sticky bottom-4 right-4">
              Review
          </button>
        </div>

        {/* Right Side: Review Section */}
        <div className="basis-1/2 h-full bg-neutral-900 text-sm text-white p-4 rounded-2xl overflow-auto custom-scrollbar">
          {isLoading ? ( 
            <div className="flex flex-col justify-center items-center h-full">
              <span className="animate-spin h-6 w-6 border-4 border-t-transparent border-white rounded-full"></span>
              <p className="mt-2 animate-pulse">Loading...</p>
            </div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
