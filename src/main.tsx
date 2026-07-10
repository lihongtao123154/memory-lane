import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

console.log(
  '%c\n' +
  '  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~\n' +
  '  ~   Memory Lane · 人生长廊          ~\n' +
  '  ~  每一段记忆，都是海的回声         ~\n' +
  '  ~  深 海                             ~\n' +
  '  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~\n',
  'color: #D97706; font-family: monospace; font-size: 12px;'
)

const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY
if (!deepseekKey || deepseekKey === 'your_deepseek_key') {
  console.log('%c[提示] DeepSeek 密钥未配置，AI 功能使用预设对话', 'color: #78716C')
} else {
  console.log('%c[OK] DeepSeek API 已就绪', 'color: #34D399')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
