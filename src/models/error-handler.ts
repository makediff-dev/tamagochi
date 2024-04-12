import { EActionNames } from '@prisma/client';

export class ErrorHandler {
    static getActionNameError(action: string): string | null {
        if (!Object.values(EActionNames).some(name => name === action)) {
            return `Invalid action name. Should be one of ${Object.values(EActionNames).join(', ')}`;
        }
        return null;
    }
}
