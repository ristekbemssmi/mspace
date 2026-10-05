<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('public detail only serves published, started, active information without author fields', function () {
    $birdeptId = DB::table('units')->insertGetId([
        'name' => 'Media Branding',
        'abbreviation' => 'medbrand',
        'type' => 'biro',
    ], 'unitId');
    $authorId = DB::table('users')->insertGetId([
        'username' => 'author1',
        'password' => bcrypt('secret-password'),
        'email' => 'private-author@example.test',
        'name' => 'Penulis',
        'studentNumber' => '12345678',
    ]);
    $base = [
        'unitId' => $birdeptId,
        'userId' => $authorId,
        'description' => 'Isi pengumuman',
        'category' => 'kegiatan',
    ];
    $publishedId = DB::table('information')->insertGetId($base + [
        'title' => 'Pengumuman terbuka',
        'slug' => 'pengumuman-terbuka',
        'status' => 'published',
        'publishedAt' => now()->subDay(),
    ]);
    DB::table('information')->insert($base + [
        'title' => 'Draft rahasia',
        'slug' => 'draft-rahasia',
        'status' => 'draft',
        'publishedAt' => now()->subDay(),
    ]);
    DB::table('information')->insert($base + [
        'title' => 'Terjadwal',
        'slug' => 'terjadwal',
        'status' => 'published',
        'publishedAt' => now()->addDays(8),
    ]);
    DB::table('information')->insert($base + [
        'title' => 'Kedaluwarsa',
        'slug' => 'kedaluwarsa',
        'status' => 'published',
        'publishedAt' => now()->subDays(2),
        'expiresAt' => now()->subDays(2),
    ]);

    $this->get(route('informasi.show', 'pengumuman-terbuka'))
        ->assertOk()
        ->assertSee('Pengumuman terbuka')
        ->assertDontSee('private-author@example.test');
    $this->get(route('informasi.show', $publishedId))->assertOk();
    $this->get(route('informasi.show', 'draft-rahasia'))->assertNotFound();
    $this->get(route('informasi.show', 'terjadwal'))->assertNotFound();
    $this->get(route('informasi.show', 'kedaluwarsa'))->assertNotFound();

    $this->get(route('home'))->assertOk()->assertDontSee('Draft rahasia')->assertDontSee('Terjadwal')->assertDontSee('Kedaluwarsa');
});

test('a collaborating birdept also displays a shared proker', function () {
    $primary = DB::table('units')->insertGetId(['name' => 'Media Branding', 'abbreviation' => 'medbrand', 'type' => 'biro'], 'unitId');
    $collaborator = DB::table('units')->insertGetId(['name' => 'Riset dan Teknologi', 'abbreviation' => 'rizztek', 'type' => 'biro'], 'unitId');
    $author = DB::table('users')->insertGetId(['username' => 'author2', 'password' => bcrypt('secret-password'), 'email' => 'author2@example.test', 'name' => 'Penulis', 'studentNumber' => '87654321']);
    $proker = DB::table('information')->insertGetId([
        'unitId' => $primary,
        'userId' => $author,
        'title' => 'Program Kolaborasi',
        'description' => 'Dua birdept',
        'category' => 'proker',
        'status' => 'published',
        'publishedAt' => now()->subDay(),
    ]);
    DB::table('informationUnits')->insert([
        ['informationId' => $proker, 'unitId' => $collaborator],
    ]);

    $this->get('/birdept/medbrand')->assertOk()->assertSee('Program Kolaborasi');
    $this->get('/birdept/rizztek')->assertOk()->assertSee('Program Kolaborasi');
});

test('scholarship detail exposes requirements and benefits under the public camelCase contract', function () {
    $unit = DB::table('units')->insertGetId(['name' => 'Media Branding', 'abbreviation' => 'medbrand', 'type' => 'biro'], 'unitId');
    $author = DB::table('users')->insertGetId(['username' => 'author3', 'password' => bcrypt('secret-password'), 'email' => 'author3@example.test', 'name' => 'Penulis', 'studentNumber' => '12345679']);
    $id = DB::table('information')->insertGetId([
        'unitId' => $unit, 'userId' => $author, 'title' => 'Beasiswa terbuka',
        'description' => 'Informasi beasiswa', 'category' => 'beasiswa', 'status' => 'published',
        'publishedAt' => now()->subHour(), 'slug' => 'beasiswa-terbuka',
    ]);
    DB::table('scholarships')->insert(['id' => $id, 'posterUrl' => '', 'instagramUrl' => '']);
    DB::table('scholarshipRequirements')->insert(['scholarshipId' => $id, 'requirement' => 'IPK minimum', 'description' => '3,00']);
    DB::table('scholarshipBenefits')->insert(['scholarshipId' => $id, 'benefit' => 'Biaya kuliah', 'description' => 'Penuh']);

    $this->get(route('informasi.show', 'beasiswa-terbuka'))->assertOk();
    $this->get(route('informasi-beasiswa'))->assertOk()->assertSee('Beasiswa terbuka');
    $payload = \App\Models\Informasi::with(['beasiswa.scholarshipRequirements', 'beasiswa.scholarshipBenefits'])
        ->findOrFail($id)->toArray();
    expect($payload['beasiswa']['scholarshipRequirements'][0]['requirement'])->toBe('IPK minimum');
    expect($payload['beasiswa']['scholarshipBenefits'][0]['benefit'])->toBe('Biaya kuliah');
});

