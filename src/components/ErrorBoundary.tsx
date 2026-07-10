import { Component, ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('Error Boundary caught error:', error, errorInfo);
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-night p-4">
          <div className="glass-effect rounded-2xl p-8 max-w-lg w-full text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-400" size={32} />
            </div>
            <h2 className="font-serif text-2xl text-cream-100 mb-4">页面加载出错了</h2>
            <p className="text-cream-400 mb-4">
              {this.state.error?.message || '未知错误'}
            </p>
            <button
              onClick={this.handleRefresh}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-amber-500 text-night-900 rounded-full font-medium hover:bg-amber-400 transition-colors"
            >
              <RefreshCw size={18} />
              刷新页面
            </button>
            {this.state.errorInfo && (
              <details className="mt-6 text-left text-cream-500 text-sm">
                <summary>查看详细信息</summary>
                <p className="mt-2 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;