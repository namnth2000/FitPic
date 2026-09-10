(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.FitPicI18n = api;
  if (typeof document !== 'undefined') {
    api.initializeBrowser();
  }
})(globalThis, function () {
  const storageKey = 'fitpic-language';
  const supportedLanguages = ['vi', 'en'];
  const listeners = new Set();

  const translations = {
    vi: {
      'common.language': 'Ngôn ngữ',
      'common.homeAria': 'FitPic trang chủ',
      'common.themeToLight': 'Chuyển sang giao diện sáng',
      'common.themeToDark': 'Chuyển sang giao diện tối',
      'common.privacy': 'Quyền riêng tư',
      'common.backToFitPic': 'Về FitPic',

      'home.meta.title': 'FitPic - Chỉnh kích thước ảnh mạng xã hội',
      'home.meta.description': 'Chuẩn bị một hoặc nhiều ảnh đúng tỉ lệ cho Instagram, TikTok, Facebook và YouTube, giữ trọn nội dung, dùng ảnh nền riêng, thêm lề cân đối hoặc crop đúng vùng bạn muốn.',
      'home.meta.locale': 'vi_VN',
      'home.meta.ogTitle': 'FitPic - Chỉnh kích thước ảnh mạng xã hội',
      'home.meta.ogDescription': 'Đưa một hoặc nhiều ảnh về đúng tỉ lệ cho mạng xã hội, dùng nền blur, màu, ảnh riêng, Balance hoặc crop đúng vùng bạn muốn.',
      'home.intro': 'Chọn một hoặc nhiều ảnh, tỉ lệ, nền hoặc crop ảnh',
      'home.workspaceAria': 'Tạo ảnh social media',
      'home.uploadPanelAria': 'Chọn ảnh',
      'home.uploadTitle': 'Tải ảnh từ thiết bị',
      'home.uploadCopy': 'JPG, PNG, WebP hoặc GIF · có thể chọn nhiều ảnh',
      'home.uploadAction': 'Chọn ảnh',
      'home.uploadPrivacy': 'Ảnh được xử lý ngay trên thiết bị của bạn, không gửi ra ngoài.',
      'home.platformPanelAria': 'Chọn tỉ lệ và nền tảng',
      'home.platformGridAria': 'Tỉ lệ ảnh',
      'home.backgroundPanelAria': 'Chọn nền hoặc crop',
      'home.backgroundGridAria': 'Cách lấp khung',
      'home.customPaletteAria': 'Bảng màu tùy chỉnh',
      'home.color': 'Màu',
      'home.colorAria': 'Chọn màu nền',
      'home.hexAria': 'Mã màu HEX',
      'home.imageBackgroundTitle': 'Nền bằng ảnh tự chọn',
      'home.imageBackgroundSelect': 'Chọn ảnh nền',
      'home.imageBackgroundClear': 'Xóa',
      'home.layoutPanelAria': 'Bố cục ảnh',
      'home.layoutCropNote': 'Không áp dụng cho Crop',
      'home.padding': 'Padding',
      'home.corner': 'Corner',
      'home.previewColumnAria': 'Ảnh xem trước',
      'home.previewNavigationAria': 'Điều hướng ảnh xem trước',
      'home.previewPreviousAria': 'Xem ảnh trước',
      'home.previewNextAria': 'Xem ảnh tiếp theo',
      'home.previewNoCrop': 'Không crop',
      'home.previewEmpty': 'Ảnh xem trước sẽ hiện tại đây',
      'home.previewCanvasAria': 'Bản xem trước ảnh đã định dạng',
      'home.cropHint': 'Kéo ảnh để chọn vùng giữ lại',
      'home.reset': 'Đặt lại',
      'home.download': 'Tải ảnh JPG',
      'home.ntrvPromo': 'Muốn tạo bố cục nhiều ảnh hoặc chỉnh sửa nhiều hơn?',
      'home.ntrvPromoLink': 'Thử NTRV.',
      'home.footerCopy': 'FitPic xử lý ảnh ngay trên thiết bị của bạn.',
      'home.learnMore': 'Tìm hiểu thêm',

      'privacy.meta.title': 'Quyền riêng tư - FitPic',
      'privacy.meta.description': 'Chính sách quyền riêng tư của FitPic.',
      'privacy.meta.locale': 'vi_VN',
      'privacy.meta.ogTitle': 'Quyền riêng tư - FitPic',
      'privacy.meta.ogDescription': 'Tìm hiểu cách FitPic xử lý ảnh ngay trên thiết bị của bạn.',
      'privacy.eyebrow': 'QUYỀN RIÊNG TƯ',
      'privacy.title': 'Ảnh của bạn ở lại trên thiết bị.',
      'privacy.intro': 'FitPic được xây dựng để chuẩn bị ảnh đăng mạng xã hội mà không cần gửi ảnh lên máy chủ.',
      'privacy.whatTitle': 'FitPic xử lý gì?',
      'privacy.whatBody': 'Khi bạn chọn ảnh, trình duyệt của bạn đọc ảnh đó cục bộ để tạo preview và file tải xuống. Tùy chọn nơi đăng và nền cũng chỉ được dùng trong phiên làm việc hiện tại.',
      'privacy.notTitle': 'FitPic không làm gì?',
      'privacy.notBody': 'Chúng tôi không upload, lưu trữ, chia sẻ hoặc sử dụng ảnh của bạn trên máy chủ. FitPic không yêu cầu tài khoản, đăng nhập hoặc cung cấp thông tin cá nhân.',
      'privacy.downloadTitle': 'File tải xuống',
      'privacy.downloadBody': 'File kết quả được tạo trực tiếp trong trình duyệt và tải về thiết bị của bạn. Khi bạn đóng hoặc tải lại trang, ảnh đã chọn không còn được FitPic giữ lại.',
      'privacy.back': '← Quay lại FitPic',

      'app.platformAria': '{name}, tỉ lệ {ratio}',
      'app.paletteAria': 'Dùng màu {name}, {value}',
      'app.imageReplace': 'Thay ảnh nền',
      'app.imageSelect': 'Chọn ảnh nền',
      'app.imageDescription': 'Ảnh nền sẽ được căn giữa và cover toàn bộ khung.',
      'app.previewCanvasCropAria': 'Bản xem trước ảnh crop. Kéo ảnh để thay đổi vùng giữ lại.',
      'app.downloadSaveMany': 'Lưu {count} ảnh',
      'app.downloadSaveOne': 'Lưu ảnh',
      'app.downloadMany': 'Tải {count} ảnh JPG',
      'app.downloadOne': 'Tải ảnh JPG',
      'app.previewCrop': 'Crop',
      'app.previewImage': 'Image-based',
      'app.previewNoCrop': 'Không crop',
      'app.uploadInvalid': 'Hãy chọn file ảnh hợp lệ (JPG, PNG, WebP hoặc GIF).',
      'app.uploadReading': 'Đang đọc {count} ảnh trên thiết bị của bạn...',
      'app.uploadReadFailed': 'Không thể đọc các ảnh đã chọn. Hãy thử file ảnh khác.',
      'app.uploadSelectedMany': '{count} ảnh đã chọn. Dùng mũi tên ở preview để xem từng ảnh; tỉ lệ và chế độ nền áp dụng cho cả batch.',
      'app.uploadSkipped': '{count} file không hợp lệ hoặc không đọc được đã được bỏ qua.',
      'app.uploadReadyMany': '{count} ảnh đã sẵn sàng. Bạn có thể xem từng ảnh trước khi lưu.',
      'app.uploadReadyOne': 'Ảnh đã sẵn sàng. Chọn tỉ lệ và nền để xem kết quả.',
      'app.backgroundInvalid': 'Hãy chọn ảnh nền hợp lệ (JPG, PNG, WebP hoặc GIF).',
      'app.backgroundReading': 'Đang đọc ảnh nền trên thiết bị của bạn...',
      'app.backgroundUsing': 'Đang dùng {name} làm ảnh nền cho toàn bộ batch.',
      'app.backgroundReadFailed': 'Không thể đọc ảnh nền. Hãy thử file ảnh khác.',
      'app.backgroundRemoved': 'Đã xóa ảnh nền. Chọn ảnh nền mới để tiếp tục với Image-based.',
      'app.platformSelected': 'Đã chọn {name}, tỉ lệ {ratio}.',
      'app.backgroundCrop': 'Crop phủ kín khung. Balance và Radius tạm không áp dụng.',
      'app.backgroundCustom': 'Đang dùng nền {color}.',
      'app.backgroundChooseImage': 'Chọn một ảnh nền để dùng chế độ Image-based.',
      'app.backgroundChanged': 'Đã đổi nền thành {name}.',
      'app.balanceOn': 'Balance đang bật với lề {value}%.',
      'app.balanceOff': 'Balance đã tắt.',
      'app.balanceValue': 'Lề Balance: {value}%.',
      'app.radiusOn': 'Radius đang bật ở {value}px.',
      'app.radiusOff': 'Radius đã tắt.',
      'app.radiusValue': 'Radius: {value}px.',
      'app.cropReset': 'Đã đặt lại crop cho ảnh {index}.',
      'app.shareCancelled': 'Đã hủy lưu/chia sẻ. Nhấn lại nếu bạn muốn mở menu lưu ảnh.',
      'app.shareRetry': 'Ảnh đã sẵn sàng. Nhấn lại "{button}" để mở menu lưu ảnh.',
      'app.missingBackground': 'Hãy chọn ảnh nền trước khi lưu với chế độ Image-based.',
      'app.shareOpenedMany': 'Đã mở menu lưu/chia sẻ cho {count} ảnh.',
      'app.shareOpenedOne': 'Đã mở menu lưu/chia sẻ ảnh.',
      'app.shareFallbackMany': 'Không thể mở menu chia sẻ. FitPic đã dùng cách tải file dự phòng.',
      'app.shareFallbackOne': 'Không thể mở menu chia sẻ. FitPic đã tải file dự phòng.',
      'app.preparingMany': 'Đang chuẩn bị {count} ảnh...',
      'app.preparingOne': 'Đang chuẩn bị ảnh...',
      'app.downloadCreatedMany': '{count} ảnh đã được tạo. Trình duyệt có thể hỏi quyền tải nhiều file.',
      'app.downloadCreatedOne': 'Ảnh đã được tạo để tải xuống.',
      'app.exportFailed': 'Không thể tạo đầy đủ file ảnh. Hãy thử lại.',
    },
    en: {
      'common.language': 'Language',
      'common.homeAria': 'FitPic home',
      'common.themeToLight': 'Switch to light theme',
      'common.themeToDark': 'Switch to dark theme',
      'common.privacy': 'Privacy',
      'common.backToFitPic': 'Back to FitPic',

      'home.meta.title': 'FitPic - Resize images for social media',
      'home.meta.description': 'Prepare one or more images for Instagram, TikTok, Facebook and YouTube while keeping the full photo, using custom backgrounds, balanced margins or crop.',
      'home.meta.locale': 'en_US',
      'home.meta.ogTitle': 'FitPic - Resize images for social media',
      'home.meta.ogDescription': 'Format one or more images for social media with blur, color or image backgrounds, Balance, or crop.',
      'home.intro': 'Choose one or more images, a ratio, background, or crop',
      'home.workspaceAria': 'Create social media images',
      'home.uploadPanelAria': 'Choose images',
      'home.uploadTitle': 'Upload images from your device',
      'home.uploadCopy': 'JPG, PNG, WebP or GIF · multiple images supported',
      'home.uploadAction': 'Choose images',
      'home.uploadPrivacy': 'Images are processed on your device and never sent anywhere.',
      'home.platformPanelAria': 'Choose ratio and platform',
      'home.platformGridAria': 'Image ratios',
      'home.backgroundPanelAria': 'Choose background or crop',
      'home.backgroundGridAria': 'Fill mode',
      'home.customPaletteAria': 'Custom color palette',
      'home.color': 'Color',
      'home.colorAria': 'Choose background color',
      'home.hexAria': 'HEX color code',
      'home.imageBackgroundTitle': 'Custom image background',
      'home.imageBackgroundSelect': 'Choose background image',
      'home.imageBackgroundClear': 'Clear',
      'home.layoutPanelAria': 'Image layout',
      'home.layoutCropNote': 'Not available for Crop',
      'home.padding': 'Padding',
      'home.corner': 'Corner',
      'home.previewColumnAria': 'Image preview',
      'home.previewNavigationAria': 'Preview navigation',
      'home.previewPreviousAria': 'Previous image',
      'home.previewNextAria': 'Next image',
      'home.previewNoCrop': 'No crop',
      'home.previewEmpty': 'Your image preview will appear here',
      'home.previewCanvasAria': 'Formatted image preview',
      'home.cropHint': 'Drag the image to choose the area to keep',
      'home.reset': 'Reset',
      'home.download': 'Download JPG',
      'home.ntrvPromo': 'Want to create multi-photo layouts or edit more?',
      'home.ntrvPromoLink': 'Try NTRV.',
      'home.footerCopy': 'FitPic processes images directly on your device.',
      'home.learnMore': 'Learn more',

      'privacy.meta.title': 'Privacy - FitPic',
      'privacy.meta.description': 'FitPic privacy policy.',
      'privacy.meta.locale': 'en_US',
      'privacy.meta.ogTitle': 'Privacy - FitPic',
      'privacy.meta.ogDescription': 'Learn how FitPic processes images directly on your device.',
      'privacy.eyebrow': 'PRIVACY',
      'privacy.title': 'Your images stay on your device.',
      'privacy.intro': 'FitPic is built to prepare social media images without sending them to a server.',
      'privacy.whatTitle': 'What does FitPic process?',
      'privacy.whatBody': 'When you choose an image, your browser reads it locally to create the preview and download file. Platform and background choices are also used only for the current session.',
      'privacy.notTitle': 'What does FitPic not do?',
      'privacy.notBody': 'We do not upload, store, share or use your images on a server. FitPic does not require an account, sign-in or personal information.',
      'privacy.downloadTitle': 'Downloaded files',
      'privacy.downloadBody': 'Output files are created directly in your browser and downloaded to your device. When you close or reload the page, FitPic no longer keeps the images you selected.',
      'privacy.back': '← Back to FitPic',

      'app.platformAria': '{name}, {ratio} ratio',
      'app.paletteAria': 'Use {name}, {value}',
      'app.imageReplace': 'Replace background',
      'app.imageSelect': 'Choose background image',
      'app.imageDescription': 'The background image is centered and covers the entire frame.',
      'app.previewCanvasCropAria': 'Crop preview. Drag the image to change the area to keep.',
      'app.downloadSaveMany': 'Save {count} images',
      'app.downloadSaveOne': 'Save image',
      'app.downloadMany': 'Download {count} JPGs',
      'app.downloadOne': 'Download JPG',
      'app.previewCrop': 'Crop',
      'app.previewImage': 'Image-based',
      'app.previewNoCrop': 'No crop',
      'app.uploadInvalid': 'Choose a valid image file (JPG, PNG, WebP or GIF).',
      'app.uploadReading': 'Reading {count} images on your device...',
      'app.uploadReadFailed': 'FitPic could not read the selected images. Try different image files.',
      'app.uploadSelectedMany': '{count} images selected. Use the preview arrows to inspect each image; ratio and background mode apply to the whole batch.',
      'app.uploadSkipped': '{count} invalid or unreadable files were skipped.',
      'app.uploadReadyMany': '{count} images are ready. You can preview each one before saving.',
      'app.uploadReadyOne': 'Your image is ready. Choose a ratio and background to preview the result.',
      'app.backgroundInvalid': 'Choose a valid background image (JPG, PNG, WebP or GIF).',
      'app.backgroundReading': 'Reading the background image on your device...',
      'app.backgroundUsing': 'Using {name} as the background for the whole batch.',
      'app.backgroundReadFailed': 'FitPic could not read the background image. Try a different file.',
      'app.backgroundRemoved': 'Background image removed. Choose a new one to continue with Image-based.',
      'app.platformSelected': 'Selected {name}, {ratio} ratio.',
      'app.backgroundCrop': 'Crop fills the frame. Balance and Radius are temporarily unavailable.',
      'app.backgroundCustom': 'Using {color} as the background.',
      'app.backgroundChooseImage': 'Choose a background image to use Image-based mode.',
      'app.backgroundChanged': 'Background changed to {name}.',
      'app.balanceOn': 'Balance is on with {value}% padding.',
      'app.balanceOff': 'Balance is off.',
      'app.balanceValue': 'Balance padding: {value}%.',
      'app.radiusOn': 'Radius is on at {value}px.',
      'app.radiusOff': 'Radius is off.',
      'app.radiusValue': 'Radius: {value}px.',
      'app.cropReset': 'Reset crop for image {index}.',
      'app.shareCancelled': 'Save/share was cancelled. Tap again to reopen the save menu.',
      'app.shareRetry': 'Images are ready. Tap "{button}" again to open the save menu.',
      'app.missingBackground': 'Choose a background image before saving in Image-based mode.',
      'app.shareOpenedMany': 'Opened the save/share menu for {count} images.',
      'app.shareOpenedOne': 'Opened the save/share menu.',
      'app.shareFallbackMany': 'Could not open the share menu. FitPic used the download fallback.',
      'app.shareFallbackOne': 'Could not open the share menu. FitPic downloaded the file instead.',
      'app.preparingMany': 'Preparing {count} images...',
      'app.preparingOne': 'Preparing image...',
      'app.downloadCreatedMany': '{count} images were created. Your browser may ask for permission to download multiple files.',
      'app.downloadCreatedOne': 'The image is ready to download.',
      'app.exportFailed': 'FitPic could not create all output files. Try again.',
    },
  };

  let currentLanguage = 'en';

  function normalizeLanguage(value) {
    if (!value || typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase().split(/[-_]/)[0];
    return supportedLanguages.includes(normalized) ? normalized : null;
  }

  function resolveLanguage(languages = [], savedLanguage = null) {
    const saved = normalizeLanguage(savedLanguage);
    if (saved) return saved;
    const candidates = Array.isArray(languages) ? languages : [languages];
    for (const candidate of candidates) {
      const normalized = normalizeLanguage(candidate);
      if (normalized) return normalized;
    }
    return 'en';
  }

  function interpolate(template, variables = {}) {
    return String(template).replace(/\{([^}]+)\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key]) : match
    ));
  }

  function t(key, variables = {}) {
    const template = translations[currentLanguage]?.[key]
      ?? translations.en[key]
      ?? translations.vi[key]
      ?? key;
    return interpolate(template, variables);
  }

  function getLanguage() {
    return currentLanguage;
  }

  function safeReadStoredLanguage() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function safeStoreLanguage(language) {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch (error) {
      // Language selection still applies for the current page when storage is unavailable.
    }
  }

  function browserLanguages() {
    if (typeof navigator === 'undefined') return [];
    if (Array.isArray(navigator.languages) && navigator.languages.length) return navigator.languages;
    return navigator.language ? [navigator.language] : [];
  }

  function applyDocumentTranslations() {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });
    document.querySelectorAll('[data-i18n-content]').forEach((element) => {
      element.setAttribute('content', t(element.dataset.i18nContent));
    });
    document.querySelectorAll('[data-language-select]').forEach((select) => {
      select.value = currentLanguage;
      select.setAttribute('aria-label', t('common.language'));
    });
  }

  function notifyLanguageChange() {
    listeners.forEach((listener) => listener(currentLanguage));
  }

  function setLanguage(language, options = {}) {
    const normalized = normalizeLanguage(language);
    if (!normalized) return false;
    currentLanguage = normalized;
    if (options.persist !== false && typeof window !== 'undefined') safeStoreLanguage(normalized);
    applyDocumentTranslations();
    notifyLanguageChange();
    return true;
  }

  function onChange(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function initializeBrowser() {
    currentLanguage = resolveLanguage(browserLanguages(), safeReadStoredLanguage());
    document.querySelectorAll('[data-language-select]').forEach((select) => {
      select.addEventListener('change', (event) => setLanguage(event.target.value));
    });
    applyDocumentTranslations();
  }

  return {
    supportedLanguages,
    translations,
    normalizeLanguage,
    resolveLanguage,
    interpolate,
    t,
    getLanguage,
    setLanguage,
    onChange,
    applyDocumentTranslations,
    initializeBrowser,
  };
});