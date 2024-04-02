import { BetaSignup } from '@/components/landing/BetaSignup';
import NavbarInner from '@/components/landing/Navbar';

import { Card, CardContent } from '@/components/ui/card';

export default function Enroll() {
  return (
    <>
      <NavbarInner />
      <div className="h-screen flex justify-center items-center">
        <div>
          <Card>
            <CardContent className="py-0">
              <p>
                <BetaSignup />
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
