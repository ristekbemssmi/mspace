import InformationCategoryPage, { informationCategoryLayout, type CategoryItem } from '@/Components/InformationCategoryPage';

export default function Wisuda({ items = [] }: { items?: CategoryItem[] }) {
    return (
        <InformationCategoryPage
            title="Informasi Wisuda"
            introduction="Lihat pengumuman periode wisuda, alur pendaftaran, dan pembaruan penting bagi calon wisudawan SSMI."
            searchLabel="Cari informasi wisuda..."
            items={items}
            fields={[
                { key: 'graduationPeriod', label: 'Periode wisuda' },
                { key: 'registrationSteps', label: 'Alur pendaftaran' },
            ]}
        />
    );
}

Wisuda.layout = informationCategoryLayout;
