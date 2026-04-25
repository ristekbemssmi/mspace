import React from 'react';

// 1. Interface untuk tipe data props
interface BirdeptProps {
  name: string;
  role: string;
  imageSrc: string;
}

// 2. Komponen kartu (Reusable) dengan tipe data BirdeptProps
const BemBirdeptCard = ({ name, role, imageSrc }: BirdeptProps) => {
  return (
    <div className="bg-linear-to-b from-white to-[#F4E06D] rounded-2xl overflow-hidden shadow-lg flex flex-col w-full max-w-70 mx-auto">
      {/* Bagian Atas: Gambar/Logo dengan background Gelap */}
      <div className="bg-linear-to-b from-[#324879] to-[#1E2E50] p-8 aspect-square flex items-center justify-center m-2 rounded-xl">
        <img 
          src={imageSrc || "/api/placeholder/150/150"} 
          alt={name} 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Bagian Bawah: Nama dan Jabatan */}
      <div className="px-4 py-3 text-left">
        <h3 className="text-[#1a2b4b] font-bold text-xl leading-tight">{name}</h3>
        <p className="text-[#1a2b4b] text-sm font-medium opacity-90">{role}</p>
      </div>
    </div>
  );
};

export default function BemBirdept() {
  // 3. Variabel data yang konsisten (BirdeptProps[])
  const birdeptMembers: BirdeptProps[] = [
    {
        name: "BPH",
        role: "Badan Pengurus Harian",
        imageSrc: "./img/birdept-logo/bph.svg"
    },
    {
      name: "Rizztekz",
      role: "Biro Riset dan Teknologi",
      imageSrc: "./img/birdept-logo/ristek.svg"
    },
    {
      name: "Eksmit",
      role: "Biro Eksternal, Bisnis, dan Kemitraan",
      imageSrc: "./img/birdept-logo/eksmit.svg"
    },
    {
      name: "Imbang",
      role: "Biro Internal dan Pengembangan",
      imageSrc: "./img/birdept-logo/imbang.svg"
    },
    {
      name: "Medbrand",
      role: "Biro Internal dan Pengembangan",
      imageSrc: "./img/birdept-logo/medbrand.svg"
    },
    {
      name: "Adkesmah",
      role: "Departemen Advokasi dan Kesejahteraan Mahasiswa",
      imageSrc: "./img/birdept-logo/adkesmah.svg"
    },
    {
      name: "Akpres",
      role: "Departemen Akademik dan Prestasi",
      imageSrc: "./img/birdept-logo/akpres.svg"
    },
    {
      name: "Kastrat",
      role: "Departemen Kajian dan Aksi Strategis",
      imageSrc: "./img/birdept-logo/kastrat.svg"
    },
    {
      name: "Olahraga",
      role: "Departemen Olahraga",
      imageSrc: "./img/birdept-logo/olahraga.svg"
    },
    {
      name: "Senbud",
      role: "Departemen Seni Budaya",
      imageSrc: "./img/birdept-logo/senbud.svg"
    },
    {
      name: "Sosling",
      role: "Departemen Sosial dan Lingkungan",
      imageSrc: "./img/birdept-logo/sosling.svg"
    },
    {
      name: "PSDMK",
      role: "Departemen Pengembangan Sumber Daya Mahasiswa dan Karir",
      imageSrc: "./img/birdept-logo/psdmk.svg"
    }
  ];

  return (
    <section id="ssmi-misi" className="w-full h-min-screen flex flex-col items-start justify-center p-5 md:p-16 mt-16 md:m-0">
        <div className="w-full p-16 pt-48 text-center font-helvetica font-bold">
            <div className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-2xl md:text-5xl pb-2">
                Biro dan Departemen BEM SSMI <br className="hidden md:block"/>
                Kabinet Langkah Berdikari
            </div>
            <p className="text-lg md:text-2xl text-[#F1F5FF] font-normal mt-4">
                BEM SSMI terdiri dari berapa biro dan berapa departemen
            </p>        
        </div>
        <div className="container mx-auto">
        {/* Container Grid: 1 kolom di HP, 2 di Tablet, 3 di Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {birdeptMembers.map((member, index) => (
            <BemBirdeptCard 
              key={index}
              name={member.name}
              role={member.role}
              imageSrc={member.imageSrc}
            />
          ))}
        </div>

      </div>
    </section>
  );
}