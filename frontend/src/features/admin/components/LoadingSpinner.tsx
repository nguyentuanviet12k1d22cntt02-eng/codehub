export function LoadingSpinner({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]}`}></div>
            {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
    );
}

export function PageLoader({ text = 'Đang tải...' }: { text?: string }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-xl text-gray-700">{text}</p>
            </div>
        </div>
    );
}

export function TableLoader() {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
