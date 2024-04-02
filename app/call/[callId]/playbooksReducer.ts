// Define the type definitions
export type PlaybookStep = {
  id: string;
  name: string;
  done: boolean;
};

export type PlaybookState = {
  id: string;
  title: string;
  steps: Record<string, PlaybookStep>;
};

// Define action types
const TOGGLE_PLAYBOOK_STEP = 'TOGGLE_PLAYBOOK_STEP' as const;

// Define action creators
export const togglePlaybookStep = (stepId: string) => ({
  type: TOGGLE_PLAYBOOK_STEP,
  payload: { stepId },
});

// Define reducer function
export const playbookReducer: React.Reducer<PlaybookState, PlaybookAction> = (state, action) => {
  switch (action.type) {
    case TOGGLE_PLAYBOOK_STEP: {
      const { stepId } = action.payload;

      // Clone the state to ensure immutability
      const updatedSteps = { ...state.steps };

      // Find the specified step
      const step = updatedSteps[stepId];

      // If the step doesn't exist, return current state
      if (!step) return state;

      // Toggle the 'done' field of the step
      const updatedStep = { ...step, done: !step.done };

      // Update the steps with the modified step
      const updatedState = {
        ...state,
        steps: {
          ...updatedSteps,
          [stepId]: updatedStep,
        },
      };

      return updatedState;
    }
    default:
      return state;
  }
};

// Define the union type for actions
type PlaybookAction = ReturnType<typeof togglePlaybookStep>;
