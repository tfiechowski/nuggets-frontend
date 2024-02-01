export type ValidationResult = { error?: string };

export interface RuleValidator {
  validate(): Promise<{ error?: string }>;
}

export class Validator {
  constructor(private validators: RuleValidator[]) {}

  async validate(): Promise<{ error?: string }> {
    for (const validator of this.validators) {
      const result = await validator.validate();
      if (result.error) {
        return result;
      }
    }
    return {};
  }
}

export type IRuleValidator = () => Promise<{ error?: string }>;
export type IFunctionalRuleValidator = (...args: any[]) => IRuleValidator;

export class FunctionalValidator {
  constructor(private validators: Array<IRuleValidator>) {
    this.validators = validators;
  }

  async validate(): Promise<ValidationResult> {
    for (const validator of this.validators) {
      const result = await validator();
      if (result.error) {
        return result;
      }
    }
    return {};
  }
}
