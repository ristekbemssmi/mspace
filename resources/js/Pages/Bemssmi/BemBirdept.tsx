import React, { useState } from 'react';
import Modal from '@/Layouts/Modal';

interface BirdeptProps {
  name: string;
  role: string;
  imageSrc: string;
  onClick?: () => void;
}

const BemBirdeptCard = ({ name, role, imageSrc, onClick }: BirdeptProps) => {
  return (
    <div
      className="bg-linear-to-b from-white to-[#F4E06D] rounded-2xl overflow-hidden shadow-lg flex flex-col w-full max-w-70 mx-auto my-2 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="bg-linear-to-b from-[#324879] to-[#1E2E50] aspect-square flex items-center justify-center m-2 rounded-xl">
        <img
          src={imageSrc || "/api/placeholder/150/150"}
          alt={name}
          width="300"
          height="300"
          loading="lazy"
          className="w-full h-40 sm:h-72 object-contain"
        />
      </div>

      <div className="px-3 pb-5 text-left">
        <h3 className="text-[#19243A] font-bold text-lg md:text-3xl leading-tight">{name}</h3>
        <p className="text-lg sm:text-xl md:text-xl text-[#19243A] font-helvetica leading-5 sm:leading-5">{role}</p>
      </div>
    </div>
  );
};

interface BemBirdeptComponentProps {
  birdepts?: any[];
}

export default function BemBirdept({ birdepts = [] }: BemBirdeptComponentProps) {
  const [selectedBirdept, setSelectedBirdept] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (member: any) => {
    setSelectedBirdept(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBirdept(null);
  };

  return (
    <section id="ssmi-birdept" className="h-min-screen flex flex-col items-start justify-center layout">
      <div className="w-full pb-10">
        <div className="text-center title">
          Biro dan Departemen BEM SSMI <br className="hidden md:block" />
          Kabinet Langkah Berdikari
        </div>
        <p className="text-center paragraf">
          BEM SSMI terdiri dari beberapa biro dan departemen.
        </p>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:px-20 justify-items-center">
          {Array.isArray(birdepts) && birdepts.length > 0 ? (
            birdepts.map((member, index) => {
              const roleName = member?.jenis === 'biro' ? 'Biro ' : 'Departemen ';
              const roleDesc = member?.nama_birdept ? member.nama_birdept : roleName + (member?.nama_panggilan || '');

              return (
                <BemBirdeptCard
                  key={member?.idbirdept || index}
                  name={member?.nama_panggilan || 'Nama Tidak Tersedia'}
                  role={roleDesc}
                  imageSrc={member?.idbirdept ? `/img/birdept-logo/${member.idbirdept}.svg` : ""}
                  onClick={() => handleCardClick(member)}
                />
              );
            })
          ) : (
            <div className="col-span-2 lg:col-span-3 text-center text-white py-10 overflow-auto">
              <p className="paragraf">Belum ada data biro & departemen (atau format data salah).</p>
              <pre className="text-left text-xs bg-black/50 p-4 mt-4 rounded-lg">
                {JSON.stringify(birdepts, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedBirdept?.nama_panggilan || 'Detail'}
      >
        {selectedBirdept && (
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="bg-linear-to-b from-[#324879] to-[#1E2E50] rounded-xl flex w-full sm:w-2/3 lg:w-2/3 justify-center">
              <div className="bg-[url(/img/bg-modal.svg)]">
                <img
                  src={selectedBirdept?.idbirdept ? `/img/birdept-logo/${selectedBirdept.idbirdept}.svg` : "/api/placeholder/150/150"}
                  alt={selectedBirdept?.nama_panggilan}
                  width="400"
                  height="400"
                  className="w-full object-contain"
                />
              </div>
            </div>
            <div className="w-full self-start px-8 pr-6">
              <h4 className="title-dark">
                <span className="font-extrabold">{selectedBirdept?.jenis === 'bph' ? 'BPH' : selectedBirdept?.jenis.charAt(0).toUpperCase() + selectedBirdept?.jenis.slice(1)}</span>
                <br />
                <span className="subtitle-dark">{selectedBirdept?.nama_birdept}</span>
              </h4>
              {selectedBirdept?.deskripsi ? (
                <p className="text-justify text-base sm:text-lg md:text-lg whitespace-pre-wrap">
                  {selectedBirdept.deskripsi}
                </p>
              ) : (
                <p className="text-justify text-base sm:text-lg md:text-lg">
                  Tidak ada deskripsi tersedia.
                </p>
              )}
              <div className="mt-6">
                <a
                  href={`/birdept/${selectedBirdept.nama_panggilan?.toLowerCase()}#proker-section`}
                  className="inline-block bg-[#1D2B44] hover:bg-[#2A3F63] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md text-sm cursor-pointer"
                >
                  Program Kerja
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