test('competition information is visible from publication and exposes its registration details', function () {
    $unit = DB::table('units')->insertGetId(['name' => 'Riset dan Teknologi', 'abbreviation' => 'rizztek', 'type' => 'biro'], 'unitId');
    $author = DB::table('users')->insertGetId(['username' => 'lombaauthor', 'password' => bcrypt('secret-password'), 'email' => 'lombaauthor@example.test', 'name' => 'Penulis', 'studentNumber' => '12345680']);
    $id = DB::table('information')->insertGetId([
        'unitId' => $unit, 'userId' => $author, 'title' => 'Lomba Sains Data',
        'description' => 'Kompetisi mahasiswa', 'category' => 'lomba', 'status' => 'published',
        'publishedAt' => now()->subMinute(), 'expiresAt' => now()->addDay(), 'slug' => 'lomba-sains-data',
    ]);
    DB::table('competitions')->insert([
        'id' => $id, 'organizer' => 'Panitia Sains Data',
        'registrationUrl' => 'https://example.org/daftar', 'opensOn' => '2026-10-07', 'closesOn' => '2026-10-21',
    ]);

    $this->get(route('informasi.show', 'lomba-sains-data'))->assertOk()->assertSee('Panitia Sains Data');
    $this->get(route('home'))->assertOk()->assertSee('Lomba Sains Data');
});

test('SSMI News serves uploaded documentation and hides drafts', function () {
    Storage::fake('informationMedia');
    $unit = DB::table('units')->insertGetId(['name' => 'Media Branding', 'abbreviation' => 'medbrand', 'type' => 'biro'], 'unitId');
    $author = DB::table('users')->insertGetId(['username' => 'imageauthor', 'password' => bcrypt('password'), 'email' => 'image@example.test', 'name' => 'Penulis', 'studentNumber' => '12345670']);
    $base = ['unitId' => $unit, 'userId' => $author, 'description' => 'Dokumentasi acara', 'category' => 'kegiatan', 'publishedAt' => now()->subHour()];
    $published = DB::table('information')->insertGetId($base + ['title' => 'Berita bergambar', 'status' => 'published']);
    $draft = DB::table('information')->insertGetId($base + ['title' => 'Berita draft', 'status' => 'draft']);
    Storage::disk('informationMedia')->put('information/cover.webp', 'RIFFsampleWEBP');
    $image = DB::table('informationImages')->insertGetId(['informationId' => $published, 'storagePath' => 'information/cover.webp', 'originalName' => 'cover.png', 'mimeType' => 'image/webp', 'sizeBytes' => 14, 'width' => 1, 'height' => 1]);
    $draftImage = DB::table('informationImages')->insertGetId(['informationId' => $draft, 'storagePath' => 'information/draft.webp', 'originalName' => 'draft.png', 'mimeType' => 'image/webp', 'sizeBytes' => 14, 'width' => 1, 'height' => 1]);

    $page = $this->get(route('home'))->assertOk();
    preg_match('/data-page="([^"]+)"/', $page->getContent(), $match);
    $props = json_decode(html_entity_decode($match[1], ENT_QUOTES), true)['props'];
    expect($props['news'][0]['imageUrl'])->toBe('/media/information/'.$image);
    $this->get(route('information.image', $image))->assertOk()->assertHeader('Content-Type', 'image/webp');
    $this->get(route('information.image', $draftImage))->assertNotFound();
});

