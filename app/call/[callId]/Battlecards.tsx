'use client';

import { ReadOnlyEditor } from '@/app/app/core/competitors/Editor';
import { BattlecardsService } from '@/app/utils/server/BattlecardsService';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CustomerCall } from '@prisma/client';

export function Battlecards({
  call,
  battlecards,
}: {
  call: CustomerCall;
  battlecards: Awaited<ReturnType<typeof BattlecardsService.listBattlecards>>;
}) {
  console.log('Debug: ', call);

  return (
    <div>
      <div>
        <Accordion type="single" collapsible>
          {battlecards.map((battlecard) => (
            <div className="p-2" key={battlecard.id}>
              <AccordionItem value={battlecard.id}>
                <AccordionTrigger>{battlecard.competitor.name}</AccordionTrigger>
                <AccordionContent>
                  <ReadOnlyEditor initialContent={battlecard.content} />
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
