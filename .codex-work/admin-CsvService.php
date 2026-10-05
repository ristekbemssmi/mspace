<?php

namespace App\Services;

use App\Models\BenefitBeasiswa;
use App\Models\Birdept;
use App\Models\Faq;
use App\Models\Informasi;
use App\Models\InformasiAlumni;
use App\Models\InformasiBeasiswa;
use App\Models\InformasiHimpunan;
use App\Models\InformasiKegiatan;
use App\Models\InformasiMagang;
use App\Models\InformasiProker;
use App\Models\InformasiWisuda;
use App\Models\PanitiaProker;
use App\Models\SyaratBeasiswa;
use App\Models\User;
use App\Models\UserBem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class CsvService
{
    /**
     * Map of supported table names and their schema specifications
     */
    public static function getSupportedTables(): array
    {
        return [
            'units' => [
                'label' => 'Birdept (Biro & Departemen)',
                'group' => 'Utama',
                'required' => ['name', 'abbreviation', 'type'],
                'optional' => ['description', 'instagram'],
                'sample' => [
                    ['Advokasi dan Kesejahteraan Mahasiswa', 'Adkesma', 'departemen', 'Departemen yang membidangi adkesma', '@adkesma_bem'],
                    ['Internal dan Pengembangan', 'Internal', 'biro', 'Biro internal organisasi', '@internal_bem'],
                ],
            ],
            'users' => [
                'label' => 'Users (Pengguna Akun)',
                'group' => 'Utama',
                'required' => ['username', 'name', 'email', 'studentNumber'],
                'optional' => ['phone', 'studyProgram'],
                'sample' => [
                    ['budi_santoso', 'Budi Santoso', 'budi@example.invalid', 'G64190001', '081234567890', 'Ilmu Komputer'],
                    ['siti_aminah', 'Siti Aminah', 'siti@example.invalid', 'G64190002', '081298765432', 'Statistika dan Sains Data'],
                ],
            ],
            'organizationMembers' => [
                'label' => 'Anggota BEM (Keanggotaan)',
                'group' => 'Utama',
                'required' => ['id', 'unitId', 'position'],
                'optional' => [],
                'sample' => [
                    ['1', '1', 'Ketua Departemen'],
                    ['2', '2', 'Staff Ahli'],
                ],
            ],
            'information' => [
                'label' => 'Informasi Utama (Artikel/Pengumuman)',
                'group' => 'Informasi',
                'required' => ['unitId', 'userId', 'title', 'description', 'category'],
                'optional' => ['source', 'status', 'publishedAt', 'expiresAt'],
                'sample' => [
                    ['1', '1', 'Pendaftaran Beasiswa Unggulan 2026', 'Informasi mengenai Beasiswa Unggulan Kemendikbud', 'beasiswa', 'https://beasiswa.kemdikbud.go.id', 'published', '2026-08-01 08:00:00', '2026-09-01 23:59:59'],
                    ['2', '1', 'Workshop AI & Data Science', 'Pelatihan intensif sains data untuk mahasiswa', 'kegiatan', 'BEM Mspace', 'published', '2026-08-05 09:00:00', '2026-08-10 17:00:00'],
                ],
            ],
            'scholarships' => [
                'label' => 'Sub-Tabel Detail Beasiswa',
                'group' => 'Informasi Sub-Tabel',
                'required' => ['id', 'posterUrl', 'instagramUrl'],
                'optional' => ['organizer', 'opensOn', 'closesOn', 'registrationUrl'],
                'sample' => [
                    ['1', 'https://example.com/poster.jpg', 'https://instagram.com/p/12345', 'Kemendikbud', '2026-08-01', '2026-08-31', 'https://bit.ly/daftar-beasiswa'],
                ],
            ],
            'scholarshipRequirements' => [
                'label' => 'Sub-Tabel Syarat Beasiswa',
                'group' => 'Informasi Sub-Tabel',
                'required' => ['scholarshipId', 'requirement', 'description'],
                'optional' => [],
                'sample' => [
                    ['1', 'Minimal IPK', '3.00'],
                    ['1', 'Semester Minimal', 'Semester 3'],
                ],
            ],
            'scholarshipBenefits' => [
                'label' => 'Sub-Tabel Benefit Beasiswa',
                'group' => 'Informasi Sub-Tabel',
                'required' => ['scholarshipId', 'benefit', 'description'],
                'optional' => [],
                'sample' => [
                    ['1', 'Uang Saku', 'Rp 1.500.000 / bulan'],
                    ['1', 'Fasilitas Laptop', '1 Unit Laptop High-Spec'],
                ],
            ],
            'activities' => [
                'label' => 'Sub-Tabel Detail Kegiatan',
                'group' => 'Informasi Sub-Tabel',
                'required' => ['id', 'eventAt', 'location', 'organizer'],
                'optional' => [],
                'sample' => [
                    ['2', '2026-08-15 09:00:00', 'Aula FMIPA IPB', 'Biro Riset dan Teknologi'],
                ],
            ],
            'studentAssociations' => [
                'label' => 'Sub-Tabel Detail Himpunan',
                'group' => 'Informasi Sub-Tabel',
                'required' => ['id', 'name', 'contact'],
                'optional' => [],
                'sample' => [
                    ['3', 'Halkom (Himpunan Ilmu Komputer)', '08123456789'],
                ],
            ],
            'graduations' => [
                'label' => 'Sub-Tabel Detail Wisuda',
                'group' => 'Informasi Sub-Tabel',
                'required' => ['id', 'graduationPeriod', 'registrationSteps'],
                'optional' => [],
                'sample' => [
                    ['4', 'Wisuda Tahap IV Tahun 2026', '1. Daftar SIMAK 2. Verifikasi Berkas 3. Cetak Undangan'],
                ],
            ],
            'alumni' => [
                'label' => 'Sub-Tabel Detail Alumni',
                'group' => 'Informasi Sub-Tabel',
                'required' => ['id', 'name', 'cohort', 'topic'],
                'optional' => [],
                'sample' => [
                    ['5', 'Ahmad Reza', '55 (2018)', 'Karier Senior Software Engineer di Startup Tech'],
                ],
            ],
            'internships' => [
                'label' => 'Sub-Tabel Detail Magang',
                'group' => 'Informasi Sub-Tabel',
                'required' => ['id', 'company', 'position', 'duration'],
                'optional' => [],
                'sample' => [
                    ['6', 'PT GoTo Gojek Tokopedia', 'Data Analyst Intern', '6 Bulan'],
                ],
            ],
            'workPrograms' => [
                'label' => 'Sub-Tabel Detail Program Kerja (Proker)',
                'group' => 'Informasi Sub-Tabel',
                'required' => ['id'],
                'optional' => ['purpose', 'audience', 'startsOn', 'endsOn'],
                'sample' => [
                    ['7', 'Meningkatkan skill programming mahasiswa', 'Mahasiswa Ilmu Komputer & SSD', '2026-09-01', '2026-11-30'],
                ],
            ],
            'workProgramCommittees' => [
                'label' => 'Sub-Tabel Panitia Program Kerja',
                'group' => 'Informasi Sub-Tabel',
                'required' => ['workProgramId', 'userId', 'position'],
                'optional' => ['division'],
                'sample' => [
                    ['7', '1', 'Ketua Pelaksana', 'Acara'],
                    ['7', '2', 'Staff Panitia', 'Humas'],
                ],
            ],
            'faqs' => [
                'label' => 'FAQ (Frequently Asked Questions)',
                'group' => 'Utama',
                'required' => ['question', 'answer'],
                'optional' => ['sortOrder', 'isActive'],
                'sample' => [
                    ['Bagaimana cara mengajukan beasiswa di MSpace?', 'Anda dapat melihat daftar beasiswa pada menu Beasiswa dan mengklik tombol pendaftaran.', '1', '1'],
                    ['Siapa saja yang bisa menjadi anggota BEM?', 'Seluruh mahasiswa aktif FMIPA IPB sesuai kualifikasi open recruitment.', '2', '1'],
                ],
            ],
        ];
    }

    /**
     * Generate Excel Template (.xlsx) for a table
     */
    public function generateTemplateXlsx(string $tableName): string
    {
        $tables = self::getSupportedTables();
        if (!isset($tables[$tableName])) {
            throw new \InvalidArgumentException("Tabel '$tableName' tidak didukung.");
        }

        $config = $tables[$tableName];
        $headers = array_merge($config['required'], $config['optional']);

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle(substr($tableName, 0, 30));

        // Header row
        $sheet->fromArray([$headers], null, 'A1');

        // Sample rows
        if (!empty($config['sample'])) {
            $sheet->fromArray($config['sample'], null, 'A2');
        }

        $writer = new Xlsx($spreadsheet);
        ob_start();
        $writer->save('php://output');
        return ob_get_clean();
    }

    /**
     * Generate CSV Template string for a table
     */
    public function generateTemplate(string $tableName): string
    {
        $tables = self::getSupportedTables();
        if (!isset($tables[$tableName])) {
            throw new \InvalidArgumentException("Tabel '$tableName' tidak didukung.");
        }

        $config = $tables[$tableName];
        $headers = array_merge($config['required'], $config['optional']);

        $output = fopen('php://temp', 'r+');
        fputcsv($output, $headers);

        foreach ($config['sample'] as $row) {
            fputcsv($output, $row);
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return $csv;
    }

    /**
     * Export table data to CSV format
     */
    public function exportCsv(string $tableName): string
    {
        $tables = self::getSupportedTables();
        if (!isset($tables[$tableName])) {
            throw new \InvalidArgumentException("Tabel '$tableName' tidak didukung.");
        }

        $columns = $tableName === 'users'
            ? ['id', 'username', 'name', 'email', 'studentNumber', 'phone', 'studyProgram', 'createdAt']
            : array_merge($tables[$tableName]['required'], $tables[$tableName]['optional']);

        $query = DB::table($tableName);
        if ($tableName === 'information') {
            $query->whereNull('deletedAt');
        }
        $records = $query->select($columns)->cursor();

        $output = fopen('php://temp', 'r+');
        fputcsv($output, $columns);

        foreach ($records as $record) {
            fputcsv($output, array_map([$this, 'safeCsvCell'], (array) $record));
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return $csv;
    }

    private function safeCsvCell(mixed $value): string
    {
        $cell = (string) ($value ?? '');

        // Spreadsheet programs may execute formula-like values when opening CSV files.
        return preg_match('/^\s*[=+\-@]/u', $cell) ? "'".$cell : $cell;
    }

    /**
     * Parse and import CSV or Excel (.xlsx, .xls) file content into specified table
     */
    public function importCsv(string $tableName, UploadedFile $file): array
    {
        $tables = self::getSupportedTables();
        if (!isset($tables[$tableName])) {
            return [
                'success' => false,
                'message' => "Tabel '$tableName' tidak didukung.",
                'inserted' => 0,
                'failed' => 0,
                'errors' => [],
            ];
        }

        $filePath = $file->getRealPath();

        try {
            // Load file using PhpSpreadsheet (supports .xlsx, .xls, .csv, .txt)
            $spreadsheet = IOFactory::load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, false);
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => 'Gagal membaca file Excel/CSV: ' . $e->getMessage(),
                'inserted' => 0,
                'failed' => 0,
                'errors' => [$e->getMessage()],
            ];
        }

        if (empty($rows) || count($rows) < 1) {
            return [
                'success' => false,
                'message' => 'File Excel/CSV kosong.',
                'inserted' => 0,
                'failed' => 0,
                'errors' => [],
            ];
        }

        // Header row
        $rawHeader = array_shift($rows);
        $header = array_map(function ($h) {
            return strtolower(trim(preg_replace('/\x{FEFF}/u', '', (string) $h)));
        }, $rawHeader);

        $config = $tables[$tableName];
        $missingRequired = array_diff($config['required'], $header);

        if (!empty($missingRequired)) {
            return [
                'success' => false,
                'message' => 'Header kolom tidak sesuai. Kolom wajib yang hilang: ' . implode(', ', $missingRequired),
                'inserted' => 0,
                'failed' => 0,
                'errors' => ['Header wajib hilang: ' . implode(', ', $missingRequired)],
            ];
        }

        $rowNum = 1;
        $insertedCount = 0;
        $failedCount = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($rows as $row) {
                $rowNum++;

                // Skip completely empty rows
                $nonEmptyValues = array_filter($row, function ($v) {
                    return $v !== null && trim((string) $v) !== '';
                });

                if (empty($nonEmptyValues)) {
                    continue;
                }

                // Combine header with row values
                $data = [];
                foreach ($header as $idx => $colName) {
                    $val = isset($row[$idx]) ? trim((string) $row[$idx]) : null;
                    $data[$colName] = $val !== '' ? $val : null;
                }

                try {
                    $this->insertRow($tableName, $data);
                    $insertedCount++;
                } catch (\Throwable $e) {
                    $failedCount++;
                    $errors[] = "Baris $rowNum: " . $e->getMessage();
                }
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Gagal mengimpor file: ' . $e->getMessage(),
                'inserted' => 0,
                'failed' => $failedCount,
                'errors' => array_merge($errors, [$e->getMessage()]),
            ];
        }

        return [
            'success' => true,
            'message' => "Berhasil mengimpor $insertedCount data ke tabel $tableName." . ($failedCount > 0 ? " ($failedCount gagal)" : ''),
            'inserted' => $insertedCount,
            'failed' => $failedCount,
            'errors' => $errors,
        ];
    }

    /**
     * Insert single row into database based on table schema
     */
    protected function insertRow(string $tableName, array $data): void
    {
        switch ($tableName) {
            case 'units':
                Birdept::create([
                    'name' => $data['name'],
                    'abbreviation' => $data['abbreviation'],
                    'type' => strtolower($data['type']),
                    'description' => $data['description'] ?? null,
                    'instagram' => $data['instagram'] ?? null,
                ]);
                break;

            case 'users':
                User::create([
                    'username' => $data['username'],
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'studentNumber' => $data['studentNumber'],
                    // Imported users must use the password reset flow before logging in.
                    'password' => Hash::make(Str::random(64)),
                    'phone' => $data['phone'] ?? null,
                    'studyProgram' => !empty($data['studyProgram']) ? $data['studyProgram'] : null,
                ]);
                break;

            case 'organizationMembers':
                UserBem::updateOrCreate(
                    ['id' => $data['id']],
                    [
                        'unitId' => $data['unitId'],
                        'position' => $data['position'],
                    ]
                );
                break;

            case 'information':
                Informasi::create([
                    'unitId' => $data['unitId'],
                    'userId' => $data['userId'],
                    'title' => $data['title'],
                    'description' => $data['description'],
                    'category' => strtolower($data['category']),
                    'source' => $data['source'] ?? null,
                    'status' => strtolower($data['status'] ?? 'published'),
                    'publishedAt' => !empty($data['publishedAt']) ? $data['publishedAt'] : (strtolower($data['status'] ?? 'published') === 'published' ? now() : null),
                    'expiresAt' => !empty($data['expiresAt'])
                        ? (strlen(trim($data['expiresAt'])) === 10
                            ? Carbon::parse($data['expiresAt'], config('app.timezone'))->endOfDay()->format('Y-m-d H:i:s')
                            : $data['expiresAt'])
                        : null,
                ]);
                break;

            case 'scholarships':
                InformasiBeasiswa::updateOrCreate(
                    ['id' => $data['id']],
                    [
                        'organizer' => $data['organizer'] ?? null,
                        'opensOn' => !empty($data['opensOn']) ? $data['opensOn'] : null,
                        'closesOn' => !empty($data['closesOn']) ? $data['closesOn'] : null,
                        'posterUrl' => $data['posterUrl'] ?? '',
                        'instagramUrl' => $data['instagramUrl'] ?? '',
                        'registrationUrl' => $data['registrationUrl'] ?? null,
                    ]
                );
                break;

            case 'scholarshipRequirements':
                SyaratBeasiswa::create([
                    'scholarshipId' => $data['scholarshipId'],
                    'requirement' => $data['requirement'],
                    'description' => $data['description'],
                ]);
                break;

            case 'scholarshipBenefits':
                BenefitBeasiswa::create([
                    'scholarshipId' => $data['scholarshipId'],
                    'benefit' => $data['benefit'],
                    'description' => $data['description'],
                ]);
                break;

            case 'activities':
                InformasiKegiatan::updateOrCreate(
                    ['id' => $data['id']],
                    [
                        'eventAt' => $data['eventAt'],
                        'location' => $data['location'],
                        'organizer' => $data['organizer'],
                    ]
                );
                break;

            case 'studentAssociations':
                InformasiHimpunan::updateOrCreate(
                    ['id' => $data['id']],
                    [
                        'name' => $data['name'],
                        'contact' => $data['contact'],
                    ]
                );
                break;

            case 'graduations':
                InformasiWisuda::updateOrCreate(
                    ['id' => $data['id']],
                    [
                        'graduationPeriod' => $data['graduationPeriod'],
                        'registrationSteps' => $data['registrationSteps'],
                    ]
                );
                break;

            case 'alumni':
                InformasiAlumni::updateOrCreate(
                    ['id' => $data['id']],
                    [
                        'name' => $data['name'],
                        'cohort' => $data['cohort'],
                        'topic' => $data['topic'],
                    ]
                );
                break;

            case 'internships':
                InformasiMagang::updateOrCreate(
                    ['id' => $data['id']],
                    [
                        'company' => $data['company'],
                        'position' => $data['position'],
                        'duration' => $data['duration'],
                    ]
                );
                break;

            case 'workPrograms':
                InformasiProker::updateOrCreate(
                    ['id' => $data['id']],
                    [
                        'purpose' => $data['purpose'] ?? null,
                        'audience' => $data['audience'] ?? null,
                        'startsOn' => !empty($data['startsOn']) ? $data['startsOn'] : null,
                        'endsOn' => !empty($data['endsOn']) ? $data['endsOn'] : null,
                    ]
                );
                break;

            case 'workProgramCommittees':
                PanitiaProker::updateOrCreate(
                    [
                        'workProgramId' => $data['workProgramId'],
                        'userId' => $data['userId'],
                    ],
                    [
                        'position' => $data['position'],
                        'division' => $data['division'] ?? null,
                    ]
                );
                break;

            case 'faqs':
                Faq::create([
                    'question' => $data['question'],
                    'answer' => $data['answer'],
                    'sortOrder' => isset($data['sortOrder']) ? (int) $data['sortOrder'] : 0,
                    'isActive' => isset($data['isActive']) ? (bool) $data['isActive'] : true,
                ]);
                break;
        }
    }
}
