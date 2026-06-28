import os


EXTENSION_MAP = {
    ".py": "Python",
    ".js": "JavaScript",
    ".jsx": "React JSX",
    ".ts": "TypeScript",
    ".tsx": "React TypeScript",
    ".java": "Java",
    ".cpp": "C++",
    ".c": "C",
    ".cs": "C#",
    ".go": "Go",
    ".rb": "Ruby",
    ".php": "PHP",
    ".html": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".json": "JSON",
    ".xml": "XML",
    ".ipynb": "Jupyter Notebook",
    ".md": "Markdown",
    ".sql": "SQL",
    ".sh": "Shell Script"
}


def detect_languages(project_path):

    detected_languages = set()

    for root, dirs, files in os.walk(project_path):

        for file in files:

            extension = os.path.splitext(file)[1].lower()

            if extension in EXTENSION_MAP:

                detected_languages.add(
                    EXTENSION_MAP[extension]
                )

    return sorted(list(detected_languages))