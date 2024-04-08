'use client';

import PlaybookDisplay from '@/app/call/[callId]/PlaybooksDisplay';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Playbook } from '@prisma/client';

function Playbook({
  playbook,
  onChange,
}: {
  playbook: Playbook;
  onChange: (playbookId: string, content: string) => void;
}) {
  return (
    <div>
      <PlaybookDisplay
        initialContent={JSON.parse(playbook.content)}
        onChange={(content: string) => onChange(playbook.id, content)}
      />
    </div>
  );
}

export function Playbooks({
  playbooks,
  onUpdate,
}: {
  playbooks: Array<Playbook>;
  onUpdate: (id: string, content: string) => Promise<void>;
}) {
  console.log('🚀 ~ playbooks:', playbooks);
  return (
    <div>
      <div>
        <Accordion type="single" collapsible>
          {playbooks.map((playbook) => (
            <div className="p-2" key={playbook.id}>
              <AccordionItem value={playbook.id}>
                <AccordionTrigger>{playbook.title}</AccordionTrigger>
                <AccordionContent>
                  <Playbook playbook={playbook} onChange={onUpdate} />
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
