// In Projects.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // Import Link
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

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`http://localhost:3000/projects/${projectId}`, {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
        },
      });

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
                    <td>
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td>{project.description}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-500">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-yellow-500 hover:underline"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:underline ml-4"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Project */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={resetModal}
        >
          <div
            className="w-1/3 bg-white p-4 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Project" : "Add New Project"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                isEditing ? handleUpdateProject() : handleAddProject();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={projectForm.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={projectForm.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={resetModal}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
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
