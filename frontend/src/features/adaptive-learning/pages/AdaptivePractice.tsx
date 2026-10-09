import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Trang AdaptivePractice cũ đã được dọn sạch nội dung theo yêu cầu.
 * Tự động chuyển hướng toàn bộ người dùng về trang Luyện tập AI (/personalized-path).
 */
const AdaptivePractice: React.FC = () => {
    return <Navigate to="/personalized-path" replace />;
};

export default AdaptivePractice;
