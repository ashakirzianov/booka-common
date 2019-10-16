export type Severity =
    | 'error'
    | 'info'
    | 'warning'
    ;

export type EmptyDiagnostic = undefined;
export type CustomDiagnostic = {
    diag: string,
    severity?: Severity, // NOTE: treat undefined as 'error'
    [key: string]: any,
};

export type SimpleDiagnostic = CustomDiagnostic | EmptyDiagnostic;
export type CompoundDiagnostic = SimpleDiagnostic[];

export type Success<Out> = {
    success: true,
    value: Out,
    diagnostic?: Diagnostic,
};
export type Fail = {
    success: false,
    diagnostic?: Diagnostic,
};
export type Result<Out> = Success<Out> | Fail;

export type Diagnostic = SimpleDiagnostic | CompoundDiagnostic;
