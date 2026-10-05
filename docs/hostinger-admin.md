# Dashboard admin dalam repo MSPACE

Situs publik berada di root repo dan dashboard berada di `admin/`. Keduanya memakai versi Laravel dan dependency masing-masing. Perubahan dashboard berikutnya dilakukan di `admin/`.

Jika repo ditempatkan di `public_html`, arahkan subdomain `admin.bemssmi.com` ke `public_html/admin`. `admin/.htaccess` meneruskan permintaan ke `admin/public`. Aset siap pakai di `admin/public/build` ikut Git.

Hostinger mendukung subdomain melalui subfolder situs utama: [panduan subdomain Hostinger](https://www.hostinger.com/support/1583405-how-to-create-and-delete-subdomains-in-hostinger/).

## Instalasi pertama

Dari folder `public_html/admin`, jalankan:

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
cp .env.example .env
php artisan key:generate
```

Isi `admin/.env` dengan koneksi MySQL yang sama seperti `.env` situs publik: `DB_CONNECTION=mysql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD`. Pertahankan `APP_URL=https://admin.bemssmi.com`, `APP_DEBUG=false`, `SESSION_DOMAIN=null`, dan `SESSION_COOKIE=mspace_admin_session`.

Jika memindahkan konfigurasi dashboard lama, gunakan `.env` dan `APP_KEY` lama supaya data two-factor terenkripsi tetap dapat dibaca. Dalam kasus itu, lewati `cp` dan `key:generate`, lalu sesuaikan URL dan cookie.

Database impor yang sudah digunakan dashboard lama tidak perlu dibuat ulang atau di-seed. Periksa `php artisan migrate:status` sebelum menjalankan migration. Jika migration lama muncul Pending pada database yang sudah berisi tabel, periksa riwayat impornya dahulu.

### Pembaruan profil dan persetujuan birdept

Halaman profil memerlukan tabel `unitrequests`. Setelah mengunggah kode admin terbaru, jalankan migrasi khusus ini dari `public_html/admin` menggunakan koneksi database admin yang benar:

```bash
php artisan migrate --path=database/migrations/2026_10_05_000001_create_unit_requests_table.php --force
php artisan optimize:clear
```

Periksa `php artisan migrate:status` atau tabel `unitrequests` di phpMyAdmin. Jangan membuat tabelnya secara manual dan jangan menjalankan `migrate:fresh` pada database situs yang berisi data.

```bash
php artisan optimize:clear
php artisan config:cache
```

Gunakan PHP minimal 8.3 untuk subdomain dan CLI Composer. Folder `admin/storage` serta `admin/bootstrap/cache` harus dapat ditulis oleh PHP. Atur SMTP di `admin/.env` untuk verifikasi email dan reset kata sandi.

## Media dan pembaruan

Dashboard menulis gambar ke `storage/app/information-media` milik situs publik, satu tingkat di atas folder admin. Untuk lokasi lain, isi `INFORMATION_MEDIA_ROOT` dengan path absolut yang sama di kedua `.env`.

Build dashboard dari folder `admin` dengan `npm ci` lalu `npm run build`. Commit hasil `admin/public/build` bersama source. Dependency PHP dashboard dipasang dengan Composer dari folder `admin`; dependency publik dipasang dari root repo.

Jangan commit `.env`, database lokal, log, atau session. Folder admin ini tidak berisi konfigurasi rahasia dari proyek lama.

## Pembaruan password melalui email

- Unggah juga seluruh `admin/public/build` terbaru beserta `manifest.json`.
- Di `.env` admin gunakan `APP_URL=https://admin.bemssmi.com` dan `APP_DEBUG=false`.
- Gunakan `VITE_PUBLIC_URL=https://bemssmi.com` ketika build admin; variabel VITE dibaca saat build.
- Konfigurasikan `MAIL_MAILER=smtp`, host, port, username, password, dan alamat pengirim sesuai penyedia email. `MAIL_MAILER=log` tidak mengirim email sungguhan.
- Setelah deployment, jalankan `php artisan optimize:clear` lalu `php artisan config:cache` dari folder aplikasi admin.
- Dari Pengaturan > Profil, tombol Ganti password via email mengirim tautan hanya ke email akun yang sedang masuk. Tautan dapat dibuka saat masih login dan hanya dapat digunakan sekali.
- Jika gagal, periksa pesan pada form serta `admin/storage/logs/laravel.log`. Jangan memublikasikan `.env` atau token reset.
