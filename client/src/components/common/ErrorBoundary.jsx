import React from 'react';
import { RefreshCw, Skull } from 'lucide-react';
import RetroButton from './RetroButton';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('💥 [ErrorBoundary caught an error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dungeon-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-dungeon-900 border-4 border-rose-600 p-8 shadow-pixel-lg">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-rose-950 border-2 border-rose-600 text-rose-500 animate-bounce">
                <Skull className="w-10 h-10" />
              </div>
            </div>

            <h1 className="font-pixel text-rose-400 text-lg sm:text-xl mb-3 uppercase tracking-wider">
              Game Over
            </h1>

            <p className="font-retro text-xl text-slate-300 mb-6 leading-relaxed">
              A wild runtime bug ambushed the dungeon crawler! Your character survived, but the spell shattered.
            </p>

            <RetroButton
              variant="danger"
              size="lg"
              onClick={this.handleRetry}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              Continue (Respawn)
            </RetroButton>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs font-mono text-slate-500 cursor-pointer hover:text-slate-400">
                  Crash Log Inspect
                </summary>
                <pre className="mt-2 p-2 bg-black/70 border border-dungeon-800 text-[10px] text-rose-300 overflow-x-auto font-mono max-h-40">
                  {this.state.error.toString()}
                  {'\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
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
