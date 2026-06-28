import os

COMMON_ENTRY_POINTS = [
    "main.py",
    "app.py",
    "run.py",
    "manage.py",
    "server.py",
    "index.js",
    "main.jsx",
    "main.tsx",
    "index.html"
]


def detect_entry_points(project_path):

    entry_points = []

    for root, dirs, files in os.walk(project_path):

        for file in files:

            if file in COMMON_ENTRY_POINTS:

                entry_points.append(
                    os.path.relpath(
                        os.path.join(root, file),
                        project_path
                    )
                )

    return entry_points