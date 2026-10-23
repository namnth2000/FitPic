#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_dialog::DialogExt;

fn validate_export(name: &str, bytes: &[u8]) -> Result<(), String> {
    if name.is_empty()
        || name.contains(['/', '\\', ':'])
        || !name.ends_with(".jpg")
        || !bytes.starts_with(&[0xff, 0xd8, 0xff])
        || !bytes.ends_with(&[0xff, 0xd9])
    {
        return Err("Expected a JPG export with a plain filename".into());
    }
    Ok(())
}

// The frontend supplies bytes, never a destination path. Only the path chosen
// in this native dialog can be written. No general filesystem IPC is exposed.
#[tauri::command]
async fn save_export(
    app: tauri::AppHandle,
    window: tauri::WebviewWindow,
    name: String,
    bytes: Vec<u8>,
    title: String,
) -> Result<bool, String> {
    validate_export(&name, &bytes)?;
    tauri::async_runtime::spawn_blocking(move || {
        let selected = app
            .dialog()
            .file()
            .set_parent(&window)
            .set_title(title)
            .set_file_name(name)
            .add_filter("JPEG", &["jpg"])
            .blocking_save_file();
        let Some(selected) = selected else {
            return Ok(false);
        };
        let path = selected.into_path().map_err(|error| error.to_string())?;
        std::fs::write(path, bytes).map_err(|error| error.to_string())?;
        Ok(true)
    })
    .await
    .map_err(|error| error.to_string())?
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![save_export])
        .run(tauri::generate_context!())
        .expect("Could not run FitPic Desktop");
}

#[cfg(test)]
mod tests {
    use super::validate_export;

    #[test]
    fn rejects_paths_and_non_jpg_payloads() {
        let jpeg = [0xff, 0xd8, 0xff, 0x00, 0xff, 0xd9];
        assert!(validate_export("fitpic-photo.jpg", &jpeg).is_ok());
        for name in [
            "../photo.jpg",
            "C:\\photo.jpg",
            "folder/photo.jpg",
            "photo.png",
            "",
        ] {
            assert!(validate_export(name, &jpeg).is_err());
        }
        assert!(validate_export("photo.jpg", b"not an image").is_err());
    }
}
