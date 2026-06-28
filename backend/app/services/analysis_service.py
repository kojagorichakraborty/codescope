import os

from app.analyzers.dependency_extractor import \
    extract_dependencies

from app.analyzers.cycle_detector import \
    detect_cycles

from app.analyzers.language_detector import \
    detect_languages

from app.analyzers.framework_detector import \
    detect_frameworks

from app.analyzers.entrypoint_detector import \
    detect_entry_points

from app.analyzers.todo_detector import \
    detect_todos

from app.analyzers.security_detector import \
    detect_security_issues

from app.analyzers.large_file_detector import \
    detect_large_files

from app.analyzers.file_summary_generator import \
    generate_file_summaries


def analyze_repository(project_path):

    dependencies = {}

    # Scan Python files and build dependency graph
    for root, dirs, files in os.walk(project_path):

        for file in files:

            if file.endswith(".py"):

                file_path = os.path.join(root, file)

                imports = extract_dependencies(
                    file_path
                )

                dependencies[file] = imports

    # Existing issue detection
    cycles = detect_cycles(dependencies)

    unused_modules = []

    for module in dependencies:

        used = False

        for imports in dependencies.values():

            if module.replace(".py", "") in imports:

                used = True
                break

        if not used:

            unused_modules.append(module)

    highly_coupled = []

    for module, imports in dependencies.items():

        if len(imports) > 5:

            highly_coupled.append(module)

    # New analyzers

    languages = detect_languages(
        project_path
    )

    frameworks = detect_frameworks(
        project_path
    )

    entry_points = detect_entry_points(
        project_path
    )

    todos = detect_todos(
        project_path
    )

    security_issues = detect_security_issues(
        project_path
    )

    large_files = detect_large_files(
        project_path
    )

    file_summaries = generate_file_summaries(
        project_path
    )

    summary = {

        "total_python_files":
        len(dependencies),

        "total_cycles":
        len(cycles),

        "total_unused_modules":
        len(unused_modules),

        "total_highly_coupled_modules":
        len(highly_coupled),

        "health_score":
        max(
            0,
            100
            - len(cycles) * 10
            - len(unused_modules) * 5
            - len(highly_coupled) * 5
        )
    }

    issues = {

        "cycles":
        cycles,

        "unused_modules":
        unused_modules,

        "highly_coupled":
        highly_coupled
    }

    return {

        "summary":
        summary,

        "dependencies":
        dependencies,

        "issues":
        issues,

        "languages":
        languages,

        "frameworks":
        frameworks,

        "entry_points":
        entry_points,

        "todos":
        todos,

        "security_issues":
        security_issues,

        "large_files":
        large_files,

        "file_summaries":
        file_summaries
    }