import InformationCategoryPage, { informationCategoryLayout, type CategoryItem } from '@/Components/InformationCategoryPage';

export default function Alumni({ items = [] }: { items?: CategoryItem[] }) {
    return (
        <InformationCategoryPage
            title="Informasi Alumni"
            introduction="Kenali cerita, pengalaman, dan kabar alumni SSMI. Temukan inspirasi dari perjalanan mereka setelah kuliah."
            searchLabel="Cari alumni..."
            items={items}
            fields={[
                { key: 'name', label: 'Nama alumni' },
                { key: 'cohort', label: 'Angkatan' },
                { key: 'topic', label: 'Topik' },
            ]}
        />
    );
}

Alumni.layout = informationCategoryLayout;
