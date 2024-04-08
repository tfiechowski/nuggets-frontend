'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import './styles.css';
import { useDebounceCallback } from 'usehooks-ts';
import { TreeNode } from '@/app/call/[callId]/types';

export function PlaybookItem({
  onChange,
  checked,
  label,
}: {
  onChange: any;
  checked: boolean;
  label: string;
}) {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id="terms1" onClick={onChange} checked={checked} />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {/* <p className="text-sm text-muted-foreground">
          You agree to our Terms of Service and Privacy Policy.
        </p> */}
      </div>
    </div>
  );
}

// Define the CheckboxTree component
const CheckboxTree = ({ data }: { data: Array<TreeNode> }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  console.log('🚀 ~ CheckboxTree ~ checkedItems:', checkedItems);
  console.log('🚀 ~ CheckboxTree ~ checkedItems:', JSON.stringify(checkedItems));

  // Function to toggle the checked state of a checkbox
  const toggleCheckbox = (itemId: string) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  // Recursive function to render tree nodes
  const renderTreeNodes = (nodes: Array<any>) => {
    return nodes.map((node: any) =>
      node.children.length > 0 ? (
        <div key={node.id}>
          <Collapsible>
            <div className="flex items-center space-x-4 px-4">
              <h4 className="text-sm font-semibold">{node.label}</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>

            {/* <CollapsibleTrigger>
              <div className="playbook-header">{node.label}</div>
            </CollapsibleTrigger> */}
            <CollapsibleContent>
              <div className="playbook-children">
                {renderTreeNodes(node.children)}
                {node.tip && <div className="py-2 italic text-sm">{node.tip}</div>}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : (
        <div className="playbook-item py-1">
          <PlaybookItem
            checked={checkedItems[node.id] || false}
            onChange={() => toggleCheckbox(node.id)}
            label={node.label}
          />
        </div>
      )
    );
  };

  return <div>{renderTreeNodes(data)}</div>;
};

export default function PlaybookDisplay({
  initialContent,
  onChange,
}: {
  initialContent: { content: Array<TreeNode>; checkedItems: Record<string, boolean> };
  onChange: (content: string) => void;
}) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    initialContent.checkedItems
  );

  const debouncedOnChange = useDebounceCallback(onChange, 500);

  useEffect(() => {
    debouncedOnChange(JSON.stringify({ content: initialContent.content, checkedItems }));
  }, [checkedItems]);

  // Function to toggle the checked state of a checkbox
  const toggleCheckbox = (itemId: string) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  // Recursive function to render tree nodes
  const renderTreeNodes = (nodes: Array<any>) => {
    return nodes.map((node: any) =>
      node.children.length > 0 ? (
        <div key={node.id}>
          <Collapsible>
            <div className="flex items-center space-x-4 px-4">
              <h4 className="text-sm font-semibold">{node.label}</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="playbook-children">
                {renderTreeNodes(node.children)}
                {node.tip && <div className="py-2 italic text-sm">{node.tip}</div>}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : (
        <div className="playbook-item py-1">
          <PlaybookItem
            checked={checkedItems[node.id] || false}
            onChange={() => toggleCheckbox(node.id)}
            label={node.label}
          />
        </div>
      )
    );
  };

  return <div className="playbooks-tree">{renderTreeNodes(initialContent.content)}</div>;
}
