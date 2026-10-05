import InformationCategoryPage, { informationCategoryLayout, type CategoryItem } from '@/Components/InformationCategoryPage';

export default function Kegiatan({ items = [] }: { items?: CategoryItem[] }) {
    return (
        <InformationCategoryPage
            title="Informasi Kegiatan SSMI"
            introduction="Ikuti agenda, acara, dan aktivitas terbaru dari BEM SSMI. Pilih kegiatan untuk melihat informasi lengkap dan dokumentasinya."
            searchLabel="Cari kegiatan..."
            items={items}
            fields={[
                { key: 'eventAt', label: 'Waktu kegiatan', format: 'datetime' },
                { key: 'location', label: 'Lokasi' },
                { key: 'organizer', label: 'Penyelenggara' },
            ]}
        />
    );
}

Kegiatan.layout = informationCategoryLayout;
