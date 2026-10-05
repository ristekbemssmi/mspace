import InformationCategoryPage, { informationCategoryLayout, type CategoryItem } from '@/Components/InformationCategoryPage';

export default function InformasiBeasiswa({ items = [] }: { items?: CategoryItem[] }) {
    return (
        <InformationCategoryPage
            title="Informasi Beasiswa"
            introduction="Temukan kesempatan beasiswa terbaru untuk mahasiswa SSMI. Pilih beasiswa untuk melihat persyaratan, manfaat, dan cara pendaftarannya."
            searchLabel="Cari beasiswa..."
            items={items}
            fields={[
                { key: 'organizer', label: 'Penyelenggara' },
                { key: 'opensOn', label: 'Pendaftaran dibuka', format: 'date' },
                { key: 'closesOn', label: 'Pendaftaran ditutup', format: 'date' },
            ]}
            headerLink={{ href: 'https://studentportal.ipb.ac.id', label: 'Menuju Student Portal' }}
        />
    );
}

InformasiBeasiswa.layout = informationCategoryLayout;
