// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({
    status,
    deliveryAvailable,
}: {
    status?: string;
    deliveryAvailable: boolean;
}) {
    return (
        <>
            <Head title="Verifikasi email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Tautan verifikasi baru telah dikirim ke email Anda.
                </div>
            )}

            {!deliveryAvailable && (
                <p role="alert" className="mb-4 text-center text-sm text-amber-200">
                    Pengiriman email sementara belum tersedia. Hubungi Admin
                    sebelum meminta tautan verifikasi baru.
                </p>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing || !deliveryAvailable} variant="secondary">
                            {processing && <Spinner />}
                            Kirim ulang email verifikasi
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            Keluar
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifikasi email',
    description:
        'Buka tautan yang kami kirim ke email Anda sebelum melanjutkan.',
};
