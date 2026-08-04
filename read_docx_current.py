import docx

doc = docx.Document("NguyenTuanViet_ De_Cuong_Tot_Nghiep_CNTT.docx")

with open("NguyenTuanViet_De_Cuong_Tot_Nghiep_CNTT_current.md", "w", encoding="utf-8") as f:
    for idx, p in enumerate(doc.paragraphs):
        text = p.text.strip()
        if text:
            f.write(f"Paragraph {idx}: {text}\n\n")
print("Done!")
