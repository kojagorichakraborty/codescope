import os

KEYWORDS = [
    "TODO",
    "FIXME",
    "BUG",
    "HACK",
    "XXX"
]


def detect_todos(project_path):

    todos = []

    for root, dirs, files in os.walk(project_path):

        for file in files:

            file_path = os.path.join(root, file)

            try:

                with open(
                    file_path,
                    "r",
                    encoding="utf-8",
                    errors="ignore"
                ) as f:

                    for line_number, line in enumerate(
                        f,
                        start=1
                    ):

                        for keyword in KEYWORDS:

                            if keyword in line:

                                todos.append(
                                    {
                                        "file":
                                        os.path.relpath(
                                            file_path,
                                            project_path
                                        ),

                                        "line":
                                        line_number,

                                        "message":
                                        line.strip()
                                    }
                                )

            except Exception:
                continue

    return todos