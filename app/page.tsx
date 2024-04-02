import Benefits from '@/components/landing/Benefits';
import { BetaSignup } from '@/components/landing/BetaSignup';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import Navbar from '@/components/landing/Navbar';

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
      <Navbar />

      <Hero />

      <Benefits data={benefitOne} />

      <BetaSignup />

      <Footer />
    </>
  );
}
