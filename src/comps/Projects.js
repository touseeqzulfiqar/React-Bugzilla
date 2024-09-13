import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import NavBar from "./NavBar";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/projects", {
          headers: {
            Authorization: ` ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.data && Array.isArray(response.data)) {
          setProjects(response.data);
        } else if (
          response.data &&
          response.data.projects &&
          Array.isArray(response.data.projects)
        ) {
          setProjects(response.data.projects);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      fetchProjects();
    }
  }, [role]);

  const handleAddProject = async () => {
    try {
      const newUserProject = {
        project: {
          name: projectForm.name,
          description: projectForm.description,
        },
      };

      await axios.post("http://localhost:3000/projects", newUserProject, {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      refreshProjects();
      resetModal();
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleEditProject = async (project) => {
    setIsEditing(true);
    setCurrentProjectId(project.id);
    setProjectForm({ name: project.name, description: project.description });
    setShowModal(true);
  };

  const handleUpdateProject = async () => {
    try {
      const updatedProject = {
        project: {
          name: projectForm.name,
          description: projectForm.description,
        },
      };

      await axios.put(
        `http://localhost:3000/projects/${currentProjectId}`,
        updatedProject,
        {
          headers: {
            Authorization: `${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      refreshProjects();
      resetModal();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  // Update handleDeleteProject to remove the project from the list without refetching
  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`http://localhost:3000/projects/${projectId}`, {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
        },
      });

      // Remove the deleted project from the list by filtering it out
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const refreshProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3000/projects", {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setProjects(response.data);
      } else if (
        response.data &&
        response.data.projects &&
        Array.isArray(response.data.projects)
      ) {
        setProjects(response.data.projects);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentProjectId(null);
    setProjectForm({ name: "", description: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prevProject) => ({ ...prevProject, [name]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar userRole={role.charAt(0).toUpperCase() + role.slice(1)} />
      <div className="w-4/5 m-auto">
        <div className="flex justify-between mt-10">
          <p className="text-3xl font-bold">Projects</p>
          <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
            <button
              onClick={() => setShowModal(true)}
              className="inline-block px-4 py-2 text-gray-700 hover:bg-gray-50 focus:relative"
              title="Add Project"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm mt-3">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Description
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td>{project.description}</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="inline-block rounded bg-yellow-700 p-2 text-xs font-medium text-white hover:bg-yellow-800 mx-2"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="inline-block rounded bg-red-600 p-2 text-xs font-medium text-white hover:bg-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No projects available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Project */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Project" : "Add New Project"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isEditing) {
                  handleUpdateProject();
                } else {
                  handleAddProject();
                }
              }}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={projectForm.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={projectForm.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={resetModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
