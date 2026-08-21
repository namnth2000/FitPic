(function () {
  const { platforms, backgrounds, getPlatform, getCanvasSize, getContainRect, getCoverRect } = window.FitPicCore;
  const previewCanvas = document.querySelector('#preview-canvas');
  const uploadInput = document.querySelector('#image-upload');
  const uploadLabel = document.querySelector('#upload-label');
  const errorMessage = document.querySelector('#error-message');
  const statusMessage = document.querySelector('#status-message');
  const fileName = document.querySelector('#file-name');
  const selectedRatio = document.querySelector('#selected-ratio');
  const downloadButton = document.querySelector('#download-button');
  const editor = document.querySelector('#editor');
  const platformButtons = document.querySelector('#platform-options');
  const backgroundButtons = document.querySelector('#background-options');
  const previewFrame = document.querySelector('.preview-frame');
  const themeToggle = document.querySelector('#theme-toggle');

  const state = {
    image: null,
    objectUrl: null,
    platformId: 'instagram-feed',
    backgroundId: 'blur',
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

  function buttonMarkup(items, groupName) {
    return items.map((item) => (
      `<button type="button" class="choice-button" data-${groupName}="${item.id}" aria-pressed="false">${item.name}</button>`
    )).join('');
  }

  function renderChoices() {
    platformButtons.innerHTML = buttonMarkup(platforms, 'platform');
    backgroundButtons.innerHTML = buttonMarkup(backgrounds, 'background');
    updateChoiceButtons();
  }

  function updateChoiceButtons() {
    document.querySelectorAll('[data-platform]').forEach((button) => {
      const active = button.dataset.platform === state.platformId;
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-background]').forEach((button) => {
      const active = button.dataset.background === state.backgroundId;
      button.setAttribute('aria-pressed', String(active));
    });
    const [ratioWidth, ratioHeight] = getPlatform(state.platformId).ratio;
    selectedRatio.textContent = `${ratioWidth}:${ratioHeight}`;
  }

  function drawComposition(canvas, longEdge) {
    if (!state.image) return;
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
    } else {
      const background = getCoverRect(state.image.naturalWidth, state.image.naturalHeight, width, height);
      context.fillStyle = '#111827';
      context.fillRect(0, 0, width, height);
      context.save();
      context.filter = `blur(${Math.max(12, Math.round(longEdge * 0.028))}px)`;
      context.drawImage(state.image, background.x - 40, background.y - 40, background.width + 80, background.height + 80);
      context.restore();
      context.fillStyle = 'rgba(15, 23, 42, 0.12)';
      context.fillRect(0, 0, width, height);
    }

    const foreground = getContainRect(state.image.naturalWidth, state.image.naturalHeight, width, height);
    context.drawImage(state.image, foreground.x, foreground.y, foreground.width, foreground.height);
  }

  function renderPreview() {
    if (!state.image) return;
    drawComposition(previewCanvas, previewLongEdge);
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
      return { image, url };
    } catch (error) {
      URL.revokeObjectURL(url);
      throw error;
    }
  }

  async function onUpload(event) {
    const [file] = event.target.files;
    if (!file) return;
    setError('');
    if (!supportedImageTypes.has(file.type)) {
      event.target.value = '';
      setError('Hãy chọn một file ảnh hợp lệ (JPG, PNG, WebP hoặc GIF).');
      return;
    }
    setStatus('Đang đọc ảnh trên thiết bị của bạn...');
    uploadLabel.classList.add('is-loading');
    try {
      const { image, url } = await decodeImage(file);
      if (!image.naturalWidth || !image.naturalHeight) throw new Error('Empty image');
      if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
      state.image = image;
      state.objectUrl = url;
      fileName.textContent = `${file.name} - ${image.naturalWidth} × ${image.naturalHeight}px`;
      editor.hidden = false;
      downloadButton.disabled = false;
      renderPreview();
      setStatus('Ảnh đã sẵn sàng. Chọn nơi bạn muốn đăng để xem kết quả.');
    } catch (error) {
      event.target.value = '';
      setError('Không thể đọc ảnh này. Hãy thử một file ảnh khác.');
      setStatus('');
    } finally {
      uploadLabel.classList.remove('is-loading');
    }
  }

  function changePlatform(event) {
    const button = event.target.closest('[data-platform]');
    if (!button || !state.image) return;
    state.platformId = button.dataset.platform;
    updateChoiceButtons();
    renderPreview();
    setStatus(`Đã chọn ${getPlatform(state.platformId).name}, tỉ lệ ${selectedRatio.textContent}.`);
  }

  function changeBackground(event) {
    const button = event.target.closest('[data-background]');
    if (!button || !state.image) return;
    state.backgroundId = button.dataset.background;
    updateChoiceButtons();
    renderPreview();
    setStatus(`Đã đổi nền thành ${button.textContent}.`);
  }

  function downloadImage() {
    if (!state.image) return;
    downloadButton.disabled = true;
    setStatus('Đang tạo file để tải xuống...');
    window.requestAnimationFrame(() => {
      const exportCanvas = document.createElement('canvas');
      drawComposition(exportCanvas, exportLongEdge);
      exportCanvas.toBlob((blob) => {
        if (!blob) {
          downloadButton.disabled = false;
          setError('Không thể tạo file tải xuống. Hãy thử lại.');
          return;
        }
        const link = document.createElement('a');
        const downloadUrl = URL.createObjectURL(blob);
        link.href = downloadUrl;
        link.download = `fitpic-${state.platformId}-${selectedRatio.textContent.replace(':', 'x')}.jpg`;
        document.body.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        downloadButton.disabled = false;
        setStatus('Ảnh đã được tạo để tải xuống.');
      }, 'image/jpeg', 0.94);
    });
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
  downloadButton.addEventListener('click', downloadImage);
  themeToggle.addEventListener('click', toggleTheme);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!document.documentElement.dataset.theme) updateThemeToggle();
  });
  window.addEventListener('beforeunload', () => {
    if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  });

  initializeTheme();
  renderChoices();
})();
