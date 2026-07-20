
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import uuid

app = Flask(__name__)
CORS(app)

FILE_NAME = "tasks.json"


# ----------------------------
# Create JSON file if missing
# ----------------------------
if not os.path.exists(FILE_NAME):
    with open(FILE_NAME, "w") as f:
        json.dump([], f)


# ----------------------------
# Read Tasks
# ----------------------------
def read_tasks():
    with open(FILE_NAME, "r") as f:
        return json.load(f)


# ----------------------------
# Save Tasks
# ----------------------------
def save_tasks(tasks):
    with open(FILE_NAME, "w") as f:
        json.dump(tasks, f, indent=4)


# ----------------------------
# GET ALL TASKS
# ----------------------------
@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(read_tasks())


# ----------------------------
# ADD TASK
# ----------------------------
@app.route("/tasks", methods=["POST"])
def add_task():

    data = request.get_json()

    if not data or "title" not in data:
        return jsonify({"error": "Task title required"}), 400

    tasks = read_tasks()

    new_task = {
        "id": str(uuid.uuid4()),
        "title": data["title"],
        "completed": False
    }

    tasks.append(new_task)

    save_tasks(tasks)

    return jsonify(new_task), 201


# ----------------------------
# UPDATE TASK
# ----------------------------
@app.route("/tasks/<task_id>", methods=["PUT"])
def update_task(task_id):

    data = request.get_json()

    tasks = read_tasks()

    found = False

    for task in tasks:

        if task["id"] == task_id:

            task["title"] = data["title"]
            task["completed"] = data["completed"]

            found = True
            break

    if not found:
        return jsonify({"error": "Task not found"}), 404

    save_tasks(tasks)

    return jsonify({"message": "Task Updated"})


# ----------------------------
# DELETE TASK
# ----------------------------
@app.route("/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id):

    tasks = read_tasks()

    new_tasks = []

    deleted = False

    for task in tasks:

        if task["id"] != task_id:
            new_tasks.append(task)
        else:
            deleted = True

    if not deleted:
        return jsonify({"error": "Task not found"}), 404

    save_tasks(new_tasks)

    return jsonify({"message": "Task Deleted"})


# ----------------------------
# Run Server
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)


