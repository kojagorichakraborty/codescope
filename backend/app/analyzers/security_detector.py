import os

SECURITY_PATTERNS = {

    "eval(": "Use of eval() detected",

    "exec(": "Use of exec() detected",

    "os.system(": "Shell command execution detected",

    "subprocess": "Subprocess usage detected",

    "API_KEY": "Possible hardcoded API key",

    "SECRET_KEY": "Possible hardcoded secret key",

    "password": "Possible hardcoded password"

}


def detect_security_issues(project_path):

    issues = []

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

                        for pattern, issue in \
                                SECURITY_PATTERNS.items():

                            if pattern in line:

                                issues.append(
                                    {
                                        "file":
                                        os.path.relpath(
                                            file_path,
                                            project_path
                                        ),

                                        "line":
                                        line_number,

                                        "issue":
                                        issue
                                    }
                                )

            except Exception:
                continue

    return issues