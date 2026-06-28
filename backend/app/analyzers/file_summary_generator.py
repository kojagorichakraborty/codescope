import os
import ast


def estimate_role(file_name):

    if "router" in file_name.lower():
        return "API Layer"

    elif "service" in file_name.lower():
        return "Business Logic"

    elif "model" in file_name.lower():
        return "Data Model"

    elif "test" in file_name.lower():
        return "Testing"

    elif "main" in file_name.lower():
        return "Application Entry Point"

    else:
        return "General Module"


def generate_file_summaries(project_path):

    summaries = []

    for root, dirs, files in os.walk(project_path):

        for file in files:

            if not file.endswith(".py"):
                continue

            file_path = os.path.join(root, file)

            try:

                with open(
                    file_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    tree = ast.parse(f.read())

                    imports = []
                    functions = []
                    classes = []

                    for node in ast.walk(tree):

                        if isinstance(node, ast.Import):

                            for name in node.names:
                                imports.append(
                                    name.name
                                )

                        elif isinstance(
                                node,
                                ast.ImportFrom
                        ):

                            imports.append(
                                node.module
                            )

                        elif isinstance(
                                node,
                                ast.FunctionDef
                        ):

                            functions.append(
                                node.name
                            )

                        elif isinstance(
                                node,
                                ast.ClassDef
                        ):

                            classes.append(
                                node.name
                            )

                    summaries.append(
                        {
                            "file":
                            os.path.relpath(
                                file_path,
                                project_path
                            ),

                            "imports":
                            imports,

                            "functions":
                            functions,

                            "classes":
                            classes,

                            "estimated_role":
                            estimate_role(file)
                        }
                    )

            except Exception:
                continue

    return summaries