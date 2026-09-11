import { Link } from 'react-router-dom';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    link?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export function AdminStatCard({ title, value, icon, link, trend, color = 'blue' }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        red: 'bg-red-50 text-red-600'
    };

    const content = (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-gray-500 ml-2">vs tháng trước</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center text-2xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return link ? (
        <Link to={link} className="block">
            {content}
        </Link>
    ) : (
        content
    );
}

interface QuickActionProps {
    title: string;
    description: string;
    icon: string;
    onClick?: () => void;
    link?: string;
    color?: 'blue' | 'green' | 'purple' | 'orange';
}

export function QuickActionCard({ title, description, icon, onClick, link, color = 'blue' }: QuickActionProps) {
    const colorClasses = {
        blue: 'bg-blue-500 hover:bg-blue-600',
        green: 'bg-green-500 hover:bg-green-600',
        purple: 'bg-purple-500 hover:bg-purple-600',
        orange: 'bg-orange-500 hover:bg-orange-600'
    };

    const content = (
        <div className={`${colorClasses[color]} text-white rounded-lg p-6 cursor-pointer transition-colors`}>
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm opacity-90">{description}</p>
        </div>
    );

    return link ? (
        <Link to={link}>{content}</Link>
    ) : (
        <div onClick={onClick}>{content}</div>
    );
}