test('SSMI News fills nine slots in category order and applies each display window', function () {
    $this->travelTo(\Carbon\Carbon::parse('2026-09-29 12:00:00', 'Asia/Jakarta'));
    $unit = DB::table('units')->insertGetId(['name' => 'Media Branding', 'abbreviation' => 'medbrand', 'type' => 'biro'], 'unitId');
    $author = DB::table('users')->insertGetId(['username' => 'news_author', 'password' => bcrypt('password'), 'email' => 'news@example.test', 'name' => 'Penulis', 'studentNumber' => '12345671']);
    $add = function (string $title, string $category, $publishedAt, $expiresAt = null) use ($unit, $author): int {
        return DB::table('information')->insertGetId([
            'unitId' => $unit, 'userId' => $author, 'title' => $title,
            'description' => $title, 'category' => $category, 'status' => 'published',
            'publishedAt' => $publishedAt, 'expiresAt' => $expiresAt,
        ]);
    };
    $now = now();
    $prokerIds = [
        $add('Proker satu', 'proker', $now->copy()->addDays(7), $now->copy()->addDays(8)),
        $add('Proker dua', 'proker', $now->copy()->subDays(10), $now->copy()->subDays(5)),
        $add('Proker cadangan', 'proker', $now->copy()->subDay(), $now->copy()->addDays(10)),
    ];
    $add('Kegiatan satu', 'kegiatan', $now->copy()->addDays(7), $now->copy()->addDays(8));
    $add('Kegiatan dua', 'kegiatan', $now->copy()->subDays(2), $now->copy()->subDay());
    $add('Beasiswa satu', 'beasiswa', $now->copy()->addDays(7), $now->copy()->addDays(8));
    $add('Beasiswa dua', 'beasiswa', $now->copy()->subDay(), $now->copy()->addDays(2));
    $add('Lomba satu', 'lomba', $now->copy()->subDay(), $now->copy()->addDay());
    $add('Lomba dua', 'lomba', $now->copy()->subDay(), $now->copy()->addDays(2));
    $add('Alumni cadangan', 'alumni', $now->copy()->subDay(), $now->copy()->addDays(2));
    $add('Proker terlalu awal', 'proker', $now->copy()->addDays(8), $now->copy()->addDays(10));
    $add('Kegiatan lewat', 'kegiatan', $now->copy()->subDays(3), $now->copy()->subDays(2));
    $add('Beasiswa lewat', 'beasiswa', $now->copy()->subDays(3), $now->copy()->subSecond());
    $add('Lomba belum mulai', 'lomba', $now->copy()->addSecond(), $now->copy()->addDay());

    $readNews = function (): array {
        $page = $this->get(route('home'))->assertOk();
        preg_match('/data-page="([^"]+)"/', $page->getContent(), $match);

        return json_decode(html_entity_decode($match[1], ENT_QUOTES), true)['props']['news'];
    };

    $news = $readNews();
    expect($news)->toHaveCount(9);
    expect(collect($news)->countBy('category')->sortKeys()->all())->toBe([
        'beasiswa' => 2, 'kegiatan' => 2, 'lomba' => 2, 'proker' => 3,
    ]);
    expect(collect($news)->pluck('title')->all())->not->toContain('Alumni cadangan');
    foreach (['Proker terlalu awal', 'Kegiatan lewat', 'Beasiswa lewat', 'Lomba belum mulai'] as $hiddenTitle) {
        expect(collect($news)->pluck('title')->all())->not->toContain($hiddenTitle);
    }
    $this->get(route('informasi.show', (string) $prokerIds[0]))->assertOk();
    $this->get(route('informasi.show', (string) $prokerIds[1]))->assertOk();

    $add('Wisuda satu', 'wisuda', $now->copy()->addDays(7), $now->copy()->addDays(8));
    $news = $readNews();
    expect(collect($news)->countBy('category')->sortKeys()->all())->toBe([
        'beasiswa' => 2, 'kegiatan' => 2, 'lomba' => 2, 'proker' => 2, 'wisuda' => 1,
    ]);
});

test('proker priority orders the home cards and SSMI News', function () {
    $unit = DB::table('units')->insertGetId(['name' => 'Media Branding', 'abbreviation' => 'medbrand', 'type' => 'biro'], 'unitId');
    $author = DB::table('users')->insertGetId(['username' => 'priority_author', 'password' => bcrypt('password'), 'email' => 'priority@example.test', 'name' => 'Penulis', 'studentNumber' => '12345672']);

    foreach ([['Proker biasa', null], ['Proker ketiga', 3], ['Mega proker', 1]] as [$title, $priority]) {
        $id = DB::table('information')->insertGetId([
            'unitId' => $unit, 'userId' => $author, 'title' => $title,
            'description' => $title, 'category' => 'proker', 'status' => 'published',
            'publishedAt' => now()->subDay(), 'expiresAt' => now()->addWeek(),
        ]);
        DB::table('workPrograms')->insert(['id' => $id, 'priority' => $priority]);
    }
    foreach (['kegiatan' => 2, 'wisuda' => 1, 'beasiswa' => 2, 'lomba' => 2] as $category => $count) {
        for ($index = 1; $index <= $count; $index++) {
            DB::table('information')->insert([
                'unitId' => $unit, 'userId' => $author, 'title' => "{$category} {$index}",
                'description' => $category, 'category' => $category, 'status' => 'published',
                'publishedAt' => now()->subDay(), 'expiresAt' => now()->addWeek(),
            ]);
        }
    }

    $page = $this->get(route('home'))->assertOk();
    preg_match('/data-page="([^"]+)"/', $page->getContent(), $match);
    $props = json_decode(html_entity_decode($match[1], ENT_QUOTES), true)['props'];

    expect(collect($props['prokers'])->pluck('title')->all())->toBe(['Mega proker', 'Proker ketiga', 'Proker biasa']);
    expect(collect($props['news'])->where('category', 'proker')->pluck('title')->all())->toBe(['Mega proker', 'Proker ketiga']);
    expect($props['prokers'][0]['proker']['priority'])->toBe(1);
});
