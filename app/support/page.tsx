import Image from 'next/image';
import heroImg from '@/app/public/images/nuggets-logo-transparent.png';
import Container from '@/components/landing/Container';
import Footer from '@/components/landing/Footer';
import NavbarInner from '@/components/landing/Navbar';

const benefitOne = {
  title: 'How can Nuggets help you?',
  // desc: "You can use this space to highlight your first benefit or a feature of your product. It can also contain an image or Illustration like in the example along with some bullet points.",
  image: '/public/images/nuggets-logo.png',
  bullets: [
    {
      title: 'Agenda Tracking',
      desc: 'No more short/long disovery, endless demo monologue and forgotten next steps',
      // icon: <CheckCircleIcon />
    },
    {
      title: 'Follow up-scheduler',
      desc: 'Easily schedule a follow-up meting post every call with an integrated time-zone manager',
      // icon: <CursorClickIcon />
    },
    {
      title: 'Battle Cards',
      desc: 'Win more deals agains competition by laying the perfect trap.',
      // icon: <ChartSquareBarIcon />
    },
  ],
};

export default async function Index() {
  return (
    <>
      <NavbarInner />

      <Container className="flex flex-wrap pt-32 pb-48">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="font-bitter text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Nuggets support
            </h1>
            <p className="font-bitter font-semibold py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              If you need support, please contact us at{' '}
              <a
                href="mailto:support@getnuggets.io"
                className="underline  hover:text-brand-pink visited:text-purple-600"
              >
                support@getnuggets.io
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              height="300"
              alt="Hero Illustration"
              layout="intrinsic"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>

      <Footer />
    </>
  );
}
