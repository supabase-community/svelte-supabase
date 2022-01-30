import { browser } from '$app/env';

if (browser) {
	/**
	 * Apparently window.cookieStore is brand spanking new and so we
	 * can't use it.
	 *
	 * Therefore, rig up an event when document.cookie changes.
	 */
	const nativeCookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
	Object.defineProperty(Document.prototype, '_cookie', nativeCookieDesc);
	Object.defineProperty(Document.prototype, 'cookie', {
		enumerable: true,
		configurable: true,
		get() {
			return this._cookie;
		},
		set(value) {
			if (this._cookie !== value) {
				const detail = { oldValue: this._cookie, newValue: value };
				this._cookie = value;
				this.dispatchEvent(new CustomEvent('cookiechange', { detail }));
			}
		}
	});
}
