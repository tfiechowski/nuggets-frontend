'use client';

import { PopupOpener } from '@/app/popup/[callId]/PopupOpener';

export default function Page({ params }: { params: { callId: string } }) {
  const link = window.location.origin + `/call/${params.callId}`;

  return <PopupOpener link={link} />;
}
