(function () {
  const {
    platforms,
    backgrounds,
    getPlatform,
    getCanvasSize,
    getContainRect,
    getInsetRect,
    getCoverRect,
    getCropRect,
  } = window.FitPicCore;

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
  const imageBackgroundControls = document.querySelector('#image-background-controls');
  const imageBackgroundInput = document.querySelector('#image-background-input');
  const imageBackgroundAction = document.querySelector('#image-background-action');
  const imageBackgroundName = document.querySelector('#image-background-name');
  const clearImageBackgroundButton = document.querySelector('#clear-image-background');
  const layoutControls = document.querySelector('#layout-controls');
  const layoutModeNote = document.querySelector('#layout-mode-note');
  const balanceToggle = document.querySelector('#balance-toggle');
  const balanceDetails = document.querySelector('#balance-details');
  const balanceSlider = document.querySelector('#balance-slider');
  const balanceValue = document.querySelector('#balance-value');
  const radiusToggle = document.querySelector('#radius-toggle');
  const radiusDetails = document.querySelector('#radius-details');
  const radiusSlider = document.querySelector('#radius-slider');
  const radiusValue = document.querySelector('#radius-value');
  const cropControls = document.querySelector('#crop-controls');
  const resetCropButton = document.querySelector('#reset-crop');
  const previewFrame = document.querySelector('.preview-frame');
  const previewNote = document.querySelector('#preview-note');
  const previewNavigation = document.querySelector('#preview-navigation');
  const previousPreviewButton = document.querySelector('#preview-previous');
  const nextPreviewButton = document.querySelector('#preview-next');
  const previewCounter = document.querySelector('#preview-counter');
  const themeToggle = document.querySelector('#theme-toggle');

  const defaultCustomColor = '#FFF8E7';
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
    previewIndex: 0,
    platformId: 'instagram-feed',
    backgroundId: 'blur',
    customColor: defaultCustomColor,
    backgroundImage: null,
    balanceEnabled: false,
    balancePadding: 0.08,
    radiusEnabled: false,
    radiusPx: 12,
    pendingShareFiles: null,
    cropDrag: null,
  };

  const previewLongEdge = 960;
  const exportLongEdge = 2160;
  const radiusReferenceWidth = 360;
  const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

  function clampUnit(value) {
    return Math.min(1, Math.max(0, value));
  }

  function prefersDarkTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function isAppleMobileDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function prefersNativeImageShare() {
    return isAppleMobileDevice()
      && typeof navigator.share === 'function'
      && typeof navigator.canShare === 'function';
  }

  function canShareFiles(files) {
    if (!prefersNativeImageShare() || !files?.length) return false;
    try {
      return navigator.canShare({ files });
    } catch (error) {
      return false;
    }
  }

  function invalidatePendingShare() {
    state.pendingShareFiles = null;
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
    return state.images[state.previewIndex] || null;
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
    syncEditorControls();
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

  function syncImageBackgroundControls() {
    const isImageBased = state.backgroundId === 'image';
    imageBackgroundControls.hidden = !isImageBased;
    const background = state.backgroundImage;
    imageBackgroundAction.textContent = background ? 'Thay ảnh nền' : 'Chọn ảnh nền';
    imageBackgroundName.textContent = background
      ? background.file.name
      : 'Ảnh nền sẽ được căn giữa và cover toàn bộ khung.';
    clearImageBackgroundButton.hidden = !background;
  }

  function syncLayoutControls() {
    const available = state.backgroundId !== 'crop' && Boolean(activeImageEntry());
    layoutControls.classList.toggle('is-disabled', !available);
    layoutModeNote.hidden = state.backgroundId !== 'crop';

    balanceToggle.checked = state.balanceEnabled;
    balanceToggle.disabled = !available;
    balanceDetails.hidden = !state.balanceEnabled;
    balanceSlider.disabled = !available || !state.balanceEnabled;
    balanceSlider.value = String(Math.round(state.balancePadding * 100));
    balanceValue.textContent = `${Math.round(state.balancePadding * 100)}%`;

    radiusToggle.checked = state.radiusEnabled;
    radiusToggle.disabled = !available || !state.balanceEnabled;
    radiusDetails.hidden = !state.balanceEnabled || !state.radiusEnabled;
    radiusSlider.disabled = !available || !state.balanceEnabled || !state.radiusEnabled;
    radiusSlider.value = String(state.radiusPx);
    radiusValue.textContent = `${state.radiusPx}px`;
  }

  function syncEditorControls() {
    customColorControls.hidden = state.backgroundId !== 'custom';
    customColorInput.value = state.customColor;
    customColorHex.value = state.customColor;
    customColorHex.classList.remove('is-invalid');
    syncImageBackgroundControls();
    syncLayoutControls();

    const isCrop = state.backgroundId === 'crop' && Boolean(activeImageEntry());
    cropControls.hidden = !isCrop;
    previewFrame.classList.toggle('is-crop-mode', isCrop);
    previewCanvas.setAttribute('aria-label', isCrop
      ? 'Bản xem trước ảnh crop. Kéo ảnh để thay đổi vùng giữ lại.'
      : 'Bản xem trước ảnh đã định dạng');

    const entry = activeImageEntry();
    resetCropButton.disabled = !entry || (entry.cropX === 0.5 && entry.cropY === 0.5);
  }

  function isExportReady() {
    if (!state.images.length) return false;
    if (state.backgroundId === 'image' && !state.backgroundImage) return false;
    return true;
  }

  function updateDownloadUi() {
    const count = state.images.length;
    const useNativeShare = prefersNativeImageShare();
    if (useNativeShare) {
      downloadButton.textContent = count > 1 ? `Lưu ${count} ảnh` : 'Lưu ảnh';
    } else {
      downloadButton.textContent = count > 1 ? `Tải ${count} ảnh JPG` : 'Tải ảnh JPG';
    }
    downloadButton.disabled = !isExportReady();
  }

  function updatePreviewUi() {
    const count = state.images.length;
    const hasBatch = count > 1;
    previewNavigation.hidden = !hasBatch;
    previewCounter.textContent = count ? `${state.previewIndex + 1} / ${count}` : '0 / 0';
    previousPreviewButton.disabled = state.previewIndex <= 0;
    nextPreviewButton.disabled = state.previewIndex >= count - 1;

    if (state.backgroundId === 'crop') {
      previewNote.textContent = 'Crop';
    } else if (state.backgroundId === 'image') {
      previewNote.textContent = 'Image-based';
    } else {
      previewNote.textContent = 'Không crop';
    }
    syncEditorControls();
  }

  function drawImageBasedBackground(context, width, height) {
    const background = state.backgroundImage?.image;
    if (!background) {
      context.fillStyle = '#dfe6e2';
      context.fillRect(0, 0, width, height);
      return;
    }
    const cover = getCoverRect(background.naturalWidth, background.naturalHeight, width, height);
    context.drawImage(background, cover.x, cover.y, cover.width, cover.height);
  }

  function roundedRectPath(context, x, y, width, height, radius) {
    const safeRadius = Math.min(Math.max(0, radius), width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.lineTo(x + width - safeRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    context.lineTo(x + width, y + height - safeRadius);
    context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    context.lineTo(x + safeRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    context.lineTo(x, y + safeRadius);
    context.quadraticCurveTo(x, y, x + safeRadius, y);
    context.closePath();
  }

  function drawForeground(context, image, width, height) {
    const frame = state.balanceEnabled
      ? getInsetRect(width, height, state.balancePadding)
      : { x: 0, y: 0, width, height };
    const contained = getContainRect(image.naturalWidth, image.naturalHeight, frame.width, frame.height);
    const foreground = {
      x: frame.x + contained.x,
      y: frame.y + contained.y,
      width: contained.width,
      height: contained.height,
    };

    if (state.balanceEnabled && state.radiusEnabled && state.radiusPx > 0) {
      const radius = state.radiusPx * (width / radiusReferenceWidth);
      context.save();
      roundedRectPath(context, foreground.x, foreground.y, foreground.width, foreground.height, radius);
      context.clip();
      context.drawImage(image, foreground.x, foreground.y, foreground.width, foreground.height);
      context.restore();
      return;
    }

    context.drawImage(image, foreground.x, foreground.y, foreground.width, foreground.height);
  }

  function drawComposition(canvas, longEdge, entry) {
    if (!entry?.image) return;
    const image = entry.image;
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

    if (state.backgroundId === 'crop') {
      context.fillStyle = '#000000';
      context.fillRect(0, 0, width, height);
      const crop = getCropRect(
        image.naturalWidth,
        image.naturalHeight,
        width,
        height,
        entry.cropX,
        entry.cropY,
      );
      context.drawImage(image, crop.x, crop.y, crop.width, crop.height);
      return;
    }

    if (state.backgroundId === 'white') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);
    } else if (state.backgroundId === 'black') {
      context.fillStyle = '#000000';
      context.fillRect(0, 0, width, height);
    } else if (state.backgroundId === 'custom') {
      context.fillStyle = state.customColor;
      context.fillRect(0, 0, width, height);
    } else if (state.backgroundId === 'image') {
      drawImageBasedBackground(context, width, height);
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

    drawForeground(context, image, width, height);
  }

  function renderPreview() {
    const entry = activeImageEntry();
    if (!entry) return;
    drawComposition(previewCanvas, previewLongEdge, entry);
    updatePreviewUi();
  }

  async function loadImageFile(file, includeCropState = false) {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.decoding = 'async';
    try {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = url;
      });
      const entry = { file, image, objectUrl: url };
      if (includeCropState) {
        entry.cropX = 0.5;
        entry.cropY = 0.5;
      }
      return entry;
    } catch (error) {
      URL.revokeObjectURL(url);
      throw error;
    }
  }

  function releaseImageEntry(entry) {
    if (entry?.objectUrl) URL.revokeObjectURL(entry.objectUrl);
  }

  function releaseImages(images = state.images) {
    images.forEach(releaseImageEntry);
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
          const entry = await loadImageFile(file, true);
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
      invalidatePendingShare();
      state.images = decoded;
      state.previewIndex = 0;
      const first = decoded[0];
      fileName.textContent = decoded.length === 1
        ? `${first.file.name} - ${first.image.naturalWidth} × ${first.image.naturalHeight}px`
        : `${decoded.length} ảnh đã chọn. Dùng mũi tên ở preview để xem từng ảnh; tỉ lệ và chế độ nền áp dụng cho cả batch.`;
      editor.hidden = false;
      updateDownloadUi();
      renderPreview();

      if (failedCount) {
        setError(`${failedCount} file không hợp lệ hoặc không đọc được đã được bỏ qua.`);
      }
      setStatus(decoded.length > 1
        ? `${decoded.length} ảnh đã sẵn sàng. Bạn có thể xem từng ảnh trước khi lưu.`
        : 'Ảnh đã sẵn sàng. Chọn tỉ lệ và nền để xem kết quả.');
    } finally {
      uploadLabel.classList.remove('is-loading');
    }
  }

  async function onImageBackgroundUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');

    if (!supportedImageTypes.has(file.type)) {
      event.target.value = '';
      setError('Hãy chọn ảnh nền hợp lệ (JPG, PNG, WebP hoặc GIF).');
      return;
    }

    setStatus('Đang đọc ảnh nền trên thiết bị của bạn...');
    try {
      const nextBackground = await loadImageFile(file, false);
      if (!nextBackground.image.naturalWidth || !nextBackground.image.naturalHeight) {
        releaseImageEntry(nextBackground);
        throw new Error('Empty image');
      }

      releaseImageEntry(state.backgroundImage);
      state.backgroundImage = nextBackground;
      state.backgroundId = 'image';
      invalidatePendingShare();
      updateChoiceButtons();
      updateDownloadUi();
      renderPreview();
      setStatus(`Đang dùng ${file.name} làm ảnh nền cho toàn bộ batch.`);
    } catch (error) {
      event.target.value = '';
      setError('Không thể đọc ảnh nền. Hãy thử file ảnh khác.');
      setStatus('');
    }
  }

  function clearImageBackground() {
    releaseImageEntry(state.backgroundImage);
    state.backgroundImage = null;
    imageBackgroundInput.value = '';
    invalidatePendingShare();
    updateDownloadUi();
    renderPreview();
    setStatus('Đã xóa ảnh nền. Chọn ảnh nền mới để tiếp tục với Image-based.');
  }

  function changePlatform(event) {
    const button = event.target.closest('[data-platform]');
    if (!button || !activeImageEntry()) return;
    state.platformId = button.dataset.platform;
    invalidatePendingShare();
    updateChoiceButtons();
    renderPreview();
    setStatus(`Đã chọn ${getPlatform(state.platformId).name}, tỉ lệ ${ratioLabel()}.`);
  }

  function changeBackground(event) {
    const button = event.target.closest('[data-background]');
    if (!button || !activeImageEntry()) return;
    state.backgroundId = button.dataset.background;
    invalidatePendingShare();
    updateChoiceButtons();
    updateDownloadUi();
    renderPreview();

    if (state.backgroundId === 'crop') {
      setStatus('Crop phủ kín khung. Balance và Radius tạm không áp dụng.');
    } else if (state.backgroundId === 'custom') {
      setStatus(`Đang dùng nền ${state.customColor}.`);
    } else if (state.backgroundId === 'image') {
      setStatus(state.backgroundImage
        ? `Đang dùng ${state.backgroundImage.file.name} làm ảnh nền cho toàn bộ batch.`
        : 'Chọn một ảnh nền để dùng chế độ Image-based.');
    } else {
      setStatus(`Đã đổi nền thành ${button.textContent.trim()}.`);
    }
  }

  function setCustomColor(value) {
    const normalized = normalizeHex(value);
    if (!normalized) return false;
    state.customColor = normalized;
    state.backgroundId = 'custom';
    invalidatePendingShare();
    updateChoiceButtons();
    updateDownloadUi();
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

  function toggleBalance() {
    if (state.backgroundId === 'crop') return;
    state.balanceEnabled = balanceToggle.checked;
    if (!state.balanceEnabled) state.radiusEnabled = false;
    invalidatePendingShare();
    renderPreview();
    setStatus(state.balanceEnabled
      ? `Balance đang bật với lề ${Math.round(state.balancePadding * 100)}%.`
      : 'Balance đã tắt.');
  }

  function changeBalancePadding() {
    state.balancePadding = Number(balanceSlider.value) / 100;
    invalidatePendingShare();
    renderPreview();
    setStatus(`Lề Balance: ${balanceSlider.value}%.`);
  }

  function toggleRadius() {
    if (state.backgroundId === 'crop' || !state.balanceEnabled) return;
    state.radiusEnabled = radiusToggle.checked;
    invalidatePendingShare();
    renderPreview();
    setStatus(state.radiusEnabled
      ? `Radius đang bật ở ${state.radiusPx}px.`
      : 'Radius đã tắt.');
  }

  function changeRadius() {
    state.radiusPx = Number(radiusSlider.value);
    invalidatePendingShare();
    renderPreview();
    setStatus(`Radius: ${state.radiusPx}px.`);
  }

  function goToPreview(index) {
    if (!state.images.length) return;
    const nextIndex = Math.min(state.images.length - 1, Math.max(0, index));
    if (nextIndex === state.previewIndex) return;
    endCropDrag();
    state.previewIndex = nextIndex;
    renderPreview();
  }

  function previousPreview() {
    goToPreview(state.previewIndex - 1);
  }

  function nextPreview() {
    goToPreview(state.previewIndex + 1);
  }

  function resetCrop() {
    const entry = activeImageEntry();
    if (!entry) return;
    entry.cropX = 0.5;
    entry.cropY = 0.5;
    invalidatePendingShare();
    renderPreview();
    setStatus(`Đã đặt lại crop cho ảnh ${state.previewIndex + 1}.`);
  }

  function cropOverflow(entry) {
    const centered = getCropRect(
      entry.image.naturalWidth,
      entry.image.naturalHeight,
      previewCanvas.width,
      previewCanvas.height,
      0.5,
      0.5,
    );
    return {
      x: Math.max(0, centered.width - previewCanvas.width),
      y: Math.max(0, centered.height - previewCanvas.height),
    };
  }

  function beginCropDrag(event) {
    if (state.backgroundId !== 'crop' || !activeImageEntry()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const entry = activeImageEntry();
    state.cropDrag = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startCropX: entry.cropX,
      startCropY: entry.cropY,
    };
    previewCanvas.setPointerCapture?.(event.pointerId);
    previewFrame.classList.add('is-dragging');
    event.preventDefault();
  }

  function moveCropDrag(event) {
    const drag = state.cropDrag;
    const entry = activeImageEntry();
    if (!drag || !entry || drag.pointerId !== event.pointerId || state.backgroundId !== 'crop') return;

    const bounds = previewCanvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const overflow = cropOverflow(entry);
    const deltaCanvasX = (event.clientX - drag.startClientX) * (previewCanvas.width / bounds.width);
    const deltaCanvasY = (event.clientY - drag.startClientY) * (previewCanvas.height / bounds.height);

    entry.cropX = overflow.x > 0
      ? clampUnit(drag.startCropX - (deltaCanvasX / overflow.x))
      : 0.5;
    entry.cropY = overflow.y > 0
      ? clampUnit(drag.startCropY - (deltaCanvasY / overflow.y))
      : 0.5;

    invalidatePendingShare();
    drawComposition(previewCanvas, previewLongEdge, entry);
    syncEditorControls();
    event.preventDefault();
  }

  function endCropDrag(event) {
    if (!state.cropDrag) return;
    if (event && state.cropDrag.pointerId !== event.pointerId) return;
    try {
      if (event) previewCanvas.releasePointerCapture?.(event.pointerId);
    } catch (error) {
      // Pointer capture may already have been released by the browser.
    }
    state.cropDrag = null;
    previewFrame.classList.remove('is-dragging');
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.94));
  }

  function sourceBaseName(name) {
    const withoutExtension = name.replace(/\.[^.]+$/, '').trim();
    const safe = withoutExtension.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '').replace(/-+/g, '-');
    return safe || 'image';
  }

  function exportFileName(entry, index) {
    const indexSuffix = state.images.length > 1 ? `-${index + 1}` : '';
    return `fitpic-${sourceBaseName(entry.file.name)}-${state.platformId}-${ratioLabel().replace(':', 'x')}${indexSuffix}.jpg`;
  }

  async function buildExportFile(entry, index) {
    const exportCanvas = document.createElement('canvas');
    drawComposition(exportCanvas, exportLongEdge, entry);
    const blob = await canvasToBlob(exportCanvas);
    if (!blob) throw new Error('Blob creation failed');
    return new File([blob], exportFileName(entry, index), {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  }

  async function buildExportFiles() {
    const files = [];
    for (let index = 0; index < state.images.length; index += 1) {
      files.push(await buildExportFile(state.images[index], index));
    }
    return files;
  }

  function downloadFile(file) {
    const link = document.createElement('a');
    const downloadUrl = URL.createObjectURL(file);
    link.href = downloadUrl;
    link.download = file.name;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }

  function downloadFiles(files) {
    files.forEach(downloadFile);
  }

  async function shareExportFiles(files) {
    await navigator.share({ files });
  }

  function handleShareFailure(error, files) {
    if (error?.name === 'AbortError') {
      state.pendingShareFiles = files;
      setStatus('Đã hủy lưu/chia sẻ. Nhấn lại nếu bạn muốn mở menu lưu ảnh.');
      return true;
    }

    if (error?.name === 'NotAllowedError') {
      state.pendingShareFiles = files;
      setStatus(`Ảnh đã sẵn sàng. Nhấn lại "${downloadButton.textContent}" để mở menu lưu ảnh.`);
      return true;
    }

    return false;
  }

  async function downloadImages() {
    if (!state.images.length) return;
    if (!isExportReady()) {
      setError('Hãy chọn ảnh nền trước khi lưu với chế độ Image-based.');
      setStatus('');
      return;
    }

    if (state.pendingShareFiles && canShareFiles(state.pendingShareFiles)) {
      const cachedFiles = state.pendingShareFiles;
      state.pendingShareFiles = null;
      try {
        await shareExportFiles(cachedFiles);
        setStatus(cachedFiles.length > 1
          ? `Đã mở menu lưu/chia sẻ cho ${cachedFiles.length} ảnh.`
          : 'Đã mở menu lưu/chia sẻ ảnh.');
      } catch (error) {
        if (!handleShareFailure(error, cachedFiles)) {
          downloadFiles(cachedFiles);
          setStatus(cachedFiles.length > 1
            ? 'Không thể mở menu chia sẻ. FitPic đã dùng cách tải file dự phòng.'
            : 'Không thể mở menu chia sẻ. FitPic đã tải file dự phòng.');
        }
      }
      return;
    }

    downloadButton.disabled = true;
    setError('');
    const wantsNativeShare = prefersNativeImageShare();
    setStatus(state.images.length > 1
      ? `Đang chuẩn bị ${state.images.length} ảnh...`
      : 'Đang chuẩn bị ảnh...');

    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    try {
      const files = await buildExportFiles();

      if (wantsNativeShare && canShareFiles(files)) {
        state.pendingShareFiles = files;
        try {
          await shareExportFiles(files);
          state.pendingShareFiles = null;
          setStatus(files.length > 1
            ? `Đã mở menu lưu/chia sẻ cho ${files.length} ảnh.`
            : 'Đã mở menu lưu/chia sẻ ảnh.');
        } catch (error) {
          if (!handleShareFailure(error, files)) {
            state.pendingShareFiles = null;
            downloadFiles(files);
            setStatus(files.length > 1
              ? 'Không thể mở menu chia sẻ. FitPic đã dùng cách tải file dự phòng.'
              : 'Không thể mở menu chia sẻ. FitPic đã tải file dự phòng.');
          }
        }
      } else {
        downloadFiles(files);
        setStatus(files.length > 1
          ? `${files.length} ảnh đã được tạo. Trình duyệt có thể hỏi quyền tải nhiều file.`
          : 'Ảnh đã được tạo để tải xuống.');
      }
    } catch (error) {
      invalidatePendingShare();
      setError('Không thể tạo đầy đủ file ảnh. Hãy thử lại.');
      setStatus('');
    } finally {
      updateDownloadUi();
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === 'dark'
      : prefersDarkTheme();
    setTheme(isDark ? 'light' : 'dark');
  }

  function handleKeyboardNavigation(event) {
    if (state.images.length <= 1) return;
    if (event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
    if (event.key === 'ArrowLeft') {
      previousPreview();
    } else if (event.key === 'ArrowRight') {
      nextPreview();
    }
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
  imageBackgroundInput.addEventListener('change', onImageBackgroundUpload);
  clearImageBackgroundButton.addEventListener('click', clearImageBackground);
  balanceToggle.addEventListener('change', toggleBalance);
  balanceSlider.addEventListener('input', changeBalancePadding);
  radiusToggle.addEventListener('change', toggleRadius);
  radiusSlider.addEventListener('input', changeRadius);
  previousPreviewButton.addEventListener('click', previousPreview);
  nextPreviewButton.addEventListener('click', nextPreview);
  resetCropButton.addEventListener('click', resetCrop);
  previewCanvas.addEventListener('pointerdown', beginCropDrag);
  previewCanvas.addEventListener('pointermove', moveCropDrag);
  previewCanvas.addEventListener('pointerup', endCropDrag);
  previewCanvas.addEventListener('pointercancel', endCropDrag);
  previewCanvas.addEventListener('lostpointercapture', endCropDrag);
  downloadButton.addEventListener('click', downloadImages);
  themeToggle.addEventListener('click', toggleTheme);
  document.addEventListener('keydown', handleKeyboardNavigation);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!document.documentElement.dataset.theme) updateThemeToggle();
  });
  window.addEventListener('beforeunload', () => {
    invalidatePendingShare();
    releaseImages();
    releaseImageEntry(state.backgroundImage);
  });

  initializeTheme();
  renderChoices();
  updateDownloadUi();
  updatePreviewUi();
})();
