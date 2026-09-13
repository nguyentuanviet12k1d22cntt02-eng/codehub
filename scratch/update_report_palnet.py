with open('scratch/build_final_word_report.py', 'r', encoding='utf-8') as f:
    code = f.read()

replacements = [
    (
        'add_bullet("Nhánh 4 - Trợ lý AI & Lộ trình Thích ứng (Adaptive ZPD):", "Trái tim thông minh gồm Mascot AI Chatbot đồng hành 24/7, Phân cụm 4 phong cách người học (Archetypes), Động cơ theo dõi tri thức BKT & Deep DKT PyTorch LSTM, Đồ thị kỹ năng DAG 33 nodes, và Quy trình Multi-Agent Critic tự động kiểm duyệt mã giải mẫu.", True)',
        'add_bullet("Nhánh 4 - Trợ lý AI & Lộ trình Thích ứng (Adaptive ZPD):", "Trái tim thông minh gồm Mascot AI Chatbot đồng hành 24/7, Phân cụm 4 phong cách người học (Archetypes), Động cơ theo dõi tri thức mạng nơ-ron đồ thị PALNet (GCN & Attention Mechanism), Đồ thị kỹ năng DAG 33 nodes, và Quy trình Multi-Agent Critic tự động kiểm duyệt mã giải mẫu.", True)'
    ),
    (
        'add_bullet("Hệ thống AI Service (Tác nhân dịch vụ thông minh bên phải):", "Vi dịch vụ ngoại vi xử lý thuật toán Deep Knowledge Tracing (DKT), truy vấn đồ thị DAG, điều phối Multi-Agent và sinh nội dung học theo Vùng phát triển gần (ZPD).", True)',
        'add_bullet("Hệ thống AI Service (Tác nhân dịch vụ thông minh bên phải):", "Vi dịch vụ ngoại vi xử lý mô hình mạng nơ-ron đồ thị PALNet (GCN & Attention), truy vấn đồ thị DAG, điều phối Multi-Agent và sinh nội dung học theo Vùng phát triển gần (ZPD).", True)'
    ),
    (
        'add_bullet("UC13: Chẩn đoán tri thức DKT & Sinh bài học thích ứng ZPD:", "AI Microservice tự động chạy mô hình Deep Knowledge Tracing (DKT PyTorch LSTM), phân cụm Archetype, rà soát lỗ hổng trên Đồ thị kỹ năng DAG 33 nodes, sinh bài học và dùng CriticEvaluatorAgent thẩm định code mẫu.", True)',
        'add_bullet("UC13: Chẩn đoán tri thức PALNet & Sinh bài học thích ứng ZPD:", "AI Microservice tự động chạy mô hình mạng nơ-ron đồ thị PALNet (kết hợp Graph Convolutional Network - GCN và cơ chế Attention), phân cụm Archetype, rà soát lỗ hổng trên Đồ thị kỹ năng DAG 33 nodes, sinh bài học và dùng CriticEvaluatorAgent thẩm định code mẫu.", True)'
    ),
    (
        '("UC13", "Chẩn đoán tri thức DKT & Sinh bài ZPD", "Hệ thống AI", "Hệ thống AI", "Hệ thống AI"),',
        '("UC13", "Chẩn đoán tri thức PALNet & Sinh bài ZPD", "Hệ thống AI", "Hệ thống AI", "Hệ thống AI"),'
    ),
    (
        'add_bullet("Động cơ theo dõi tri thức (BKT & Deep DKT PyTorch):", "Kết hợp mô hình xác suất Bayesian Knowledge Tracing (BKT) và mạng nơ-ron hồi quy sâu Deep Knowledge Tracing (DKT PyTorch LSTM) để dự đoán chính xác xác suất giải đúng bài tập tiếp theo của người học.", True)',
        'add_bullet("Mô hình mạng đồ thị theo dõi tri thức PALNet (PyTorch GCN & Attention):", "Ứng dụng mạng nơ-ron đồ thị PALNet (Personalized Adaptive Learning Network) tích hợp 2 tầng tích chập đồ thị (GCN) trên ma trận kề DAG kỹ năng, bộ mã hóa hồ sơ học viên (Learner Profile Embedding) và cơ chế Attention theo ngữ cảnh để dự báo chuẩn xác năng lực thông thạo từng khái niệm của người học.", True)'
    ),
    (
        '("Học Máy & DKT", "PyTorch, Scikit-Learn", "Mô hình hóa chuỗi tri thức người học bằng Deep Knowledge Tracing (DKT LSTM) & BKT"),',
        '("Mô Hình Đồ Thị PALNet", "PyTorch, Scikit-Learn", "Mô hình hóa tri thức người học bằng mạng đồ thị PALNet (GCN & Multi-Head Attention)"),'
    ),
    (
        'Deep Knowledge Tracing PyTorch LSTM',
        'mạng nơ-ron đồ thị PALNet (GCN & Attention)'
    )
]

for old, new in replacements:
    if old not in code:
        print("WARNING: not found:", old[:40])
    else:
        code = code.replace(old, new)

with open('scratch/build_final_word_report.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated scratch/build_final_word_report.py successfully!")
