interface ErrorDisplayProps {
    message?: string;
    onRetry?: () => void;
    fullPage?: boolean;
}

export function ErrorDisplay({
    message = 'Đã xảy ra lỗi khi tải dữ liệu',
    onRetry,
    fullPage = false
}: ErrorDisplayProps) {
    const content = (
        <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Thử lại
                </button>
            )}
        </div>
    );

    if (fullPage) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                {content}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-12">
            {content}
        </div>
    );
}

export function EmptyState({
    icon = '📭',
    title = 'Không có dữ liệu',
    description,
    action
}: {
    icon?: string;
    title?: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}) {
    return (
        <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            {description && <p className="text-gray-600 mb-6">{description}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
