import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('KawanKampus render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback" role="alert">
          <div>
            <h1>Ada yang tidak berjalan semestinya</h1>
            <p>Halaman ini gagal dimuat. Muat ulang untuk mencoba lagi; data akunmu tidak berubah.</p>
            <div className="status-actions">
              <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
                Muat ulang halaman
              </button>
              <a className="btn btn-outline" href="/">Kembali ke halaman utama</a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
