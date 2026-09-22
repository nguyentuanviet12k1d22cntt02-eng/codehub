import { z } from 'zod';

export const specificationSchema = z.object({
    language: z.enum(['python', 'javascript', 'cpp', 'sql']),
    target_concept: z.string().min(1),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'CHALLENGE']),
    execution: z.object({
        mode: z.enum(['function', 'stdio', 'sql']),
        entrypoint: z.string().regex(/^[A-Za-z_]\w*$/).default('solution'),
        comparator: z.enum(['text', 'json']),
        call_style_required: z.boolean().optional(),
        dialect: z.literal('sqlite').optional(),
        ordered: z.boolean().optional()
    }),
    required_constructs: z.array(z.string()).default([]),
    forbidden_constructs: z.array(z.string()).default([]),
    test_constraints: z.record(z.string(), z.unknown()).optional()
}).passthrough();

export const draftSchema = z.object({
    reference_solution: z.string().min(1).max(20000),
    starter_code: z.string().max(20000),
    test_cases: z.array(z.object({
        input: z.string().max(12000).nullable().optional(),
        arguments: z.array(z.unknown()).max(32).nullable().optional(),
        call_style: z.enum(['spread', 'single']).nullable().optional(),
        expected_output: z.string().max(20000),
        is_hidden: z.boolean(),
        category: z.enum(['normal', 'boundary']),
        explanation: z.string(),
        fixture_sql: z.string().max(20000).nullable().optional()
    })).min(4).max(8),
    fixture_sql: z.string().max(20000).nullable().optional()
}).passthrough();

export type Specification = z.infer<typeof specificationSchema>;
export type Draft = z.infer<typeof draftSchema>;
export interface CaseResult {
    case_index: number;
    is_hidden: boolean;
    category: string;
    input: string;
    expected: string;
    actual: string;
    stderr: string;
    passed: boolean;
    executed: boolean;
    status: string;
    runtime_ms: number;
    image: string;
    harness_version: string;
}
