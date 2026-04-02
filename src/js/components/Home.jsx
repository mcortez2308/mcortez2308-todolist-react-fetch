import React, { useState, useEffect } from "react";

const URL_BASE = import.meta.env.VITE_BACKEND_URL

/* Este codigo es con API */
const Home = () => {
	const [tarea, setTarea] = useState({
		label: "",
		is_done: false
	});

	console.log(URL_BASE)

	const [todolist, setTodoList] = useState([]);

	const [statusTasks, setStatusTasks] = useState("alltasks");

	const crearUsuario = async (user) => {
		try {
			const response = await fetch(`${VITE_BACKEND_URL}/users/${user}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					username: user
				})
			});

			if (response.ok) {
				getTareas();
			}
		} catch (error) {
			console.error("Error al crear el usuario:", error);
		}
	}

	const getTareas = async () => {
		try {
			const response = await fetch(`${URL_BASE}/users/mcortez`);
			const data = await response.json();
			if (response.ok) {
				setTodoList(data.todos);
			}
			if (response.status === 404) {
				console.log("Usuario no encontrado");
				crearUsuario("mcortez");
			}

		} catch (error) {
			console.error("Error al obtener las tareas:", error);
		}

	}

	function handleChange(event) {
		setTarea({
			...tarea,
			[event.target.name]: event.target.value
		});
	}

	async function agregarTarea(event) {
		try {
			if (event.key === "Enter") {
				if (tarea.label.trim() === "") {
					alert("Por favor, ingresa una tarea válida.");
					return;
				}

				const response = await fetch(`${URL_BASE}/todos/mcortez`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(tarea)
				});

				setTarea({
					label: "",
					is_done: false
				});

				if (response.ok) {
					getTareas();
				}
			}
		} catch (error) {

		}
	}

	const eliminarTarea = async (id) => {
		try {
			const response = await fetch(`${URL_BASE}/todos/${id}`, {
				method: "DELETE"
			});

			if (response.ok) {
				getTareas();
			}
		}
		catch (error) {
			console.error("Error al eliminar la tarea:", error);
		}
	}

	const actualizarTarea = async (id) => {
		try {
			const tareaActualizada = todolist.find(tarea => tarea.id === id);
			if (!tareaActualizada) {
				console.error("Tarea no encontrada");
				return;
			}

			const response = await fetch(`${URL_BASE}/todos/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					...tareaActualizada,
					is_done: !tareaActualizada.is_done
				})
			});

			if (response.ok) {
				getTareas();
			}
		} catch (error) {
			console.error("Error al actualizar la tarea:", error);
		}
	}

	useEffect(() => {
		getTareas();
	}, []);

	const tareasfiltradas = todolist.filter(tarea => {
		if (statusTasks === "donetasks") return tarea.is_done
		if (statusTasks === "pendingtasks") return !tarea.is_done
		return true;
	});

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-12 col-md-6">
					<h1 className="text-center">Mi Lista de Tareas</h1>
					<input className="form-control"
						type="text"
						name="label"
						placeholder="Agrega la tarea"
						value={tarea.label}
						onChange={handleChange}
						onKeyDown={agregarTarea} />

					<ul>
						{
							tareasfiltradas.length <= 0 ? (
								<li>No hay tareas</li>
							) : (
								tareasfiltradas.map((tarea, index) => (
									<li key={index}>
										{tarea.label}
										<div className="task-actions">
											<span className="update-task" onClick={() => actualizarTarea(tarea.id)}>{tarea.is_done ? <i className="fa-regular fa-circle-check"></i> : <i className="fa-regular fa-circle"></i>}</span>
											<span className="delete-signal" onClick={() => eliminarTarea(tarea.id)}>
												<i className="fa-regular fa-trash-can"></i>
											</span>
										</div>
									</li>
								))
							)
						}
					</ul>
					<p>Cantidad de Tareas: {todolist.length}</p>
					<div className="filter-options d-flex justify-content-center">
						<div className="form-check form-check-inline">
							<input className="form-check-input" checked={statusTasks === "alltasks"} onChange={() => setStatusTasks("alltasks")} type="radio" name="inlineRadioOptions" id="alltasks" value="alltasks" />
							<label className="form-check-label" htmlFor="alltasks">Todas las tareas</label>
						</div>
						<div className="form-check form-check-inline">
							<input className="form-check-input" checked={statusTasks === "donetasks"} onChange={() => setStatusTasks("donetasks")} type="radio" name="inlineRadioOptions" id="donetasks" value="donetasks" />
							<label className="form-check-label" htmlFor="donetasks">Tareas Completadas</label>
						</div>
						<div className="form-check form-check-inline">
							<input className="form-check-input" checked={statusTasks === "pendingtasks"} onChange={() => setStatusTasks("pendingtasks")} type="radio" name="inlineRadioOptions" id="pendingtasks" value="pendingtasks" />
							<label className="form-check-label" htmlFor="pendingtasks">Tareas Pendientes</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	)

}



/* Este codigo es Sin llamado a API
const Home = () => {
	
	const [inputValue, setInputValue] = useState("");
	const [todolist, setTodoList] = useState([]);

	function handleChange(event) {
		setInputValue(event.target.value)
	}

	function addTask(event) {
		if (event.key == "Enter") {
			if (inputValue.trim() === "") {
				alert("Por favor, ingresa una tarea válida.");
				return
			};

			setTodoList([
				...todolist,
				inputValue
			]
			)

			setInputValue("");
		}

	}

	function removeTask(index) {
		const newTodoList = [...todolist];
		newTodoList.splice(index, 1);
		setTodoList(newTodoList);
	}

	return (
		<div className="container">
			<div className="row">
				<div className="col-12">
					<input className="inputtext"
						type="text"
						placeholder="Agregar Tarea"
						value={inputValue}
						onChange={handleChange}
						onKeyDown={addTask} />
					<ul>
						{
							todolist.map((task, index) => {
								return <li key={index}>
									{task}
									<span className="remove-task"
										onClick={() => removeTask(index)}>
										X
									</span>
								</li>
							})
						}
					</ul>
				</div>
			</div>
		</div>
	);
	
};
*/

export default Home;