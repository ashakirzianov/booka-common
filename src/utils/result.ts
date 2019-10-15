import {
    Fail, Success,
    Diagnostic, SimpleDiagnostic, CompoundDiagnostic, Severity,
} from '../model';

export function filterSeverity(diag: Diagnostic, ...severities: Severity[]): Diagnostic {
    if (diag === undefined) {
        return diag;
    } else if (isCompoundDiagnostic(diag)) {
        return compoundDiagnostic(diag.map(d => filterSeverity(d, ...severities)));
    } else {
        const toTest = diag.severity ?? 'error';
        return severities.some(s => s === toTest)
            ? diag
            : undefined;
    }
}

export function compoundDiagnostic(diags: Diagnostic[]): Diagnostic {
    const result = diags.reduce<SimpleDiagnostic[]>(
        (all, one) => {
            if (isCompoundDiagnostic(one)) {
                all.push(...one);
            } else if (one !== undefined) {
                all.push(one);
            }
            return all;
        },
        []);
    return result.length === 0 ? undefined
        : result.length === 1 ? result[0]
            : result;
}

export function isEmptyDiagnostic(diag: Diagnostic): boolean {
    if (diag === undefined) {
        return true;
    } else if (isCompoundDiagnostic(diag)) {
        return diag.every(isEmptyDiagnostic);
    } else {
        return diag.severity === 'info';
    }
}

export function isCompoundDiagnostic(d: Diagnostic): d is CompoundDiagnostic {
    return Array.isArray(d);
}

export function failure(reason?: Diagnostic): Fail {
    return { success: false, diagnostic: reason };
}

export function success<Out>(value: Out, diagnostic?: Diagnostic): Success<Out> {
    return {
        success: true,
        value, diagnostic,
    };
}
