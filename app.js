(function () {
  const { platforms, backgrounds, getPlatform, getCanvasSize, getContainRect, getCoverRect } = window.FitPicCore;
  const previewCanvas = document.querySelector('#preview-canvas');
  const uploadInput = document.querySelector('#image-upload');
  const uploadLabel = document.querySelector('#upload-label');
  const errorMessage = document.querySelector('#error-message');
  const statusMessage = document.querySelector('#status-message');
  const fileName = document.querySelector('#file-name');
  const downloadButton = document.querySelector('#download-button');
  const editor = document.querySelector('#editor');
  const platformButtons = document.querySelector('#platform-options');
  const backgroundButtons = document.querySelector('#background-options');
  const customColorControls = document.querySelector('#custom-color-controls');
  const customColorPalette = document.querySelector('#custom-color-palette');
  const customColorInput = document.querySelector('#custom-color-input');
  const customColorHex = document.querySelector('#custom-color-hex');
  const previewFrame = document.querySelector('.preview-frame');
  const previewNote = document.querySelector('#preview-note');
  const themeToggle = document.querySelector('#theme-toggle');

  const defaultCustomColor = '#7C3AED';
  const paletteColors = [
    { name: 'Ivory', value: '#FFF8E7' },
    { name: 'Sand', value: '#EAD8C0' },
    { name: 'Peach', value: '#FFC7A8' },
    { name: 'Coral', value: '#FF7F6A' },
    { name: 'Rose', value: '#F9A8B8' },
    { name: 'Lavender', value: '#D8B4FE' },
    { name: 'Sky', value: '#BAE6FD' },
    { name: 'Mint', value: '#A7F3D0' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Amber', value: '#F59E0B' },
    { name: 'Lime', value: '#84CC16' },
    { name: 'Emerald', value: '#10B981' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Violet', value: '#7C3AED' },
    { name: 'Burgundy', value: '#9F1239' },
    { name: 'Magenta', value: '#C026D3' },
    { name: 'Purple', value: '#9333EA' },
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Navy', value: '#1E3A8A' },
    { name: 'Teal', value: '#0F766E' },
    { name: 'Olive', value: '#657A2E' },
    { name: 'Charcoal', value: '#1F2937' },
  ];

  const state = {
    images: [],
    platformId: 'instagram-feed',
    backgroundId: 'blur',
    customColor: defaultCustomColor,
  };

  const previewLongEdge = 960;
  const exportLongEdge = 2160;
  const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

  function prefersDarkTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function updateThemeToggle() {
    const isDark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === 'dark'
      : prefersDarkTheme();
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('fitpic-theme', theme);
    updateThemeToggle();
  }

  function initializeTheme() {
    const savedTheme = window.localStorage.getItem('fitpic-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      document.documentElement.dataset.theme = savedTheme;
    }
    updateThemeToggle();
  }

  function setStatus(message) {
    statusMessage.textContent = message;
  }

  function setError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = !message;
  }

  function activeImageEntry() {
    return state.images[0] || null;
  }

  function ratioLabel(platformId = state.platformId) {
    const [ratioWidth, ratioHeight] = getPlatform(platformId).ratio;
    return `${ratioWidth}:${ratioHeight}`;
  }

  function normalizeHex(value) {
    const compact = String(value || '').trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(compact)) {
      return `#${compact.split('').map((char) => char + char).join('').toUpperCase()}`;
    }
    if (/^[0-9a-fA-F]{6}$/.test(compact)) return `#${compact.toUpperCase()}`;
    return null;
  }

  function platformIconSvg(network) {
    const icons = {
      instagram: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle class="social-icon-dot" cx="17.2" cy="6.8" r="1"/></svg>',
      youtube: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 7.1c-.2-1-1-1.8-2-2C16.6 4.7 12 4.7 12 4.7s-4.6 0-6.2.4c-1 .2-1.8 1-2 2C3.4 8.7 3.4 12 3.4 12s0 3.3.4 4.9c.2 1 1 1.8 2 2 1.6.4 6.2.4 6.2.4s4.6 0 6.2-.4c1-.2 1.8-1 2-2 .4-1.6.4-4.9.4-4.9s0-3.3-.4-4.9Z"/><path class="social-icon-fill" d="m10.2 15.3 4.7-3.3-4.7-3.3v6.6Z"/></svg>',
      facebook: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 20v-7h2.4l.4-2.8h-2.8V8.4c0-.8.2-1.4 1.4-1.4h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8V13h2.5v7h3Z"/></svg>',
      tiktok: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 4c.4 2 1.6 3.2 3.8 3.5v3a8.4 8.4 0 0 1-3.8-1.1v5.4a5.2 5.2 0 1 1-4.5-5.1v3a2.2 2.2 0 1 0 1.5 2.1V4h3Z"/></svg>',
    };
    return icons[network] || icons.instagram;
  }

  function platformMarkup() {
    return platforms.map((item) => (
      `<button type="button" class="platform-choice" data-platform="${item.id}" aria-pressed="false" aria-label="${item.name}, tỉ lệ ${item.ratio[0]}:${item.ratio[1]}">
        <span class="platform-icon-wrap">${platformIconSvg(item.network)}</span>
        <span class="platform-ratio">${item.ratio[0]}:${item.ratio[1]}</span>
      </button>`
    )).join('');
  }

  function backgroundMarkup() {
    return backgrounds.map((item) => {
      const sampleClass = item.id === 'blur' ? 'background-sample--blur' : `background-sample--${item.id}`;
      const customStyle = item.id === 'custom' ? ` style="--custom-background:${state.customColor}"` : '';
      return `<button type="button" class="choice-button background-choice" data-background="${item.id}" aria-pressed="false"${customStyle}><span class="background-sample ${sampleClass}" aria-hidden="true"></span><span>${item.name}</span></button>`;
    }).join('');
  }

  function renderCustomPalette() {
    customColorPalette.innerHTML = paletteColors.map((color) => (
      `<button type="button" class="palette-swatch" data-custom-color="${color.value}" style="--picker-color:${color.value}" aria-label="Dùng màu ${color.name}, ${color.value}"></button>`
    )).join('');
  }

  function renderChoices() {
    platformButtons.innerHTML = platformMarkup();
    backgroundButtons.innerHTML = backgroundMarkup();
    renderCustomPalette();
    updateChoiceButtons();
    syncCustomColorControls();
  }

  function updateChoiceButtons() {
    document.querySelectorAll('[data-platform]').forEach((button) => {
      const active = button.dataset.platform === state.platformId;
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-background]').forEach((button) => {
      const active = button.dataset.background === state.backgroundId;
      button.setAttribute('aria-pressed', String(active));
      if (button.dataset.background === 'custom') button.style.setProperty('--custom-background', state.customColor);
    });
    document.querySelectorAll('[data-custom-color]').forEach((button) => {
      button.classList.toggle('is-selected', button.dataset.customColor.toUpperCase() === state.customColor.toUpperCase());
    });
  }

  function syncCustomColorControls() {
    customColorControls.hidden = state.backgroundId !== 'custom';
    customColorInput.value = state.customColor;
    customColorHex.value = state.customColor;
    customColorHex.classList.remove('is-invalid');
  }

  function updateDownloadUi() {
    const count = state.images.length;
    downloadButton.textContent = count > 1 ? `Tải ${count} ảnh JPG` : 'Tải ảnh JPG';
    previewNote.textContent = count > 1 ? `${count} ảnh · Không crop` : 'Không crop';
  }

  function drawComposition(canvas, longEdge, image) {
    if (!image) return;
    const { width, height } = getCanvasSize(state.platformId, longEdge);
    canvas.width = width;
    canvas.height = height;
    canvas.style.aspectRatio = `${width} / ${height}`;
    if (canvas === previewCanvas) {
      previewFrame.style.aspectRatio = `${width} / ${height}`;
    }
    const context = canvas.getContext('2d', { alpha: false });
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    if (state.backgroundId === 'white') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);
    } else if (state.backgroundId === 'black') {
      context.fillStyle = '#000000';
      context.fillRect(0, 0, width, height);
    } else if (state.backgroundId === 'custom') {
      context.fillStyle = state.customColor;
      context.fillRect(0, 0, width, height);
    } else {
      const background = getCoverRect(image.naturalWidth, image.naturalHeight, width, height);
      context.fillStyle = '#111827';
      context.fillRect(0, 0, width, height);
      context.save();
      context.filter = `blur(${Math.max(12, Math.round(longEdge * 0.028))}px)`;
      context.drawImage(image, background.x - 40, background.y - 40, background.width + 80, background.height + 80);
      context.restore();
      context.fillStyle = 'rgba(15, 23, 42, 0.12)';
      context.fillRect(0, 0, width, height);
    }

    const foreground = getContainRect(image.naturalWidth, image.naturalHeight, width, height);
    context.drawImage(image, foreground.x, foreground.y, foreground.width, foreground.height);
  }

  function renderPreview() {
    const entry = activeImageEntry();
    if (!entry) return;
    drawComposition(previewCanvas, previewLongEdge, entry.image);
  }

  async function decodeImage(file) {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.decoding = 'async';
    try {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = url;
      });
      return { file, image, objectUrl: url };
    } catch (error) {
      URL.revokeObjectURL(url);
      throw error;
    }
  }

  function releaseImages(images = state.images) {
    images.forEach((entry) => URL.revokeObjectURL(entry.objectUrl));
  }

  async function onUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setError('');
    const supportedFiles = files.filter((file) => supportedImageTypes.has(file.type));
    const unsupportedCount = files.length - supportedFiles.length;
    if (!supportedFiles.length) {
      event.target.value = '';
      setError('Hãy chọn file ảnh hợp lệ (JPG, PNG, WebP hoặc GIF).');
      return;
    }

    setStatus(`Đang đọc ${supportedFiles.length} ảnh trên thiết bị của bạn...`);
    uploadLabel.classList.add('is-loading');
    const decoded = [];
    let failedCount = unsupportedCount;

    try {
      for (const file of supportedFiles) {
        try {
          const entry = await decodeImage(file);
          if (!entry.image.naturalWidth || !entry.image.naturalHeight) throw new Error('Empty image');
          decoded.push(entry);
        } catch (error) {
          failedCount += 1;
        }
      }

      if (!decoded.length) {
        event.target.value = '';
        setError('Không thể đọc các ảnh đã chọn. Hãy thử file ảnh khác.');
        setStatus('');
        return;
      }

      releaseImages();
      state.images = decoded;
      const first = decoded[0];
      fileName.textContent = decoded.length === 1
        ? `${first.file.name} - ${first.image.naturalWidth} × ${first.image.naturalHeight}px`
        : `${decoded.length} ảnh đã chọn. Preview dùng ${first.file.name}; cùng tỉ lệ và nền sẽ áp dụng cho tất cả.`;
      editor.hidden = false;
      downloadButton.disabled = false;
      updateDownloadUi();
      renderPreview();

      if (failedCount) {
        setError(`${failedCount} file không hợp lệ hoặc không đọc được đã được bỏ qua.`);
      }
      setStatus(decoded.length > 1
        ? `${decoded.length} ảnh đã sẵn sàng. Chọn tỉ lệ và nền rồi tải tất cả ảnh.`
        : 'Ảnh đã sẵn sàng. Chọn tỉ lệ và nền để xem kết quả.');
    } finally {
      uploadLabel.classList.remove('is-loading');
    }
  }

  function changePlatform(event) {
    const button = event.target.closest('[data-platform]');
    if (!button || !activeImageEntry()) return;
    state.platformId = button.dataset.platform;
    updateChoiceButtons();
    renderPreview();
    setStatus(`Đã chọn ${getPlatform(state.platformId).name}, tỉ lệ ${ratioLabel()}.`);
  }

  function changeBackground(event) {
    const button = event.target.closest('[data-background]');
    if (!button || !activeImageEntry()) return;
    state.backgroundId = button.dataset.background;
    updateChoiceButtons();
    syncCustomColorControls();
    renderPreview();
    setStatus(state.backgroundId === 'custom' ? `Đang dùng nền ${state.customColor}.` : `Đã đổi nền thành ${button.textContent.trim()}.`);
  }

  function setCustomColor(value) {
    const normalized = normalizeHex(value);
    if (!normalized) return false;
    state.customColor = normalized;
    state.backgroundId = 'custom';
    updateChoiceButtons();
    syncCustomColorControls();
    renderPreview();
    setStatus(`Đang dùng nền ${normalized}.`);
    return true;
  }

  function changePaletteColor(event) {
    const button = event.target.closest('[data-custom-color]');
    if (!button) return;
    setCustomColor(button.dataset.customColor);
  }

  function changeNativeColor() {
    setCustomColor(customColorInput.value);
  }

  function changeHexColor() {
    const valid = setCustomColor(customColorHex.value);
    customColorHex.classList.toggle('is-invalid', !valid);
    if (!valid) customColorHex.value = state.customColor;
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.94));
  }

  function sourceBaseName(name) {
    const withoutExtension = name.replace(/\.[^.]+$/, '').trim();
    const safe = withoutExtension.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '').replace(/-+/g, '-');
    return safe || 'image';
  }

  async function exportEntry(entry, index) {
    const exportCanvas = document.createElement('canvas');
    drawComposition(exportCanvas, exportLongEdge, entry.image);
    const blob = await canvasToBlob(exportCanvas);
    if (!blob) throw new Error('Blob creation failed');

    const link = document.createElement('a');
    const downloadUrl = URL.createObjectURL(blob);
    const indexSuffix = state.images.length > 1 ? `-${index + 1}` : '';
    link.href = downloadUrl;
    link.download = `fitpic-${sourceBaseName(entry.file.name)}-${state.platformId}-${ratioLabel().replace(':', 'x')}${indexSuffix}.jpg`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }

  async function downloadImages() {
    if (!state.images.length) return;
    downloadButton.disabled = true;
    setError('');
    setStatus(state.images.length > 1 ? `Đang tạo ${state.images.length} file để tải xuống...` : 'Đang tạo file để tải xuống...');

    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    try {
      for (let index = 0; index < state.images.length; index += 1) {
        await exportEntry(state.images[index], index);
      }
      setStatus(state.images.length > 1
        ? `${state.images.length} ảnh đã được tạo. Trình duyệt có thể hỏi quyền tải nhiều file.`
        : 'Ảnh đã được tạo để tải xuống.');
    } catch (error) {
      setError('Không thể tạo đầy đủ file tải xuống. Hãy thử lại.');
      setStatus('');
    } finally {
      downloadButton.disabled = false;
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === 'dark'
      : prefersDarkTheme();
    setTheme(isDark ? 'light' : 'dark');
  }

  uploadInput.addEventListener('change', onUpload);
  platformButtons.addEventListener('click', changePlatform);
  backgroundButtons.addEventListener('click', changeBackground);
  customColorPalette.addEventListener('click', changePaletteColor);
  customColorInput.addEventListener('input', changeNativeColor);
  customColorHex.addEventListener('change', changeHexColor);
  customColorHex.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      changeHexColor();
    }
  });
  downloadButton.addEventListener('click', downloadImages);
  themeToggle.addEventListener('click', toggleTheme);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!document.documentElement.dataset.theme) updateThemeToggle();
  });
  window.addEventListener('beforeunload', () => releaseImages());

  initializeTheme();
  renderChoices();
  updateDownloadUi();
})();