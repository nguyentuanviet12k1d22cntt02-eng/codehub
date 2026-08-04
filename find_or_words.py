import docx

doc = docx.Document("NguyenTuanViet_ De_Cuong_Tot_Nghiep_CNTT.docx")

print("Occurrences of 'hoặc' or 'hay' in docx paragraphs:")
for idx, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    words = text.lower().split()
    if 'hoặc' in words or 'hay' in words or 'hữu' in words or '/' in text:
        print(f"Paragraph {idx}: {text[:150]}...")
