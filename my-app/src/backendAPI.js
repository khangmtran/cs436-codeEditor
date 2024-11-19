const BACKEND_BASE_URL = "http://localhost:4000"; // Replace with your backend server URL

export const fetchProjects = async () => {
    const response = await fetch(`${BACKEND_BASE_URL}/projects`);
    return response.json();
};

export const saveProject = async (project) => {
    const response = await fetch(`${BACKEND_BASE_URL}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
    });
    return response.json();
};
