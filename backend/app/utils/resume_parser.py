def parse_resume(text: str) -> dict:
    sections = {
        "skills": [],
        "education": [],
        "projects": [],
        "experience": [],
        "certifications": [],
        "raw_text": text
    }

    current_section = None

    for line in text.splitlines():
        line = line.strip()

        if not line:
            continue

        lower = line.lower()

        if lower == "skills":
            current_section = "skills"
            continue

        elif lower == "education":
            current_section = "education"
            continue

        elif lower == "projects":
            current_section = "projects"
            continue

        elif lower == "experience":
            current_section = "experience"
            continue

        elif lower == "certifications":
            current_section = "certifications"
            continue

        if current_section:
            sections[current_section].append(line)

    return sections