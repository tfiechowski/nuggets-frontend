import Benefits from '@/components/landing/Benefits';
import { BetaSignup } from '@/components/landing/BetaSignup';
import Container from '@/components/landing/Container';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import Navbar from '@/components/landing/Navbar';
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

      <Hero />

      <Benefits data={benefitOne} />

      <div className="flex h-full w-full landing-dark-background py-8">
        <Container className="flex flex-wrap mb-20 lg:gap-10 lg:flex-nowrap justify-center">
          <BetaSignup dark />
        </Container>
      </div>

      <Footer />
    </>
  );
}
