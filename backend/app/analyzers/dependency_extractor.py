import ast

def extract_dependencies(file_path):

    with open(file_path, "r") as file:
        tree = ast.parse(file.read())

    imports = []

    for node in ast.walk(tree):

        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.append(alias.name)

        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.append(node.module)

    return imports