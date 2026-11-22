// Web preview: pick a picture with the browser; it lives only for this page visit.
export type PhotoSource = 'camera' | 'library';
export type PhotoResult = { uri: string } | { error: 'denied' | 'cancelled' | 'failed' };

export function pickPhoto(_source: PhotoSource, _sessionId: string): Promise<PhotoResult> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const f = input.files?.[0];
      resolve(f ? { uri: URL.createObjectURL(f) } : { error: 'cancelled' });
    };
    input.click();
  });
}

export function forget(_uri: string | undefined): void {}
