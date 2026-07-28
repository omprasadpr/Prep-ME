import fitz


def extract_text_from_pdf(file_path: str) -> str:
    pdf = fitz.open(file_path)

    pages = []

    for page in pdf:
        text = page.get_text()

        # Remove extra spaces
        text = text.strip()

        # Remove blank lines
        lines = text.splitlines()
        lines = [line.strip() for line in lines if line.strip()]

        pages.append("\n".join(lines))

    pdf.close()

    return "\n\n".join(pages)