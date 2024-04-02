'use client';

import { playbookReducer, togglePlaybookStep } from '@/app/call/[callId]/playbooksReducer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Playbook } from '@prisma/client';
import { orderBy } from 'lodash';
import { useEffect, useReducer } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

function Playbook({
  playbook,
  onToggle,
}: {
  playbook: Playbook;
  onToggle: (playbookId: string, content: string) => void;
}) {
  const [state, dispatch] = useReducer(playbookReducer, {
    id: playbook.id,
    title: playbook.title,
    steps: JSON.parse(playbook.content),
  });
  const debouncedOnToggle = useDebounceCallback(onToggle, 500);

  const handleToggle = (stepId: string) => {
    dispatch(togglePlaybookStep(stepId));
  };

  useEffect(() => {
    console.log('Playbook - call debounced update');
    debouncedOnToggle(playbook.id, JSON.stringify(state.steps));
  }, [state]);

  return (
    <div>
      {orderBy(Object.values(state.steps), 'id').map((step) => (
        <div key={step.id}>
          <div className="flex items-center space-x-2 py-1">
            <Checkbox
              id={`step-${step.id}`}
              checked={step.done}
              onCheckedChange={() => handleToggle(step.id)}
            />
            <label
              htmlFor={`step-${step.id}`}
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {step.name}
            </label>
          </div>
        </div>
      ))}
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
  return (
    <div>
      <div>
        <Accordion type="single" collapsible>
          {playbooks.map((playbook) => (
            <div className="p-2" key={playbook.id}>
              <AccordionItem value={playbook.id}>
                <AccordionTrigger>{playbook.title}</AccordionTrigger>
                <AccordionContent>
                  <Playbook playbook={playbook} onToggle={onUpdate} />
                  {/* <ReadOnlyEditor initialContent={playbook.content} /> */}
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
