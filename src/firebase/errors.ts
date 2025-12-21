export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
    requestResourceData?: any;
  };
  
  export class FirestorePermissionError extends Error {
    public readonly context: SecurityRuleContext;
  
    constructor(context: SecurityRuleContext) {
      const message = `Firestore Permission Denied: You do not have permission to ${context.operation} on the document at '${context.path}'.`;
      super(message);
      this.name = 'FirestorePermissionError';
      this.context = context;
  
      // This is for V8's stack trace API
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, FirestorePermissionError);
      }
    }
  
    toString() {
      return `${this.name}: ${this.message}\n\nContext:\n${JSON.stringify(this.context, null, 2)}`;
    }
  }
  