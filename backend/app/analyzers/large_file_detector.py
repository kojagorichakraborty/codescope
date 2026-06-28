import os


def detect_large_files(
        project_path,
        threshold=300
):

    large_files = []

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

                    line_count = len(f.readlines())

                    if line_count > threshold:

                        large_files.append(
                            {
                                "file":
                                os.path.relpath(
                                    file_path,
                                    project_path
                                ),

                                "lines":
                                line_count
                            }
                        )

            except Exception:
                continue

    return large_files