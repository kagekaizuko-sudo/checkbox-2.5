"use client"

import { useState } from "react"
import { CodeBlock } from "./code-block"

export default function EnhancedCodeDisplay() {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`)

  const handleCodeEdit = (newCode: string) => {
    setCode(newCode)
    console.log("Code updated:", newCode)
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Enhanced Code Block with CSS & Bash Support</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">CSS Code</h2>
          <CodeBlock className="language-css">
            {`.container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.button {
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}`}
          </CodeBlock>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">JavaScript Code (Editable)</h2>
          <CodeBlock className="language-javascript" onEdit={handleCodeEdit}>
            {code}
          </CodeBlock>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Bash Commands</h2>
          <CodeBlock className="language-bash">
            {`# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Deploy to production
npm run deploy`}
          </CodeBlock>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Terminal Output</h2>
          <CodeBlock isOutput={true}>
            {`$ npm run build
> next build

✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (5/5)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.02 kB        87.5 kB
├ ○ /about                               1.23 kB        83.7 kB
└ ○ /contact                             2.45 kB        85.0 kB

○  (Static)  automatically rendered as static HTML (uses no initial props)

Build completed successfully!`}
          </CodeBlock>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Python Code</h2>
          <CodeBlock className="language-python">
            {`def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3,6,8,10,1,2,1]))`}
          </CodeBlock>
        </div>
      </div>
    </div>
  )
}
