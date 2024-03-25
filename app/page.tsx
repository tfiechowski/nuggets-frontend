import Benefits from '@/components/landing/Benefits';
import { BetaSignup } from '@/components/landing/BetaSignup';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import Navbar from '@/components/landing/Navbar';
import SectionTitle from '@/components/landing/SectionTitle';
import { createClient } from '@/utils/supabase/server';
import Head from 'next/head';
import { cookies } from 'next/headers';

// import { useAccounts} from "@usebasejump/next";

const benefitOne = {
  title: 'How Nuggets can help you?',
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
  const cookieStore = cookies();

  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <>
      <Navbar />

      <Hero />
      <SectionTitle
        pretitle="Nuggets Benefits"
        title="Increase your win rate by 20% with Nuggets AI Sales Assistant"
      />
      <Benefits data={benefitOne} />

      <BetaSignup />

      <Footer />
    </>
  );
}
