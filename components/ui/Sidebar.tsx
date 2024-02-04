import { cn } from '@/lib/utils';
import { Button } from '@/registry/new-york/ui/button';
import NuggetsLogo from '@/app/public/images/nuggets-logo.png';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

export type Playlist = (typeof playlists)[number];

export const playlists = [
  'Recently Added',
  'Recently Played',
  'Top Songs',
  'Top Albums',
  'Top Artists',
  'Logic Discography',
  'Bedtime Beats',
  'Feeling Happy',
  'I miss Y2K Pop',
  'Runtober',
  'Mellow Days',
  'Eminem Essentials',
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

function Header() {
  return (
    <div className="flex flex-row py-2 items-center">
      <Avatar className="w-8 h-8">
        <AvatarImage asChild src={NuggetsLogo.src}>
          <Image src={NuggetsLogo.src} width={32} height={32} alt="XD" />
        </AvatarImage>
        <AvatarFallback>N</AvatarFallback>
      </Avatar>

      <h2 className="px-4 text-lg font-semibold tracking-tight">Nuggets</h2>
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn('pb-12 flex', className)}>
      <div className="grow flex flex-col space-y-4 py-4">
        <div className="px-3 py-2">
          <Header />

          <div className="space-y-1">
            <Link href="/app/core/competitors">
              <Button variant="ghost" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Competetive notes
              </Button>
            </Link>

            <Link href="/app/core/calls">
              <Button variant="ghost" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Calls
              </Button>
            </Link>

            {/* See more example items here at https://github.com/shadcn-ui/ui/blob/f859d4857eab19989cb01582775f21d6ef91c5b4/apps/www/app/examples/music/components/sidebar.tsx */}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Team</h2>
          <div className="space-y-1">
            <Link href="/app/team/manage">
              <Button variant="ghost" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6" />
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  <path d="M12 12H3" />
                  <path d="M16 6H3" />
                  <path d="M12 18H3" />
                </svg>
                Manage
              </Button>
            </Link>
            <Link href="/app/team/members">
              <Button variant="ghost" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <circle cx="8" cy="18" r="4" />
                  <path d="M12 18V2l7 4" />
                </svg>
                Members
              </Button>
            </Link>
          </div>
        </div>
        <div className="grow px-3 py-2" />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Account</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="8" cy="18" r="4" />
                <path d="M12 18V2l7 4" />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
