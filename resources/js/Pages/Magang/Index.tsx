import InformationCategoryPage, { informationCategoryLayout, type CategoryItem } from '@/Components/InformationCategoryPage';

export default function Magang({ items = [] }: { items?: CategoryItem[] }) {
    return (
        <InformationCategoryPage
            title="Informasi Magang"
            introduction="Jelajahi peluang magang yang relevan bagi mahasiswa SSMI dan baca rincian posisi sebelum mendaftar."
            searchLabel="Cari peluang magang..."
            items={items}
            fields={[
                { key: 'company', label: 'Perusahaan' },
                { key: 'position', label: 'Posisi' },
                { key: 'duration', label: 'Durasi' },
            ]}
        />
    );
}

Magang.layout = informationCategoryLayout;
