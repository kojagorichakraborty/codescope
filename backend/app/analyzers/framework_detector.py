import os


FRAMEWORK_PATTERNS = {
    "fastapi": "FastAPI",
    "flask": "Flask",
    "django": "Django",
    "react": "React",
    "streamlit": "Streamlit",
    "tensorflow": "TensorFlow",
    "torch": "PyTorch",
    "numpy": "NumPy",
    "pandas": "Pandas",
    "sklearn": "Scikit-Learn",
    "opencv": "OpenCV",
    "cv2": "OpenCV",
    "matplotlib": "Matplotlib",
    "seaborn": "Seaborn",
    "keras": "Keras",
    "next": "Next.js",
    "express": "Express.js",
    "vue": "Vue.js",
    "angular": "Angular"
}


def detect_frameworks(project_path):

    detected_frameworks = set()

    for root, dirs, files in os.walk(project_path):

        for file in files:

            if file.endswith((
                ".py",
                ".js",
                ".jsx",
                ".ts",
                ".tsx"
            )):

                file_path = os.path.join(root, file)

                try:
                    with open(
                        file_path,
                        "r",
                        encoding="utf-8",
                        errors="ignore"
                    ) as f:

                        content = f.read().lower()

                        for pattern, framework in FRAMEWORK_PATTERNS.items():

                            if (
                                f"import {pattern}" in content
                                or
                                f"from {pattern}" in content
                                or
                                f"require('{pattern}')" in content
                                or
                                f'require("{pattern}")' in content
                            ):

                                detected_frameworks.add(framework)

                except Exception:
                    continue

    return list(detected_frameworks)