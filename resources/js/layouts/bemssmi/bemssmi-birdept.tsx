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
      <div className="bg-linear-to-b from-[#324879] to-[#1E2E50] p-2 sm:p-8 aspect-square flex items-center justify-center m-2 rounded-xl">
        <img
          src={imageSrc || "/api/placeholder/150/150"}
          alt={name}
          className="w-full h-40 sm:h-52 object-contain"
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

interface BemBirdeptComponentProps {
  birdepts?: any[];
}

export default function BemBirdept({ birdepts = [] }: BemBirdeptComponentProps) {

  return (
    <section id="ssmi-misi" className="w-full h-min-screen flex flex-col items-start justify-center p-10 md:p-16 mt-16 md:m-0">
      <div className="w-full p-16 pt-48 text-center font-helvetica font-bold">
        <div className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-2xl md:text-5xl pb-2 leading-none sm:leading-relaxed">
          Biro dan Departemen BEM SSMI <br className="hidden md:block" />
          Kabinet Langkah Berdikari
        </div>
        <p className="text-lg md:text-2xl text-[#F1F5FF] font-normal mt-4 leading-none sm:leading-relaxed">
          BEM SSMI terdiri dari berapa biro dan berapa departemen
        </p>
      </div>
      <div className="container mx-auto">
        {/* Container Grid: 1 kolom di HP, 2 di Tablet, 3 di Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-stretch">
          {Array.isArray(birdepts) && birdepts.length > 0 ? (
            birdepts.map((member, index) => {
              const roleName = member?.jenis === 'biro' ? 'Biro ' : 'Departemen ';
              const roleDesc = member?.nama_birdept ? member.nama_birdept : roleName + (member?.nama_panggilan || '');

              return (
                <BemBirdeptCard
                  key={member?.idbirdept || index}
                  name={member?.nama_panggilan || 'Nama Tidak Tersedia'}
                  role={roleDesc}
                  imageSrc={member?.idbirdept ? `./img/birdept-logo/${member.idbirdept}.svg` : ""}
                />
              );
            })
          ) : (
            <div className="col-span-2 lg:col-span-3 text-center text-white py-10 overflow-auto">
              <p>Belum ada data biro & departemen (atau format data salah).</p>
              <pre className="text-left text-xs bg-black/50 p-4 mt-4 rounded-lg">
                {JSON.stringify(birdepts, null, 2)}
              </pre>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}