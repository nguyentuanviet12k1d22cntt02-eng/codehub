export type BlockType =
    | 'heading'
    | 'paragraph'
    | 'list'
    | 'callout'
    | 'note'
    | 'divider'
    | 'code'
    | 'output'
    | 'explanation'
    | 'exercise'
    | 'quiz'
    | 'theory'
    | 'table'
    | 'erd'
    | 'image'
    | 'video';

export interface LessonBlock {
    id: string;
    type: BlockType;
    title?: string;
    content: string;
    headingLevel?: 'H1' | 'H2' | 'H3';
    language?: string;
    showLineNumbers?: boolean;
    allowCopy?: boolean;
    theme?: 'Dark' | 'Light';
    fontSize?: string;
    // Table / Output
    tableHeaders?: string[];
    tableRows?: string[][];
    tableNote?: string;
    // Callout / Explanation
    calloutType?: 'info' | 'tip' | 'warning' | 'explanation';
    // Exercise
    solutionCode?: string;
    isSolutionVisible?: boolean;
    // Advanced
    htmlId?: string;
    internalNote?: string;
}

export interface PaletteItem {
    type: BlockType;
    label: string;
    icon: React.ReactNode;
}

export interface PaletteCategory {
    title: string;
    items: PaletteItem[];
}
